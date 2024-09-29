const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class ShutdownStartedMessage extends PiranhaMessage {
  constructor(session, Name) {
    super(session);
    this.id = 20161; // 20161
    this.session = session;
    this.Name = Name
    this.version = 0;
    this.stream = new ByteStream();
  }

  async encode() {
    this.stream.writeVInt(3600); // я наугад поставил и заработало 🤔🤔🤔
    // по идее в винте должно указываться время через сколько будет тех. перерыв но не работает
  }
}

module.exports = ShutdownStartedMessage;