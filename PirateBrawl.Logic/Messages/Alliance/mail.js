const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class mail extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 24333;
    this.version = 0x0;
    this.stream = new ByteStream(c);
    //this.data = data
  }
  async ["encode"]() {
    this.stream.writeVInt(113) // event type
    //console.log(this.stream.readString())
  }
  async ["process"]() {
    //
  }
}
module.exports = mail;