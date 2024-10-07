const ByteStream = require('../../../PirateBrawl.Titan/Datastream/ByteStream')
const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const FriendEntry = require('../../Entries/FriendEntry')

class FriendListMessage extends PiranhaMessage {
    constructor (session) {
        super(session)
        this.session = session
        this.id = 20105
        this.version = 0;
        this.stream = new ByteStream();
    }

    async encode() {
        this.stream.writeVInt(1)
        this.stream.writeVInt(1)

        this.stream.writeInt(0)
        this.stream.writeInt(1)

        this.stream.writeString()
        this.stream.writeString()
        this.stream.writeString()
        this.stream.writeString()
        this.stream.writeString()
        this.stream.writeString()

        this.stream.writeInt(1000)
        this.stream.writeInt(0)
        this.stream.writeInt(1)
        this.stream.writeInt(1)
        this.stream.writeInt(1)

        this.stream.writeBoolean(false)

        this.stream.writeString()
        this.stream.writeInt(0)

        this.stream.writeBoolean(true)

        this.stream.writeString("Friendly bot")
        this.stream.writeVInt(100)
        this.stream.writeVInt(28000005)
        this.stream.writeVInt(43000002)
        this.stream.writeVInt(0)
    }
}

module.exports = FriendListMessage;