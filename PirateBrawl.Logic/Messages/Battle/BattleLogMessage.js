const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class BattleLogMessage extends PiranhaMessage {
  constructor(session) {
    super(session);
    this.id = 23458;
    this.session = session;
    this.version = 0x1;
    this.stream = new ByteStream();
  }
  
  async encode() {
    this.stream.writeBoolean(true)
    this.stream.writeVInt(0) // Count
  }
}

module.exports = BattleLogMessage;