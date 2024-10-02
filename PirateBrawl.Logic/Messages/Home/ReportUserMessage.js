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
  this.stream.writeInt(0)
  this.stream.writeVInt(0)
  this.stream.writeVInt(this.session.lowID)
  }
}

module.exports = ReportUser;