const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream");
const PiranhaMessage = require("../../../PirateBrawl.Titan/Message/PiranhaMessage");
const FriendListMessage = require("./FriendListMessage");

class AskForFriendListMessage extends PiranhaMessage {
    constructor (bytes, session) {
        super(session)
        this.id = 10504
        this.version = 0
        this.stream = new ByteStream(bytes);
    }

    async decode() {

    }

    async process () {
        await new FriendListMessage(this.session).send();
    }
}

module.exports = AskForFriendListMessage;