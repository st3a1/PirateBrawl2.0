const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class AllianceListMessage extends PiranhaMessage {
  constructor(c, d, e) {
    super(c);
    this.id = 24310;
    this.session = c;
    this.clubs = d;
    this.Name = e;
    this.version = 0x0;
    this.stream = new ByteStream();
  }
  async ["encode"]() {
    this.stream.writeString(this.Name);
    this.stream.writeVInt(this.clubs.length);
    for (const c of this.clubs) {
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
module.exports = AllianceListMessage;