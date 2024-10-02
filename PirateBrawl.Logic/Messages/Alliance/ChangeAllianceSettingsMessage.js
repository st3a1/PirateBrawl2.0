const PiranhaMessage = require('../../Utils/PiranhaMessage')
const ByteStream = require("../../Utils/ByteStream")

const database = require("../../Laser.Server/db")
const MyAllianceMessage = require("./MyAllianceMessage");
const AllianceResponseMessage = require('./AllianceResponseMessage');
const AllianceStreamEntryMessage = require("./AllianceStreamEntryMessage");
class ChangeAllianceSettingsMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14316;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {
    this.description = this.stream.readString();
    this.inf2 = this.stream.readVInt();
    this.badgeID = this.stream.readVInt();
    this.inf4 = this.stream.readVInt();
    this.regionID = this.stream.readVInt();
    this.type = this.stream.readVInt();
    this.requiredTrophies = this.stream.readVInt();
    this.FriendlyFamily = this.stream.readVInt();
  }
  async ["process"]() {
    const account = database.getAccount(this.session.lowID)
    if (this.session.ClubRole === 0x1 || this.session.ClubRole === 0x0 || this.session.ClubRole === 0x3) {
      return await new LoginFailedMessage(this.session, "Произошла ошибка 14306. Перезайдите в игру или сообщите админу", 0xb).send();
    } else {
      const c = {
        'Description': this.description,
        'BadgeID': this.badgeID,
        'Type': this.type,
        'Trophiesneeded': this.requiredTrophies,
        'FriendlyFamily': this.FriendlyFamily
      };
      const data = {
        'msg': "[CLUB LOG] Игрок с никнеймом " + this.session.Name + " Изменил: " + this.description + this.Type + this.Trophiesneeded,
        'id': 0,
        'event': 0x2,
        'name': "Club Bot",
        'role': 2,
        'whosend': "Club Bot"
      };
      const d1 = await database.getClub(this.session.ClubID);
      d1.msg = await database.clubAddMessages(d1.msg, data, this.session.ClubID);
      const e = d1.msg.sort((f, g) => g.tick - f.tick);
      for (const f of d1.members) {
        new AllianceStreamEntryMessage(this.session, e[0x0]).sendLowID(f);
      }

      const d = await database.clubUpdate(this.session.ClubID, c);
      new MyAllianceMessage(this.session, d, false).send();
      new AllianceResponseMessage(this.session, 0xa).send();
    }
  }
}
module.exports = ChangeAllianceSettingsMessage;