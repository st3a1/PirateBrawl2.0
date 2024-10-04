const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class DisconnectedMessage extends PiranhaMessage {
  constructor(session, Error) {
    super(session);
    this.id = 25892;
    this.session = session;
    this.Error = Error
    this.version = 0;
    this.stream = new ByteStream();
  }

  async encode() {
    if(this.Error == undefined){
      this.Error = 1
    }

    this.stream.writeInt(this.Error); // it looks like login failed, but supercell not using login failed in real game по типу подключение прервано ну типо да смысла нет, поэтому они сделали нахуя то Disconn messagє
    // 1 -- Другое устройство подключается к этой игре
    // 2 -- Out Of Sync Message
  }
}

module.exports = DisconnectedMessage;