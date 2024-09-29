const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const res = require('./SetCountryResponseMessage')

class SetCountryMessage extends PiranhaMessage {
  constructor(session, Name) {
    super(session);
    this.id = 12998; // 20161
    this.session = session;
    this.Name = Name
    this.version = 0;
    this.stream = new ByteStream();
  }

  async decode() {
    this.country = this.stream.readDataReference()[1]
    }

  async encode() {
  this.stream.writeDataReference(14, this.country)
  new res(this.session).send()
  }
}

module.exports = SetCountryMessage;