const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

//database Calling
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const SetInvitesBlockedMessageOk = require('./SetInvitesBlockedMessageOk')

class SetInvitesBlockedMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14777
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.DoNotDisturb = this.stream.readVInt()
  }

  async process () {
  console.log(this.DoNotDisturb)
    await new SetInvitesBlockedMessageOk(this.session. this.DoNotDisturb).send()
    //await database.replaceValue(this.session.lowID,'DoNotDisturb', this.DoNotDisturb)
  
  }
}

module.exports = SetInvitesBlockedMessage