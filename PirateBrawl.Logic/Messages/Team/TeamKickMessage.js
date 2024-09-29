const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../Laser.Server/db")

const TeamMessage = require('./TeamMessage');
const TeamChatMessages = require('./TeamChatMessages');
const TeamLeaveMessages = require('./TeamLeaveMessages');

const Gameroom = require('../../Laser.Server/Gameroom');

class TeamKickMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14352;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.stream.readVInt();
    this.lowID = this.stream.readVInt();
  }

  async process () {
    const d = new Gameroom();
    let roomID = this.session.roomID;
    new TeamLeaveMessages(this.session).sendLowID(this.lowID);
    const e = {
      'event': 0x4,
      'id': this.id,
      'senderName': this.session.Name,
      'senderID': this.id,
      'msg': 0x67
    };
    this.session.roomID = roomID
    const f = d.leaveRoom(roomID, this.lowID, e);
    for (const g of f.players) {
      new TeamMessage(this.session, f).sendLowID(g.lowID);
      new TeamChatMessages(this.session, f).sendLowID(g.lowID);
    }
  }
}
module.exports = TeamKickMessage;
