const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class AllianceStreamMessage extends PiranhaMessage {
  constructor(c, d) {
    super(c);
    this.id = 0x5ef7;
    this.session = c;
    this.version = 0x1;
    this.chat = d;
    this.stream = new ByteStream();
  }
  async ["encode"]() {
    this.stream.writeVInt(this.chat.length);
    for (const c of this.chat) {
      this.stream.writeVInt(c.event);
      this.stream.writeVInt(0x0);
      this.stream.writeVInt(c.tick);
      this.stream.writeVInt(0x0);
      this.stream.writeVInt(c.id);
      this.stream.writeString(c.whosend);
      this.stream.writeVInt(c.role);
      this.stream.writeVInt(0x0);
      this.stream.writeVInt(0x0);
      if (c.event === 0x4) {
        this.stream.writeVInt(c.msg);
        this.stream.writeVInt(0x1);
        this.stream.writeVInt(0x0);
        this.stream.writeVInt(c.id);
        this.stream.writeString(c.name);
      } else {
        this.stream.writeString(c.msg);
      }
    }
  }
}
module.exports = AllianceStreamMessage;