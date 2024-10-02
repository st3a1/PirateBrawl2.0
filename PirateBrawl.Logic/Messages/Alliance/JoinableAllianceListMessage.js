const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class JoinableAllianceListMessage extends PiranhaMessage {
  constructor(c, d) {
    super(c);
    this.id = 24304;
    this.session = c;
    this.leaders = d;
    this.version = 0x1;
    this.stream = new ByteStream();
  }
  async ["encode"]() {
    this.stream.writeVInt(this.leaders.length);
    for (const c of this.leaders) {
      this.stream.writeInt(0x0);
      this.stream.writeInt(c.clubID);
      this.stream.writeString(c.Name);
      this.stream.writeVInt(0x8);
      this.stream.writeVInt(c.BadgeID);
      this.stream.writeVInt(c.Type);
      this.stream.writeVInt(c.members.length);
      this.stream.writeVInt(c.Trophies);
      this.stream.writeVInt(c.Trophiesneeded);
      this.stream.writeVInt(0x0);
      this.stream.writeString('BY');
      this.stream.writeVInt(c.members.length);
    }
  }
}
module.exports = JoinableAllianceListMessage;