const Messaging = require("../../PirateBrawl.Server/Protocol/Messaging")
const ByteStream = require("../Datastream/ByteStream")

class PiranhaMessage extends Messaging{
    constructor(session) {
        super(session)
        this.session = session
        this.stream = new ByteStream();
        this.version = 0; // message version
    }

    ["decode"]() {}

    ["encode"]() {}

    ["process"]() {}

    getMessageType() {
        return 0;
    }

    getServiceNodeType() {
        return -1;
    }
}

module.exports = PiranhaMessage;