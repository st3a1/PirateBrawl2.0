const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const AllianceHeader = require("../../../PirateBrawl.Titan//Entry/AllianceHeader");

class MyAllianceMessage extends PiranhaMessage {
  constructor(c, d, e) {
    super(c);
    this.id = 0x5f4f;
    this.session = c;
    this.leave = e;
    this.version = 0x1;
    this.club = d;
    this.stream = new ByteStream();
  }
  async ["encode"]() {
    if (this.leave === false) {
      this.stream.writeVInt(this.club.members.length);
      this.stream.writeVInt(1);
      this.stream.writeDataReference(25, this.session.ClubRole)
      new AllianceHeader().encode(this.stream, this.club);
    } else {
      this.stream.writeVInt(0x0);
      this.stream.writeVInt(0x0);
    }
  }
}
module.exports = MyAllianceMessage;