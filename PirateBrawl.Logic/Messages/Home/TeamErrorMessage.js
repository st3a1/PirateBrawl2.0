const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class TeamErrorMassage extends PiranhaMessage {
  constructor(session, Name) {
    super(session);
    this.id = 24129; // TeamErrorMessage
    this.session = session;
    this.Name = Name
    this.version = 0;
    this.stream = new ByteStream();
  }
  async decode() {
    this.reason = this.stream.readVInt()
  }

  async encode() {
    this.stream.writeVInt(0); // team errr id
    this.stream.writeVInt(-1); // timer? 
  }
}

module.exports = TeamErrorMassage;