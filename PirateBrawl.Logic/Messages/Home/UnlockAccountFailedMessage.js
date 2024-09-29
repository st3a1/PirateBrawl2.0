const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
class UnlockAccountFailedMessage extends PiranhaMessage {
  constructor(session, Code) {
    super(session);
    this.id = 20133
    this.session = session;
    this.Code = Code
    this.version = 0;
    this.stream = new ByteStream();
  }

  async decode() {
    this.ПЕНИС = this.stream.readInt(); // reason read
  }

  async encode() {
    this.stream.writeInt(this.ПЕНИС); // reason
  }

}

module.exports = UnlockAccountFailedMessage;