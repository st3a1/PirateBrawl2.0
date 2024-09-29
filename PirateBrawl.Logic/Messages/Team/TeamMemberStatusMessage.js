const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../../PirateBrawl.Server/Utils/Gameroom');

class TeamMemberStatusMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14361;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.status = this.stream.readVInt();
  }

  async process () {
    const c = new Gameroom();
    const d =c.ReplaceStatusPlayer(this.session.roomID, this.session.lowID, this.status);
    if (d !== null) {
      for (const e of d.players) {
        new TeamMessage(this.session, d).sendLowID(e.lowID);
      }
    }
  }
}
module.exports = TeamMemberStatusMessage;
