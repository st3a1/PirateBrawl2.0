const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class GetInviteTokenClubResult extends PiranhaMessage {
  constructor(bytes, session) {
    super(session);
    this.session = session;
    this.id = 23302;
    this.version = 0x0;
    this.stream = new ByteStream(bytes);
  }
  async decode() {
    this.low_id = this.stream.readVInt()
    this.token = this.stream.readString()
    console.log(this.low_id)
    console.log(this.token)
  }

  async encode() {
    this.stream.writeVInt(1)
    this.stream.writeString(this.token);
    console.log(this.low_id)
    console.log(this.token)
  }
  async process() {
    console.log(this.low_id)
    console.log(this.token)
  }
}
module.exports = GetInviteTokenClubResult