const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const config = require("../../../config.json")

class LoginFailedMessage extends PiranhaMessage {
  constructor (session, msg, errCode, maintenceTimer) {
    super(session)
    this.id = 20103
    this.session = session
    this.msg = msg
    this.errCode = errCode
    this.version = 0
    this.stream = new ByteStream()
    this.maintenceTimer = maintenceTimer
  }
  // << Error Code List >>
  // # 1  = Custom Message
  // # 7  = Patch
  // # 8  = Update Available
  // # 9  = Redirect
  // # 10 = Maintenance
  // # 11 = Banned
  // # 13 = Acc Locked PopUp
  // # 16 = Updating Cr/Maintenance/Too high version
  // # 18 = Chinese Text?
  async encode () {
    this.stream.writeInt(this.errCode)

    this.stream.writeString() // your finger
    this.stream.writeString() // serverHost

    this.stream.writeString() // patchurl
    this.stream.writeString(config.updateLink) // updateurl
    this.stream.writeString(this.msg)

    const currentDate = new Date();
    const targetDate = this.maintenceTimer
    const timeDifference = targetDate - currentDate;
    const timeInSeconds = Math.floor(timeDifference / 1000);

    console.log(this.maintenceTimer)
    console.log(timeInSeconds)

    this.stream.writeInt(this.maintenceTimer)
    this.stream.writeBoolean(true)

    this.stream.writeString()
    this.stream.writeString()

    this.stream.writeInt(0)
    this.stream.writeInt(3)

    this.stream.writeString()
    this.stream.writeString()

    this.stream.writeInt(0)
    this.stream.writeInt(0)

    this.stream.writeBoolean(false)
    this.stream.writeBoolean(false)
  }
}

module.exports = LoginFailedMessage
