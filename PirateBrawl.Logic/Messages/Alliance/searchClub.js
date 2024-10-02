const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const AllianceListMessage = require('./AllianceListMessage');
class SearchAlliancesMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14324;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {
    this.Name = this.stream.readString();
  }
  async ['process']() {
    const c = await database.searchClub(this.Name);
    new AllianceListMessage(this.session, c, this.Name).send();
  }
}
module.exports = SearchAlliancesMessage;