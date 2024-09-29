const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class SetCountryResponseMessage extends PiranhaMessage {
  constructor(session, Name) {
    super(session);
    this.id = 24178; // 20161
    this.session = session;
    this.Name = Name
    this.version = 0;
    this.stream = new ByteStream();
  }
  async decode() {
    console.log(this.ГОЙДА)
    this.ГОЙДА = this.stream.readVInt()
    this.country = this.stream.readDataReference()[1]
    }

  async encode() {
  console.log(this.ГОЙДА)
  this.stream.writeVInt(0)
  this.stream.writeDataReference(14, this.country)
  }
}

module.exports = SetCountryResponseMessage;