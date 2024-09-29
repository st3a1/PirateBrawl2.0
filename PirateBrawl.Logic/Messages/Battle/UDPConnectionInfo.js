const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class UDPConnectionInfo extends PiranhaMessage {
  constructor (session) {
    super(session)
    this.id = 24112
    this.session = session
    this.version = 0
    this.stream = new ByteStream()
  }

  async encode () {
    this.stream.writeVInt(1337);
    this.stream.writeString("95.182.121.98");

    this.stream.writeInt(10);
    this.stream.writeLong(0, 1)//Connection.UdpSessionId
    this.stream.writeShort(0); //доп. защита. Если не нужно то 0

    this.stream.writeInt(0); // хз что это
  }
}

module.exports = UDPConnectionInfo
