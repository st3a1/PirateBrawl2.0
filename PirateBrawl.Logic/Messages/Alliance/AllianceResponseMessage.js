const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class AllianceResponseMessage extends PiranhaMessage {
  constructor(c, d) {
    super(c);
    this.id = 0x5f0d;
    this.session = c;
    this.version = 0x1;
    this.type = d;
    this.stream = new ByteStream();
  }
  async ["encode"]() {
    this.stream.writeVInt(this.type);
  }
}
module.exports = AllianceResponseMessage;