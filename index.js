const fs = require('fs');
require("./PirateBrawl.Server/Debug/Debugger");

const net = require('net');
const config = require("./config.json");
const MessageFactory = require("./PirateBrawl.Logic/MessageFactory");
const MessagesHandler = require("./PirateBrawl.Server/Protocol/MessagesHandler");
const Queue = require("./PirateBrawl.Server/Network/Queue");

const LoadCSV = require("./GameFiles/LoadCSV");
LoadCSV.loadCSV();

const readline = require("readline");
const rl = readline.createInterface({
  'input': process.stdin,
  'output': process.stdout
});
global.rl = rl;

const server = new net.Server();
const Messages = new MessageFactory();
const PORT = config.port;

global.sessions = new Map();
global.ipSessions = new Map()
global.Battles = new Map();
global.ServerStarted = new Date();
global.online = 0;
global.backgroundID = 0;
const MAX_SESSIONS_PER_IP = 3
const BLOCKED_IPS_FILE = './PirateBrawl.Titan/JSON/blockedIPs.json'

const loadBlockedIPs = () => {
  try {
    const data = fs.readFileSync(BLOCKED_IPS_FILE, 'utf8')
    const parsed = JSON.parse(data)
    return parsed.blockedIPs || []
  } catch (error) {
    console.error("Высрали ошибку при загрузке блокнутых ипи:", error)
    return []
  }
}

const addIPToBlocked = (ip) => {
  const blockedIPs = loadBlockedIPs()
  if (!blockedIPs.includes(ip)) {
    blockedIPs.push(ip)
    fs.writeFileSync(BLOCKED_IPS_FILE, JSON.stringify({ blockedIPs }, null, 2))
    console.log(`добавил ${ip} в блокнутые`)
  }
}

const isIPBlocked = (ip) => {
  const blockedIPs = loadBlockedIPs()
  return blockedIPs.includes(ip)
}

const clearSessionsByIP = (ip) => {
  if (global.ipSessions.has(ip)) {
    const sessionIds = global.ipSessions.get(ip)
    sessionIds.forEach((sessionId) => {
      const session = global.sessions.get(sessionId)
      if (session) {
        destroySession(session, "warn", `Проблемный айпи ${ip} создает очень много запросов! Аварийно сбрасываю все сессии.`);
      }
    });
    global.ipSessions.delete(ip)
    addIPToBlocked(ip)
  }
};

const getLastSessionId = () => {
  const sessionsIds = Array.from(global.sessions.keys());
  return sessionsIds.length === 0 ? 0 : sessionsIds[sessionsIds.length - 1];
};

const destroySession = (session, logType = "log", reason = "Client disconnected.") => {
  if (!session) return;

  switch (logType) {
    case "log":
      session.log(reason);
      break;
    case "warn":
      session.warn(reason);
      break;
    case "err":
      session.errLog(reason);
      break;
    default:
      session.log(reason);
  }

  session.destroy();
  global.online -= 1;
  global.sessions.delete(session.id);

  if (global.ipSessions.has(session.ip)) {
    const sessionsByIP = global.ipSessions.get(session.ip);
    const filteredSessions = sessionsByIP.filter((id) => id !== session.id);
    if (filteredSessions.length > 0) {
      global.ipSessions.set(session.ip, filteredSessions);
    } else {
      global.ipSessions.delete(session.ip);
    }
  }
};

const checkIPConnections = (ip) => {
  if (global.ipSessions.has(ip)) {
    return global.ipSessions.get(ip).length;
  }
  return 0;
};

