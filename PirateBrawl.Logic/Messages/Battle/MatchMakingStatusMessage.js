const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class MatchMakingStatusMessage extends PiranhaMessage {
  constructor (session, Timer, PlayersFound, MaxPlayers, UseTimer) {
    super(session)
    this.id = 20405;
    this.Timer = Timer;
    this.PlayersFound = PlayersFound;
    this.MaxPlayers = MaxPlayers;
    this.UseTimer = UseTimer;
    this.stream = new ByteStream()
  }

  async encode () {
    this.stream.writeInt(1337);
    this.stream.writeInt(1336);//founded
    this.stream.writeInt(1337);//max player
    this.stream.writeInt(0);
    this.stream.writeInt(0);
    this.stream.writeBoolean(true);
    this.stream.writeInt(12333)
  }
}

module.exports = MatchMakingStatusMessage
