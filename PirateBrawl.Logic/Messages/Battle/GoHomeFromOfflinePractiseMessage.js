const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
//Packets Of Home
const OwnHomeDataMessage = require("../Home/OwnHomeDataMessage")
//database Calling
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
class GoHomeFromOfflinePractiseMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14109
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    //
  }

  async ['process']() {
    const c = await database.getAccount(this.session.lowID);
    this.session.Resources = c.Resources;
    new OwnHomeDataMessage(this.session, c).send();
  }
}

module.exports = GoHomeFromOfflinePractiseMessage
