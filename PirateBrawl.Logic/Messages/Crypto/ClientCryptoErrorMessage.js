const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class ClientCryptoErrorMessage extends PiranhaMessage {
  constructor(session) {
    super(session)
    this.id = 10099
    this.session = session
    this.version = 0
    this.stream = new ByteStream();
  }
  async decode() {
    this.stream.readInt()
  }

  async encode() {
    this.stream.writeInt(0); // хз
  }
}

module.exports = ClientCryptoErrorMessage;