const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")


class AnalyticEventMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 10110 // сделал чтобы мозги не ебало
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
        this.Type = this.stream.readString()
        this.Event = this.stream.readString()
  }

  async process () {
  console.log("[INFO] " + "NEW EVENT " + "Type: " + this.Type + "\n" + " Event: " + this.Event)
  }
}

module.exports = AnalyticEventMessage