const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const TeamChatMessages = require('./TeamChatMessages');
const Gameroom = require('../../../PirateBrawl.Server/Utils/Gameroom');

class TeamChatMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14359;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.msg = this.stream.readString();
    const forbiddenWords = ["мать", "сука", "блядина"];
    const regex = new RegExp(forbiddenWords.join("|"), "gi");
    const matches = this.msg.match(regex);

    if (matches && matches.length > 2) {
      this.msg = "*".repeat(this.msg.length);
    }else{
      this.msg = this.msg.replace(regex, (match) => "*".repeat(match.length));
    }
  }

  async process () {
    const c = {
      'event': 0x2,
      'id': this.session.lowID,
      'senderName': this.session.Name,
      'senderID': this.session.lowID,
      'msg': this.msg
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

module.exports = TeamChatMessage;
