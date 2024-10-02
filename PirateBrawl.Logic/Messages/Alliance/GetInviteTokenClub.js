const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const TokenResult = require("./GetInviteTokenClubResult")
const LoginFailedMessage = require("../Account/LoginFailedMessage")
class GetInviteTokenClub extends PiranhaMessage {
  constructor(bytes, session) {
    super(session);
    this.session = session;
    this.id = 10309;
    this.version = 0x0;
    this.stream = new ByteStream(bytes);
  }
  async process() {
    new LoginFailedMessage(this.session, `Эта функция еще не реализована.`, 1).send()
  }
}
module.exports = GetInviteTokenClub