

const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

//database Calling
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")


const SeasonRewardsMessage = require("./SeasonRewardsMessage")


class GetSeasonRewardsMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14277
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.type = this.stream.readVInt()
  }

  async process () {
    new SeasonRewardsMessage(this.session, this.type).send()
  }
}

module.exports = GetSeasonRewardsMessage
