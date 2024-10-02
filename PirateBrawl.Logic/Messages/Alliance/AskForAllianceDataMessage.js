const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const AllianceDataMessage = require("./AllianceDataMessage");
class AskForAllianceDataMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14302;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {
    this.stream.readInt();
    this.LowID = this.stream.readInt();
  }
  async ["process"]() {
    const c = await database.getClub(this.LowID);
    const d = c.members.map(f => database.getUserClub(f));
    const e = await Promise.all(d);
    new AllianceDataMessage(this.session, c, e).send();
  }
}
module.exports = AskForAllianceDataMessage;