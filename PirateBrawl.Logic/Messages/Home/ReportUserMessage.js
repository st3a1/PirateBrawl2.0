const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class ReportUser extends PiranhaMessage {
  constructor(session) {
    super(session);
    this.id = 12998; // 20161
    this.session = session;
    this.version = 0;
    this.stream = new ByteStream();
  }
  async decode() {
  this.reportedid = this.stream.readLong 
  this.reason = this.stream.readInt
  }
  async encode() {
  this.stream.writeInt(0)
  this.stream.writeLong(0, this.session.lowID)
  }
}

module.exports = ReportUser;