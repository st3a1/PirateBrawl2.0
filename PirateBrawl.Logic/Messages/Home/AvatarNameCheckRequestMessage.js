const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

//database Calling
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")


const SetNameCallback = require('./SetNameCallback')


class AvatarNameCheckRequestMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14600
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.Name = this.stream.readString()
  }

  async process () {
    this.session.Name = this.Name.replace(/tg|@|:|#|t.me|sigmhack|sigmh@ck|sigmhаck|sigmhасk/g, '');
    await database.replaceValue(this.session.lowID,'Name', this.session.Name)
    new SetNameCallback(this.session, this.session.Name).send()
  }
}

module.exports = AvatarNameCheckRequestMessage
