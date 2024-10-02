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
    this.stream.writeLong(0, this.session.lowID) // lowid 
    this.stream.writeString(this.session.token); // token
    
  }
}

module.exports = UnlockAccountOkMessage 