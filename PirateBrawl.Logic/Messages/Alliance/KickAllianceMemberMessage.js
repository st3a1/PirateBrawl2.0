const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const MyAllianceMessage = require('./MyAllianceMessage');
const AllianceResponseMessage = require("./AllianceResponseMessage");
const AllianceDataMessage = require("./AllianceDataMessage");
const LoginFailedMessage = require("../Account/LoginFailedMessage");
class KickAllianceMemberMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 0x37e3;
    this.version = 0x0;
    this.stream = new ByteStream(c);
    this.clubId = null;
    this.club = null;
  }
  async ["decode"]() {
    this.TargetHighID = this.stream.readInt();
    this.TargetLowID = this.stream.readInt();
  }
  async ["process"]() {
    if (this.session.ClubRole === 0x1) {
      return await new LoginFailedMessage(this.session, "Произошла ошибка 14306. Перезайдите в игру или сообщите админу", 0xb).send();
    } else {
      const c = await database.getClub(this.session.ClubID);
      new MyAllianceMessage(this.session, null, true).sendLowID(this.TargetLowID);
      await database.clubDelMember(c.members, this.session.ClubID, this.TargetLowID);

      new MyAllianceMessage(this.session, c, false).send();
      new AllianceResponseMessage(this.session, 0x46).send();

      const d = c.members.map(f => database.getUserClub(f));
      const e = await Promise.all(d);
      new AllianceDataMessage(this.session, c, e).send();
      
      await database.replaceValue(this.TargetLowID, "ClubRole", 0x1);
      await database.replaceValue(this.TargetLowID, "ClubID", 0x0);
    }
  }
}
module.exports = KickAllianceMemberMessage;