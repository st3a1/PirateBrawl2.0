const dgram = require('dgram');
const ByteStream = 0//require('../../../PirateBrawl.Titan/Datastream/ByteStream');
const Session = 0//require('../../../Laser.Battle/Session');
const StartLoadingMessage = 0//require('../../../Laser.Logic/Battle/StartLoadingMessage');
const UDPConnectionInfo = 0//require('../../../Laser.Logic/Battle/UDPConnectionInfo');
var SessionSeed = 1
const sock = dgram.createSocket('udp4');
class UdpLaserSocketListener {
    static port = 1337;
    static sessions = new Map();

    static Init() {
        sock.bind(this.port);

        sock.on('message', (msg, rinfo) => {
            this.onReceive(msg, rinfo);
        });
    }

    static onReceive(buf, from) {
        const stream = new ByteStream(buf);

        const sid = (stream.readInt() << 32) | (stream.readInt() >>> 0);
        stream.readShort();
        let messageType = stream.readVInt();
        let messageEncodingLength = stream.readVInt();
        let messageBytes = stream.readBytes(messageEncodingLength);
        let messageStream = new ByteStream(messageBytes);
        if (!this.sessions[sid]) {
            const session = new Session(from, sid, sock);
            this.sessions[sid] = session;
            session.startBattleThread();
        }
    }
    static createBattleSessions(connections) {
        connections.forEach(connection => {
            connection.UdpSessionId = SessionSeed;
            SessionSeed++;
            sessions.set(connection.UdpSessionId, sock); // Note: This line may need to be adjusted as per your application logic
            new StartLoadingMessage(connection).send(); // Sending start loading message
            new UDPConnectionInfo(connection).send(); // Sending UDP connection info
        });
    }
}

module.exports = UdpLaserSocketListener;
