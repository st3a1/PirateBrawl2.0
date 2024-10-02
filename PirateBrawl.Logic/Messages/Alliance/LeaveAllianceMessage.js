const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const MyAllianceMessage = require('./MyAllianceMessage');
const AllianceResponseMessage = require('./AllianceResponseMessage');
const AllianceStreamEntryMessage = require('./AllianceStreamEntryMessage');
class LeaveAllianceMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14308;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {}

  async ["process"]() {
    const c = await database.getClub(this.session.ClubID);
    const d = await database.clubDelMember(c.members, this.session.ClubID, this.session.lowID);
    new AllianceResponseMessage(this.session, 0x50).send();
    new MyAllianceMessage(this.session, null, true).send();
    const mdata = {
      'msg': 0x4,
      'id': this.session.lowID,
      'event': 0x4,
      'name': this.session.Name,
      'role': 0x1,
      'whosend': this.session.Name
    };
    c.msg = await database.clubAddMessages(c.msg, mdata, this.session.ClubID);
    const e = c.msg.sort((f, g) => g.tick - f.tick)
    for (const f of c.members) {
      new AllianceStreamEntryMessage(this.session, e[0x0]).sendLowID(f);
    }
    this.session.ClubID = 0x0;
    await database.replaceValue(this.session.lowID, "ClubID", 0x0);
    await database.replaceValue(this.session.lowID, "ClubRole", 0x1);
  }
}
module.exports = LeaveAllianceMessage;