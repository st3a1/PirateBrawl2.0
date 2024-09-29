const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const MyAllianceMessage = require("./MyAllianceMessage");
const AllianceResponseMessage = require("./AllianceResponseMessage");
class CreateAllianceMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 0x37dd;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {
    this.Name = this.stream.readString();
    this.Description = this.stream.readString();
    this.BadgeIdentifier = this.stream.readVInt();
    this.BadgeID = this.stream.readVInt();
    this.RegionIdentifier = this.stream.readVInt();
    this.RegionID = this.stream.readVInt();
    this.Type = this.stream.readVInt();
    this.Trophiesneeded = this.stream.readVInt();
    this.FriendlyFamily = this.stream.readVInt();
  }
  async ["process"]() {
    if (this.session.ClubID === 0x0 || this.session.ClubID === undefined) {
      const c = this.Name.replace(/tg|@|:|#|sigmhack|sigmh@ck|sigmhаck|sigmhасk/g, '');
      const d = {
        'Name': c,
        'Trophies': 0,
        'Description': this.Description,
        'BadgeIdentifier': this.BadgeIdentifier,
        'BadgeID': this.BadgeID,
        'RegionIdentifier': this.RegionIdentifier,
        'RegionID': this.RegionID,
        'Type': this.Type,
        'Trophiesneeded': this.Trophiesneeded,
        'FriendlyFamily': this.FriendlyFamily,
        'members': [this.session.lowID],
        'clubID': 0x0
      };
      d.clubID = await database.createClub(d);
      this.session.ClubID = d.clubID;
      this.session.ClubRole = 0x2;
      d.data = {
        Type: this.Type,
        Trophiesneeded: this.Trophiesneeded,
        FriendlyFamily: this.FriendlyFamily,
        Description: this.Description
      }
      new MyAllianceMessage(this.session, d, false).send();
      new AllianceResponseMessage(this.session, 0x14).send();

      await database.replaceValue(this.session.lowID, "ClubID", this.session.ClubID);
      await database.replaceValue(this.session.lowID, "ClubRole", this.session.ClubRole);
    }
  }
}
module.exports = CreateAllianceMessage;