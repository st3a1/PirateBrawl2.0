const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const LoginFailedMessage = require('../Account/LoginFailedMessage');
//const MatchMakingCancelledMessage = require('./MatchMakingCancelledMessage');
const MatchMakingStatusMessage = require("./MatchMakingStatusMessage")


class MatchRequestMessage extends PiranhaMessage {
  constructor (bytes, session, PlayersFound, MaxPlayers) {
    super(session)
    this.session = session
    this.id = 14103
    this.version = 0
    this.stream = new ByteStream(bytes)
    this.PlayersFound = 0
    this.MaxPlayers = 0
  }

  async decode () {
    this.stream.readVInt()
    this.session.BrawlerID = this.stream.readVInt()
    this.stream.readVInt()
    this.EventSlot = this.stream.readVInt()
    // ***
    // EventSlot
    // 1 - GemGrab
    // 2 - Showndoun
    // 5 - DuoShowndoun
  }

  async process () {
  if (typeof global.players !== 'number' || isNaN(global.players)) {
    global.players = 0; 
  }
  global.players += 6
	new MatchMakingStatusMessage(this.session, this.PlayersFound, this.MaxPlayers).send();
  }
}

module.exports = MatchRequestMessage
