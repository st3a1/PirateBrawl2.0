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
  async encode() {
    this.stream.writeInt(0); // reason
  }

}

module.exports = UnlockAccountFailedMessage;