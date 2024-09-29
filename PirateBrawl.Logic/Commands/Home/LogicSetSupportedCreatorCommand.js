const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class LogicSetSupportedCreatorCommand extends PiranhaMessage {
    constructor(session,) {
        super(session);
        this.id = 24111;
        this.session = session;
        this.version = 1;
        this.stream = new ByteStream();
    }

    async encode() {
        this.stream.writeVInt(215);
        this.stream.writeVInt(1);
        this.stream.writeString(this.session.AuthorCode);
        this.stream.writeVInt(1);
    }
}

module.exports = LogicSetSupportedCreatorCommand;
