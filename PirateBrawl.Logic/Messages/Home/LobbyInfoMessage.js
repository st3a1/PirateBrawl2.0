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
    this.stream.writeString("\n\n<ce900ff>O<cd400ff>r<cbf00ff>i<ca900ff>g<c9400ff>i<c7f00ff>n<c6a00ff>a<c5400ff>l<c3f00ff> <c2a00ff>B<c1500ff>r<c0000fe>a<c0000ff>w<c1500e9>l<c2a00d4> <c3f00bf>R<c5500a9>e<c6a0094>l<c7f007f>o<c94006a>a<caa0054>d<cbf003f>e<cd4002a>d</c>\nServer Environment: prod\nTG: @original_brawl");
    this.stream.writeVInt(0);
  }
}

module.exports = LobbyInfoMessage;