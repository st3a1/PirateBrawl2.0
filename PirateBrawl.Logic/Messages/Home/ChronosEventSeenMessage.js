const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")


class Chronos extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14166
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.Code = this.stream.readString()
  }

  async process () {
  console.log("Chronos sended.")
     
  }

}

module.exports = Chronos