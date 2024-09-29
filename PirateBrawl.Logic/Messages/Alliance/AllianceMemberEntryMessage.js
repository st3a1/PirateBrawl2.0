const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class AllianceMemberEntryMessage extends PiranhaMessage {
  constructor(c, fair) {
    super(c);
    this.id = 24308;
    this.session = c;
    this.version = 0x1;
    this.fair = fair;
    this.stream = new ByteStream();
  }
  async ["encode"]() {
    this.stream.writeVInt(0);
    this.stream.writeVInt(this.session.ClubID);
    this.stream.writeVInt(0);
    this.stream.writeVInt(this.fair.lowID);
    this.stream.writeVInt(this.fair.Name);
    this.stream.writeVInt(100);
    this.stream.writeVInt(28000000);
    this.stream.writeVInt(43000000);
    this.stream.writeHex('---7F---');
  }
}
module.exports = AllianceMemberEntryMessage;