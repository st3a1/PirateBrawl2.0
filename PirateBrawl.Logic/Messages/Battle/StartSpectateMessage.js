const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const BrawlTVChannelNextUpMessage = require("./BrawlTVChannelNextUpMessage")
class StartSpectateMessage extends PiranhaMessage {
  constructor(session) {
    super(session);
    this.id = 14104;
    this.session = session;
    this.version = 1;
    this.stream = new ByteStream();

  }

  async process() {
    await new BrawlTVChannelNextUpMessage(this.session).send()
  }
}

module.exports = StartSpectateMessage;
