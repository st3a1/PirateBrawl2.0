const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class MatchMakingCancelledMessage extends PiranhaMessage {
  constructor (session, Players) {
    super(session)
    this.id = 20406
    this.session = session
    this.Players = Players
    this.version = 0
    this.stream = new ByteStream()
  }

  async encode () {
    this.stream.writeInt(1);
  }
}

module.exports = MatchMakingCancelledMessage
