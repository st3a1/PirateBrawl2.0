const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
class UnlockAccountOkMessage extends PiranhaMessage {
  constructor(session, Code) {
    super(session);
    this.id = 20132;
    this.session = session;
    this.Code = Code
    this.version = 0;
    this.stream = new ByteStream();
  }

  async encode() {

    this.stream.writeVInt(1);
    this.stream.writeString("123412341234");
    
  }
}

module.exports = UnlockAccountOkMessage 