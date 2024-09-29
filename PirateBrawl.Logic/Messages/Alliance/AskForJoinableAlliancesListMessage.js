const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const JoinableAllianceListMessage = require("./JoinableAllianceListMessage");
class AskForJoinableAlliancesListMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14303;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ['decode']() {}
  async ["process"]() {
    const c = await database.getClubList();
    new JoinableAllianceListMessage(this.session, c).send();
  }
}
module.exports = AskForJoinableAlliancesListMessage;