const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const PlayerProfileMessage = require("./PlayerProfileMessage");
class GetPlayerProfileMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 0x3721;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {
    this.lowID = this.stream.readLong()[0x1];
  }
  async ['process']() {
    const c = await database.getAccount(this.lowID);
    if (c.ClubID !== 0x0) {
      const d = await database.getClub(c.ClubID);
      new PlayerProfileMessage(this.session, c, d).send();
    } else {
      new PlayerProfileMessage(this.session, c, null).send();
    }
  }
}
module.exports = GetPlayerProfileMessage;