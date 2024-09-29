const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
//database Calling
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

class PlayerStatusMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14366
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.Status = this.stream.readVInt()
  }

  async process () {
    if(this.Status > 0){
      await database.replaceValue(this.session.lowID, 'lastOnline', new Date())
      await database.replaceValue(this.session.lowID, "Status", this.Status);
    }
  }
}

module.exports = PlayerStatusMessage
