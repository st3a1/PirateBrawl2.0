const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const TeamErrorMassage = require("../Home/TeamErrorMessage")
const LoginFailedMessage = require('../Account/LoginFailedMessage')


class MatchMakingStatusMessage extends PiranhaMessage {
  constructor (session, Timer, PlayersFound, MaxPlayers, UseTimer, EventSlot) {
    super(session)
    this.id = 20405;
    this.Timer = Timer;
    this.PlayersFound = PlayersFound;
    this.MaxPlayers = MaxPlayers;
    this.UseTimer = UseTimer;
    this.EventSlot = EventSlot;
    this.stream = new ByteStream()
  }

  async encode () {
    console.warn(global.players)
    let PlayersMaxed = 6 // def players in mm, соотвестве хз как писать крч в дуо/соло шд будет 10
    let istimer = false
    this.stream.writeInt(20);
    this.stream.writeInt(global.players);
    if(this.EventSlot == 2 || this.EventSlot == 3){ // 1 gg, 2 solo sd, 3 duo sd
      PlayersMaxed = 10
    }
    this.stream.writeInt(PlayersMaxed);
    this.stream.writeInt(0);
    this.stream.writeInt(0);
    if ( global.players === 6)
    {
      istimer = true
    }
    this.stream.writeBoolean(istimer);
    this.stream.writeInt(20)
  }
  async process () { 
    //new TeamErrorMassage(this.session).send()
  }
}

module.exports = MatchMakingStatusMessage
