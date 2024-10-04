const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
//const index = require("../../index")

class LobbyInfoMessage extends PiranhaMessage {
  constructor(session, Name, online) {
    super(session);
    this.id = 23457;
    this.session = session;
    this.Name = Name
    this.version = 0;
    this.stream = new ByteStream();
    this.online = online
  }

  async encode() {
    this.stream.writeVInt(1338);
    this.stream.writeString("привет лень");
    this.stream.writeVInt(0);
  }
}

module.exports = LobbyInfoMessage;