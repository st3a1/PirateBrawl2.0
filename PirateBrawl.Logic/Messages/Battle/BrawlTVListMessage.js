const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
class ListBrawlTvChannelsMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 24700
    this.version = 0
    this.stream = new ByteStream(bytes)
  }
  
  async encode() {
    this.stream.writeVInt(1) // count
        this.stream.writeVInt(1)
        this.stream.writeVInt(1)
  }
}

module.exports = ListBrawlTvChannelsMessage
