const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../Laser.Server/db")

const TeamMessage = require('./TeamMessage');
const TeamLeaveMessages = require('./TeamLeaveMessages');
const TeamChatMessages = require('./TeamChatMessages');
const Gameroom = require('../../Laser.Server/Gameroom');

class TeamLeaveMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14353;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    //
  }

  async process () {
    const c = this.session.roomID;
    const d = {
      'event': 0x4,
      'id': this.session.lowID,
      'senderName': this.session.Name,
      'senderID': this.session.lowID,
      'msg': 0x67
    };
    const e = new Gameroom().leaveRoom(c, this.session.lowID, d);
    new TeamLeaveMessages(this.session).send();
    if (e !== null) {
      for (const f of e.players) {
        new TeamMessage(this.session, e).sendLowID(f.lowID);
        new TeamChatMessages(this.session, e).sendLowID(f.lowID);
      }
    }
  }
}
module.exports = TeamLeaveMessage;
