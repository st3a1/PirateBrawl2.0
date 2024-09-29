const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../Laser.Server/db")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../Laser.Server/Gameroom');
const TeamChatMessages = require('./TeamChatMessages');

const TeamInvitationMessage = require('./TeamInvitationMessage');

class TeamInviteMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14365;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.Unknow1 = this.stream.readVInt();
    this.lowID = this.stream.readVInt();
  }

  async process () {
    const g = new Gameroom();
    const h = g.addInvite(this.session.roomID, this.lowID, 0x0, 'Игрок');
    if (h !== null) {
      const i = await database.getAccount(this.session.lowID);
      for (const j of h.players) {
        new TeamMessage(this.session, h).sendLowID(j.lowID);
      }
      new TeamInvitationMessage(this.session, h, i).sendLowID(this.lowID);
    }
	}
}
module.exports = TeamInviteMessage;
