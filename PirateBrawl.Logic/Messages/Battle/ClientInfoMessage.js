const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class ClientInfoMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 10177;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.inet = this.stream.readString()
  }

  async process () {
    //
  }
}
module.exports = ClientInfoMessage;
