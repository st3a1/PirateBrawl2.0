const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const MyAllianceMessage = require('./MyAllianceMessage');
const AllianceResponseMessage = require("./AllianceResponseMessage");
const AllianceStreamEntryMessage = require("./AllianceStreamEntryMessage");
const LoginFailedMessage = require("../Account/LoginFailedMessage");
class ChangeAllianceMemberRoleMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14306;
    this.version = 0x0;
    this.stream = new ByteStream(c);
    this.clubId = null;
    this.club = null;
  }
  async ['decode']() {
    this.TargetHighID = this.stream.readInt();
    this.TargetLowID = this.stream.readInt();
    this.TargetedRole = this.stream.readVInt();
  }
  async ["process"]() {
    const c = await database.getAccount(this.session.lowID);
    const d = await database.getAccount(this.TargetLowID);
    if (c.ClubRole === 0x1 || c.ClubRole === 0x0) {
      return await new LoginFailedMessage(this.session, "Произошла ошибка 14306. Перезайдите в игру или сообщите админу", 0xb).send();
    } else {
      const e = await database.getClub(this.session.ClubID);
      this.clubMsg = {};
      if (this.TargetedRole === 0x2) {
        await database.replaceValue(this.session.lowID, "ClubRole", 0x4);
        await database.replaceValue(this.TargetLowID, 'ClubRole', this.TargetedRole);
        this.clubMsg = {
          'msg': 0x5,
          'id': this.TargetLowID,
          'event': 0x4,
          'name': d.Name,
          'role': 0x1,
          'whosend': c.Name
        };
        new AllianceResponseMessage(this.session, 0x51).send();
      } else {
        if (this.TargetedRole > d.ClubRole) {
          await database.replaceValue(this.TargetLowID, "ClubRole", this.TargetedRole);
          this.clubMsg = {
            'msg': 0x5,
            'id': this.TargetLowID,
            'event': 0x4,
            'name': d.Name,
            'role': 0x1,
            'whosend': c.Name
          };
          new AllianceResponseMessage(this.session, 0x51).send();
        } else if (d.ClubRole > this.TargetedRole) {
          await database.replaceValue(this.TargetLowID, "ClubRole", this.TargetedRole);
          this.clubMsg = {
            'msg': 0x6,
            'id': this.TargetLowID,
            'event': 0x4,
            'name': d.Name,
            'role': 0x1,
            'whosend': c.Name
          };
          new AllianceResponseMessage(this.session, 0x52).send();
        }
      }
      e.msg = await database.clubAddMessages(e.msg, this.clubMsg, this.session.ClubID);
      const f = e.msg.sort((g, h) => h.tick - g.tick);
      for (const g of e.members) {
        new AllianceStreamEntryMessage(this.session, f[0x0]).sendLowID(g);
      }
      new MyAllianceMessage(this.session, e, false).send();
    }
  }
}
module.exports = ChangeAllianceMemberRoleMessage;