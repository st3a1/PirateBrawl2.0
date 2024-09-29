const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const LoginFailedMessage = require('../Account/LoginFailedMessage');
//const MatchMakingCancelledMessage = require('./MatchMakingCancelledMessage');
const MatchMakingStatusMessage = require("./MatchMakingStatusMessage")


class MatchRequestMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14103
    this.version = 0
    this.stream = new ByteStream(bytes)
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
	new MatchMakingStatusMessage(this.session).send();
  }
}

module.exports = MatchRequestMessage
