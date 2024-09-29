const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class TeamLeaveMessages extends PiranhaMessage {
  constructor(session) {
    super(session);
    this.id = 24125;
    this.session = session;
    this.version = 1;
    this.stream = new ByteStream();
  }

  async encode() {
    this.session.roomID = 0
    this.stream.writeInt(0);
  }
}

module.exports = TeamLeaveMessages;
