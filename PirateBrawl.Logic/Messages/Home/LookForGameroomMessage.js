const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class LookForGameroomMessage extends PiranhaMessage {
  constructor(session) {
    super(session);
    this.id = 14199;
    this.session = session;
    this.version = 0;
    this.stream = new ByteStream();
  }

  async decode() {
    this.idk = this.stream.readVInt()
    this.idk2 = this.stream.readVInt()
  }

  async encode() { // кие сiськi
    console.warn("ищем руму...") // кто кого трахнет який кака
    this.stream.writeVInt(20)
    this.stream.writeVInt(20)
  }
}

module.exports = LookForGameroomMessage;