const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
//const BattleFunction = require('../../Laser.Server/Battles');

class ClientInputMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(bytes)
    this.session = session
    this.id = 10555
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {

    // new ClientInput().decode(this.stream, this.player, this.battle);
  }

  async process () {
    // new VisionUpdateMessage(this.session, this.battle, this.player).send()
  }
}

module.exports = ClientInputMessage
