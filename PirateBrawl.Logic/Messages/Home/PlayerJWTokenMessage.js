const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream");
const PiranhaMessage = require("../../../PirateBrawl.Titan/Message/PiranhaMessage");

class PlayerJWTokenMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 23774
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async encode () {
    //this.stream.writeString("this.JWT")
  }

  async process () {
   // NaN
  }
}

module.exports = PlayerJWTokenMessage