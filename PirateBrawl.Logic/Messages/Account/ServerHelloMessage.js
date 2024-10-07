const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class ClientCryptoErrorMessage extends PiranhaMessage {
  constructor(session) {
    super(session)
    this.id = 10099
    this.session = session
    this.version = 0
    this.stream = new ByteStream();
  }
  async decode() {
    this.stream.readInt()
  }

  async encode() {
  ZN14PiranhaMessage6encodeEv((int)a1, a2, a3);
  ZN10ByteStream8writeIntEi((int)(a1 + 2), a1[20]);
  ZN10ByteStream8writeIntEi((int)(a1 + 2), a1[21]);
  ZN10ByteStream8writeIntEi((int)(a1 + 2), a1[22]);
  ZN10ByteStream8writeIntEi((int)(a1 + 2), a1[23]);
  ZN10ByteStream8writeIntEi((int)(a1 + 2), a1[24]);
  ZN10ByteStream20writeStringReferenceERK6String(a1 + 2, (int)(a1 + 0x19));
  ZN10ByteStream8writeIntEi((int)(a1 + 2), a1[29]);
  return ZN10ByteStream8writeIntEi((int)(a1 + 2), a1[30]);
  }
}

module.exports = ClientCryptoErrorMessage;