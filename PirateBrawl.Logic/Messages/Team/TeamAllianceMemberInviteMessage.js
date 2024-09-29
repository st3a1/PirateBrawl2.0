const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../../PirateBrawl.Server/Utils/Gameroom');

const TeamInvitationMessage = require('./TeamInvitationMessage');

class TeamInviteMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14370;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.Unknow1 = this.stream.readVInt();
    this.lowID = this.stream.readVInt();
  }

  async process () {
    const c = new Gameroom();
    const d = c.addInvite(this.session.roomID, this.lowID, 0x0, "Игрок");
    if (d !== null) {
      const e = await database.getAccount(this.session.lowID);
      for (const f of d.players) {
        new TeamMessage(this.session, d).sendLowID(f.lowID);
      }
      new TeamInvitationMessage(this.session, d, e).sendLowID(this.lowID);
    }
	}
}
module.exports = TeamInviteMessage;
