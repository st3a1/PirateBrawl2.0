const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const AllianceResponseMessage = require('./AllianceResponseMessage');
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")


class SendAllianceMailMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14330;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }
  async ["decode"]() {

    this.a = this.stream.readInt()
    this.mail = this.stream.readString()
  }
  
  async ["encode"]() {

  this.stream.writeInt(this.a)
  this.stream.writeString(this.mail)
  }
 async ["process"]() {
    const account = await database.getAccount(this.session.lowID);
    let clubdb = await database.getClub(this.session.ClubID);
    console.log(this.a)
    try {
        //await new AllianceResponseMessage(this.session, 113).send();

        new AllianceResponseMessage(this.session, 114).send();

        await new AllianceResponseMessage(this.session, 113).send();
        clubdb.Notification.push({
            ID: 81,
            index: parseInt(account.Notification.length + 1),
            type: 0,
            date: new Date(),
            text: this.mail
        });
        await database.replaceValueClub(this.session.ClubID, 'Notification', clubdb.Notification);

    } catch (error) {
        console.error('УДАЛИТЬ АККАУНТ НАХУЙ:', error);

    }
}

}
module.exports = SendAllianceMailMessage;