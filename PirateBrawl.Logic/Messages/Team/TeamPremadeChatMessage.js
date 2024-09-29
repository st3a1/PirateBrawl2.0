const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const TeamChatMessages = require('./TeamChatMessages');
const Gameroom = require('../../Laser.Server/Gameroom');

class TeamPremadeChatMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14369;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.Type = this.stream.readVInt();
    this.Pin = this.stream.readVInt();
    this.stream.readBoolean()
    if(this.stream.readBoolean()){
      this.mode = this.stream.readVInt()
    }
  }

  async process () {
    const c = {
      'id': this.session.lowID,
      'senderName': this.session.Name,
      'Type': this.Type,
      'Pin': this.Pin,
      'mode': this.mode,
      'event': 8
    };
    const d = new Gameroom();
    const e = d.addMessage(this.session.roomID, c);
    if (e !== null) {
      for (const f of e.players) {
        new TeamChatMessages(this.session, e).sendLowID(f.lowID);
      }
    }
  }
}
module.exports = TeamPremadeChatMessage;
