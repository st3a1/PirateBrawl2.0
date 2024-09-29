const PiranhaMessage = require('../../Utils/PiranhaMessage')
const ByteStream = require("../../Utils/ByteStream")

//database Calling
const database = require("../../Laser.Server/db")

class SetInvitesBlockedMessageOk extends PiranhaMessage {
  constructor (bytes, session, DoNotDisturb) {
    super(session)
    this.session = session
    this.id = 24111
    this.version = 0
    this.stream = new ByteStream(bytes)
    this.DoNotDisturb = DoNotDisturb
  }

  async encode () {
  this.stream.writeVInt(213)
  this.stream.writeVInt(this.DoNotDisturb)
  this.stream.writeVInt(0)   
  this.stream.writeVInt(0)
  this.stream.writeVInt(0)
  this.stream.writeVInt(0)
  this.stream.writeVInt(0)
  }
}

module.exports = SetInvitesBlockedMessageOk