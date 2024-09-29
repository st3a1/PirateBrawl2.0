const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
//database Calling
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

class KeepAliveMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 10108
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    // this.Status = this.stream.readVInt()
  }

  async process () {
    //
  }
}

module.exports = KeepAliveMessage
