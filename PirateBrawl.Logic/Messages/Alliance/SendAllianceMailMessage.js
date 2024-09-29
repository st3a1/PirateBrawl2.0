const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class SendAllianceMailMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14330;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {
    console.log(this.stream.readString())
  }
  async ["process"]() {
    //
  }
}
module.exports = SendAllianceMailMessage;