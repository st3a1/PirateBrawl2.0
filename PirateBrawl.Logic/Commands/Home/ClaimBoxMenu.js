const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const LogicBoxCommand = require('./LogicBoxCommand');

const LoginFailedMessage = require('../../Messages/Account/LoginFailedMessage');

class ClaimBoxMenu extends PiranhaMessage {
  constructor(c, d) {
    super(c);
    this.session = d;
    this.commandID = 0x1f4;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  ["decode"](c) {
    for (let d of Array(0x9).keys()) {
      this.stream.readVInt();
    }
    this.a10 = this.stream.readVInt();
  }
  async ["process"]() {
    const d = await database.getAccount(this.session.lowID);
    let e = 0xa;
    switch (this.a10) {
      case 0x5:
        if (d.Resources.Box < 100) {
          return new LoginFailedMessage(this.session, "Произошла ошибка 500. Перезайдите в игру", 0x1).send();
        }
        d.Resources.Box -= 100;
        e = 0xa;
        break;
      case 0x4:
        if (d.Resources.BigBox < 10) {
          return new LoginFailedMessage(this.session, "Произошла ошибка 500. Перезайдите в игру", 0x1).send();
        }
        d.Resources.BigBox -= 10;
        e = 0xc;
        break;
      case 0x3:
        if (d.Resources.Gems < 80) {
          return new LoginFailedMessage(this.session, "Произошла ошибка 500. Перезайдите в игру", 0x1).send();
        }
        d.Resources.Gems -= 80;
        e = 0xb;
        break;
      case 0x1:
        if (d.Resources.Gems < 30) {
          return new LoginFailedMessage(this.session, "Произошла ошибка 500. Перезайдите в игру", 0x1).send();
        }
        d.Resources.Gems -= 30;
        e = 0xc;
        break;
    }
    new LogicBoxCommand(this.session, e, d).send();
  }
}
module.exports = ClaimBoxMenu;