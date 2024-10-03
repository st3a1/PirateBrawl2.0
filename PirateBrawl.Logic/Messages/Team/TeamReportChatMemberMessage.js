const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../../PirateBrawl.Server/Utils/Gameroom');
const Characters = require("../../../GameFiles/Characters")


class TeamReportChatMemberMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14354;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.idk = 1337
  }
}
module.exports = TeamReportChatMemberMessage;
