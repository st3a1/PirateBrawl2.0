const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const Alliance = require("../../../PirateBrawl.Titan/Entry/");

class AllianceDataMessage extends PiranhaMessage {
  constructor(c, d, e) {
    super(c);
    this.id = 0x5eed;
    this.session = c;
    this.version = 0x1;
    this.club = d;
    this.members = e;
    this.stream = new ByteStream();
  }
  async ["encode"]() {
    this.stream.writeBoolean(this.session.ClubID === this.club.clubID);
    new Alliance().encode(this.stream, this.club, this.members);
  }
}
module.exports = AllianceDataMessage;