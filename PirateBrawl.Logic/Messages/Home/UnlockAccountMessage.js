const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

//database Calling
//const database = require("../../Laser.Server/db")

const ok = require('./UnlockAccountOkMessage')
const failed = require('./UnlockAccountFailedMessage')
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
    this.vvod = this.stream.readString() //  то что вводится
  }

  async encode () {
    this.stream.writeLong(0, this.session.lowID) // player long
    this.stream.writeString("") // token
    this.stream.writeString("") // то что вводится
    this.stream.writeString() // мб правильный код хз
  }

  async process () {
    if (this.vvod == "133713371337"){
      console.log("skipped")
      new LoginFailedMessage(this.session, `а потом потому что коляски`, 1)
    }
  
  }
}

module.exports = UnlockAccountMessage