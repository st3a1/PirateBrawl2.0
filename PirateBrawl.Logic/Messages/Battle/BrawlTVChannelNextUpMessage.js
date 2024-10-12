const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class StartSpectateMessage extends PiranhaMessage {
  constructor(session) {
    super(session);
    this.id = 24701;
    this.session = session;
    this.version = 1;
    this.stream = new ByteStream();

  }

  async encode() {
    this.stream.writeDataReference(15, 10)
  }
}

module.exports = StartSpectateMessage;
