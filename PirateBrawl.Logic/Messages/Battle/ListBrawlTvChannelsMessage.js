const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const LoginFailedMessage = require('../Account/LoginFailedMessage')

class ListBrawlTvChannelsMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14700
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.d = this.stream.readVInt()
    this.w = this.stream.readBoolean()
  }

  async encode(){
    this.stream.writeVInt(-64) // idk
    this.stream.writeBoolean(true) // щас чекну
  }

  async process() {
    console.log(this.d)
    console.log(this.w)
    await new LoginFailedMessage(this.session, "Пока не добавлено", 1)
  }
}

module.exports = ListBrawlTvChannelsMessage
