const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class SetCountryResponseMessage extends PiranhaMessage {
  constructor(session, country) {
    super(session);
    this.id = 24178; // 20161
    this.session = session;
    this.country = country
    this.version = 0;
    this.stream = new ByteStream();
  }
  async decode() {
    this.z1 = this.stream.readVInt()
    this.z = this.stream.readDataReference()[1]
    }

  async encode() {
  this.stream.writeVInt(0)
  this.stream.writeDataReference(14, this.country)
  }
}

module.exports = SetCountryResponseMessage;