const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const Events = require('../../Utils/Events');

class DebugGemsAdded extends PiranhaMessage {
  constructor(bytes, session) {
    super(session);
    this.session = session;
    this.id = 10777;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode() {
  // pass
  }

  async process() {
  //new sc(this.session).send();
  }
}
module.exports = DebugGemsAdded;