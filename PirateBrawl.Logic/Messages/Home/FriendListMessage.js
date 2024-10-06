const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const FriendEntry = require('../../Entries/FriendEntry')

class FriendListMessage extends PiranhaMessage {
    constructor (session) {
        super(session)
        this.session = session
        this.id = 20105
        this.version = 0

        this.friendsList = [
            new FriendEntry()
        ]
    }

    async encode() {
        this.stream.writeInt(0);
        this.stream.writeBoolean(false);
        this.stream.writeBoolean(true);
        this.stream.writeInt(1);
        for (const entry in this.friendsList) {
            entry.encode(this.stream);
        }
    }
}

module.exports = FriendListMessage;