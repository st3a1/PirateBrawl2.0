const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const MyAllianceMessage = require("./MyAllianceMessage");
const AllianceResponseMessage = require('./AllianceResponseMessage');
const AllianceStreamEntryMessage = require("./AllianceStreamEntryMessage");
class JoinAllianceMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 0x37e1;
    this.version = 0x0;
    this.stream = new ByteStream(c);
    this.clubId = null;
    this.club = null;
  }
  async ["decode"]() {
    this.HighID = this.stream.readInt();
    this.LowID = this.stream.readInt();
  }
  async ["process"]() {
    if (this.session.ClubID === 0x0 || this.session.ClubID === undefined) {
      const c = await database.getClub(this.LowID);
      if (c.members.length <= 0x63) {
        this.session.ClubID = this.LowID;
        this.session.ClubRole = 0x1;
        c.members = await database.clubAddMember(c.members, this.session.lowID, this.LowID);
        new AllianceResponseMessage(this.session, 0x28).send();
        new MyAllianceMessage(this.session, c, false).send();

        await database.replaceValue(this.session.lowID, "ClubID", this.LowID);
        await database.replaceValue(this.session.lowID, "ClubRole", 0x1);
      } else {
        new AllianceResponseMessage(this.session, 0x2a).send();
      }
    }
  }
}
module.exports = JoinAllianceMessage;