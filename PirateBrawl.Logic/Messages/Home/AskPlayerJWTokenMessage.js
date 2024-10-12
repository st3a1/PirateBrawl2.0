const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream");
const PiranhaMessage = require("../../../PirateBrawl.Titan/Message/PiranhaMessage");

//database Calling

const PlayerJWTokenMessage = require('./PlayerJWTokenMessage')

class AskPlayerJWTokenMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 10055
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
  this.JWT = this.stream.readString()
  }

  async process () {
    console.log(this.JWT)
    console.log(this.session.token)
    await new PlayerJWTokenMessage(this.session, this.JWT).send()
  }
}

module.exports = AskPlayerJWTokenMessage