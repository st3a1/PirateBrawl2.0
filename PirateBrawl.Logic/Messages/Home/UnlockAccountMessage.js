const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
//database Calling
//const database = require("../../Laser.Server/db")

const UnlockAccountOkMessage = require('./UnlockAccountOkMessage')
const UnlockAccountFailedMessage = require('./UnlockAccountFailedMessage')
const LoginFailedMessage = require('../Account/LoginFailedMessage')

class UnlockAccountMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 10121
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.acc =this.stream.readLong() // player account
    this.token = this.stream.readString() // token
    this.correct = this.stream.readString() //  то что вводится
  }

  async encode () {
    this.stream.writeLong(0, this.session.lowID) // player long
    this.stream.writeString(this.session.token) // token
    this.stream.writeString("") // да я че ебу блять

    this.stream.writeString() // мб правильный код хз, мне read нулл выдал
  }

  async process () {
    if (this.correct == "133713371337"){
      new UnlockAccountOkMessage(this.session).send()
      await database.replaceValue(this.session.lowID, 'Banned', false);
    }else{
      new LoginFailedMessage(this.session, `Код введен неправильно.`, 1).send()
    }
  
  }
}

module.exports = UnlockAccountMessage