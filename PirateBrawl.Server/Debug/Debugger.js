require("colors");
const util = require("node:util");

const buildPrefix = (mainPrefix) => mainPrefix + " >> ".gray

const PREFIXES = {
    SERVER: buildPrefix("[SERVER]".blue.bold),
    WARN: buildPrefix("[WARNING]".yellow.bold),
    ERROR: buildPrefix("[ERROR]".red.bold),
    FATAL: buildPrefix("[FATAL]".red.bold),
    LOG: buildPrefix("[LOG]".green.bold),
}

const logging = (...args) => {
    console.log(...args);
}

const prepareArgs = (...args) => {
    const formattedArgs = args.map(arg => {
        if (typeof arg === 'string') {
            return arg.bold;
        }

        return util.inspect(arg, { colors: true });
    });

    return formattedArgs.join(" ");
};

const buildClientLogs = (prefix, ...args) => {
    logging(prefix + prepareArgs(...args))
}

const buildServerLogs = (prefix, ...args) => {
    logging(prefix + prepareArgs(...args))
}

// Server logs
global.Log = (...args) => buildServerLogs(PREFIXES.LOG, prepareArgs(...args))
global.Warn = (...args) => buildServerLogs(PREFIXES.WARN, prepareArgs(...args))
global.Err = (...args) => buildServerLogs(PREFIXES.ERROR, prepareArgs(...args))
global.ServerLog = (...args) => buildServerLogs(PREFIXES.SERVER, prepareArgs(...args))
global.Fatal = (...args) => {
    buildServerLogs(PREFIXES.FATAL, prepareArgs(...args))
    return process.exit(1)
}

global.Debug = (...args) => {
    const logLineDetails = ((new Error().stack).split("at ")[2]).trim();

    let file = logLineDetails.split(" ")[1].split("\\").slice(-1)[0].replace(")", "");

    if (!file.includes(":")) {
        file += ":" + logLineDetails.split(" ").slice(-1)[0].split(":").slice(-2).join(":").replace(")", "");
    }

    buildServerLogs(buildPrefix(`[${file}] (${new Date().toUTCString()})`.gray), prepareArgs(...args))
}

// Client logs
global.Client = (ip, ...args) => buildClientLogs(buildPrefix(`[${ip}]`.green.bold), prepareArgs(...args))
global.ClientWarn = (ip, ...args) => buildClientLogs(buildPrefix(`[${ip}]`.yellow.bold), prepareArgs(...args))
global.ClientError = (ip, ...args) => buildClientLogs(buildPrefix(`[${ip}]`.red.bold), prepareArgs(...args))