server.on('connection', async (session) => {
  const sessionIp = session.remoteAddress.split(':').slice(-1)[0];

  if (isIPBlocked(sessionIp)) {
    return session.destroy();
  }

  session.setNoDelay(true);
  session.setTimeout(config.session.timeoutSeconds * 1000);

  session.ip = sessionIp;

  session.log = (text) => Client(session.ip, text);
  session.warn = (text) => ClientWarn(session.ip, text);
  session.errLog = (text) => ClientError(session.ip, text);

  session.id = getLastSessionId() + 1;
  session.queue = new Queue(config.queue.maxSize, config.disableQueuebugtxtFile);

  const sessionCount = checkIPConnections(sessionIp)
  if (sessionCount >= MAX_SESSIONS_PER_IP) {
    session.warn(`Проблемный IP: ${sessionIp}. Закрываю все сессии с этого айпи.`)
    clearSessionsByIP(sessionIp)
    return session.destroy()
  }

  global.sessions.set(session.id, session);
  if (!global.ipSessions.has(sessionIp)) {
    global.ipSessions.set(sessionIp, []);
  }
  global.ipSessions.get(sessionIp).push(session.id);

  session.log(`New connect: (SESSIONID: ${session.id})`);
  global.online += 1;

  const MessageHandler = new MessagesHandler(session, Messages);

  session.on('data', async (bytes) => {
    let messageHeader = {};

    session.queue.push(bytes);

    switch (session.queue.state) {
      case session.queue.QUEUE_OVERFILLED:
        if (config.queue.enableOverfillingWarning) session.warn(`Queue is overfilled! Queue size: ${session.queue.size()}`);

        if (config.queue.disconnectSessionOnOverfilling) {
          return destroySession(session, "warn", "Client disconnected.");
        }
        break;
      case session.queue.QUEUE_PUSHED_MORE_THAN_EXPECTED:
        session.warn(`Queue got more bytes than expected! Expected: ${session.queue.getQueueExpectedSize()} size. Got: ${session.queue.size()} size.`);
        break;
      case session.queue.QUEUE_DETECTED_MERGED_PACKETS:
        session.warn(`Queue detected merged packets!`);
        break;
    }

    if (!session.queue.isBusy()) {
      const queueBytes = session.queue.release();

      if (Array.isArray(queueBytes)) {
        for (let packet of queueBytes) {
          await MessageHandler.handle(packet.id, packet.bytes, {});
        }
        return session.log("Merged packets were handled.");
      }

      messageHeader = {
        id: queueBytes.readUInt16BE(0),
        len: queueBytes.readUIntBE(2, 3),
        version: queueBytes.readUInt16BE(5),
        bytes: queueBytes.slice(7, messageHeader.len),
        _0x1: queueBytes.readUInt16BE(5),
        _0x2: queueBytes.readUInt16BE(5)
      };

      if (messageHeader.id === 10101) {
        if (messageHeader._0x1 !== 10 && messageHeader._0x2 !== 10) {
          return destroySession(session);
        }
      }

      await MessageHandler.handle(messageHeader.id, messageHeader.bytes, {});
    }
  });

  session.on('end', async () => {
    return destroySession(session, "log", "Client disconnected.");
  });

  session.on('error', async (error) => {
    if (error.message.includes("ECONNRESET")) {
      return destroySession(session, "log", "Client disconnected.");
    }

    try {
      destroySession(session, "err", "A wild error!");
      return console.error(error);
    } catch (e) {}
  });

  session.on('timeout', async () => {
    return destroySession(session, "warn", "Session timeout was reached.");
  });
});

const Events = require("./PirateBrawl.Server/Utils/Events");
new Events().update();

function getCurrentTimeInMSK() {
  const currentTime = new Date();
  currentTime.setUTCHours(currentTime.getUTCHours() + 3);
  const formattedTime = currentTime.toISOString().slice(11, 19);
  return formattedTime;
}

function checkAndUpdate() {
  const currentTimeInMSK = getCurrentTimeInMSK();
  if (currentTimeInMSK === '10:00:00') {
    new Events().update();
  }
}

setInterval(checkAndUpdate, 1000);

server.once("listening", () => {
  ServerLog(`${config.serverName} started on ${PORT} port!`);
  global.rl.on("close", () => {
    Warn("Server stopped!");
    server.close();
    process.exit(0x0);
  });
});

server.listen(PORT);

process.on("uncaughtException", (e) => Warn(e.stack));

process.on("unhandledRejection", (e) => Warn(e.stack));
