const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const AllianceStreamEntryMessage = require("./AllianceStreamEntryMessage");
class ChatToAllianceStreamMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 0x37eb;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {
    this.msg = this.stream.readString();
  }
  async ["process"]() {
    const c = {
      'msg': this.msg,
      'id': this.session.lowID,
      'event': 0x2,
      'name': this.session.Name,
      'role': this.session.ClubRole,
      'whosend': this.session.Name
    };
    const d = await database.getClub(this.session.ClubID);
    d.msg = await database.clubAddMessages(d.msg, c, this.session.ClubID);
    const e = d.msg.sort((f, g) => g.tick - f.tick);
    for (const f of d.members) {
      new AllianceStreamEntryMessage(this.session, e[0x0]).sendLowID(f);
    }
  }
}
module.exports = ChatToAllianceStreamMessage;