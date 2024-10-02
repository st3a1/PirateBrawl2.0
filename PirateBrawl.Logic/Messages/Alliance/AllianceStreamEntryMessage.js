const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class AllianceStreamEntryMessage extends PiranhaMessage {
  constructor(c, d) {
    super(c);
    this.id = 24312;
    this.session = c;
    this.version = 0x1;
    this.chat = d;
    this.stream = new ByteStream();
  }
  async ["encode"]() {
    if (this.chat !== undefined) {
      this.stream.writeVInt(this.chat.event);
      this.stream.writeVInt(0x0);
      this.stream.writeVInt(this.chat.tick);
      this.stream.writeVInt(0x0);
      this.stream.writeVInt(this.chat.id);
      this.stream.writeString(this.chat.whosend);
      this.stream.writeVInt(this.chat.role);
      this.stream.writeVInt(0x0);
      this.stream.writeVInt(0x0);
      if (this.chat.event === 0x4) {
        this.stream.writeVInt(this.chat.msg);
        this.stream.writeVInt(0x1);
        this.stream.writeVInt(0x0);
        this.stream.writeVInt(this.chat.id);
        this.stream.writeString(this.chat.name);
      } else {
        this.stream.writeString(this.chat.msg);
      }
    }
  }
}
module.exports = AllianceStreamEntryMessage;