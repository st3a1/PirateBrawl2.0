const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const LoginFailedMessage = require('../Account/LoginFailedMessage')
const StartLoadingMessage = require('./StartLoadingMessage')
const BrawlTVListMessage = require("./BrawlTVListMessage")

class ListBrawlTvChannelsMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14700
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async process() {
    //await new BrawlTVListMessage(this.session).send()
    return new LoginFailedMessage(this.session, "Пока еще не добавлено.", 1).send()
  }
}

module.exports = ListBrawlTvChannelsMessage
