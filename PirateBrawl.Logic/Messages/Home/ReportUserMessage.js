const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class ReportUser extends PiranhaMessage {
  constructor(session) {
    super(session);
    this.id = 10117; // 20161
    this.session = session;
    this.version = 0;
    this.stream = new ByteStream();
  }
  async decode() {
  this.reason = this.stream.readInt()
  this.reportedid0 = this.stream.readVInt()
  this.reportedid1 = this.stream.readVInt()
  }
  async encode() {
  this.stream.writeInt(0) // timer? хз 
  this.stream.writeVInt(0) // reported high audi
  this.stream.writeVInt(this.session.lowID) // reported low audi
  }
  async process() {
    console.log(this.reason)
    console.log(this.reportedid0)
    console.log(this.reportedid1)
  }
}

module.exports = ReportUser;