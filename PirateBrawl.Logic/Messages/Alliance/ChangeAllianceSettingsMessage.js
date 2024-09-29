const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const MyAllianceMessage = require("./MyAllianceMessage");
const AllianceResponseMessage = require('./AllianceResponseMessage');
class ChangeAllianceSettingsMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 0x37ec;
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
      const d = await database.clubUpdate(this.session.ClubID, c);
      new MyAllianceMessage(this.session, d, false).send();
      new AllianceResponseMessage(this.session, 0xa).send();
    }
  }
}
module.exports = ChangeAllianceSettingsMessage;