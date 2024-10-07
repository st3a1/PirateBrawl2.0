const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const LoginFailedMessage = require('./LoginFailedMessage')

class ClientCryptoErrorMessage extends PiranhaMessage {
  constructor(session) {
    super(session)
    this.id = 10100
    this.session = session
    this.version = 0
    this.stream = new ByteStream();
  }
  async decode() {
    this.stream.readInt()
  }

  async encode() {
    this.stream.writeInt(0); // хз
  }

  async process() {
    new LoginFailedMessage(this.session, "Что-то пошло не так, сообщите разработчику о проблеме.\nКод ошибки 10100", 1)
  }
}

module.exports = ClientCryptoErrorMessage;