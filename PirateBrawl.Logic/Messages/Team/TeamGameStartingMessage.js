const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class TeamGameStartingMessage extends PiranhaMessage {
  constructor(session, mapID) {
    super(session);
    this.id = 24130;
    this.session = session;
    this.mapID = mapID;
    this.version = 1;
    this.stream = new ByteStream();
  }

  async encode() {
    this.stream.writeVInt(0);
    this.stream.writeVInt(0);
    this.stream.writeDataReference(15, this.mapID);
    
  }
}

module.exports = TeamGameStartingMessage;
