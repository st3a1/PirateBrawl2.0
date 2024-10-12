const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

//database Calling
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const BattleEndMessage = require('./BattleEndMessage')

const fs = require('fs').promises;
const LoginFailedMessage = require('../Account/LoginFailedMessage')

class AskForBattleEndMessage extends PiranhaMessage {
  constructor(bytes, session) {
    super(session);
    this.session = session;
    this.id = 14110;
    this.version = 0;
    this.stream = new ByteStream(bytes);
    this.nicknames = ["ШустрыйБоец", "ОгненныйШторм", "СкорыйСтрелок", "ЗвездоЛов", 'ТеньНочи', "ВихрьХаоса", 'КристальныйМаг', "ЗащитныйЩит", "Молниеносный", "ГравитиКиллер", "ЗвездныйХищник", "ЛедянаяКоса", "СолнечныйЧемпион", "СигмаКрипер", "МедныйБык", "ПламенныйРейдер", "ПодземныйМаг", "Вентилятор77", "ДраконоКрылья", "Монстроубийца"];

  }

  async decode() {
    this.battle_result = this.stream.readVInt();
    this.stream.readVInt();
    this.rank = this.stream.readVInt();
    this.mapID = this.stream.readDataReference()[1];
    this.playersAmount = this.stream.readVInt();
    this.fields = [];
    this.idk = this.stream.readVInt(); // Brawler CsvID
    console.log(this.idk)
    this.stream.readVInt(); // Selected Brawler
    this.stream.readVInt(); // Skin CsvID
    this.stream.readVInt(); // Selected Skin
    this.stream.readVInt(); // red or blue
    this.penis = this.stream.readVInt();
    console.log(this.penis)
    this.EndName = this.stream.readString()// your name8888888888888888888888888888888888888888888

    for (let j = 1; j < this.playersAmount; j++) {
      this.filds = {}

      const k = Math.floor(Math.random() * this.nicknames.length);
      this.filds.name = this.nicknames[k];
      this.nicknames.splice(k, 0x1);

      this.stream.readVInt();
      this.filds.brawlerID = this.stream.readVInt();
      this.filds.skinID = this.stream.readVInt();
      if(this.fields.length >= 2){
        this.filds.Team = 1;
        this.stream.readVInt();
      }else{
        this.filds.Team = this.stream.readVInt();
      }
      this.stream.readVInt(); //Unknown
      this.stream.readString() //Name
      this.fields.push(this.filds)
    }
  }

  async process() {
    this.session.trophiesnew = 0;
    this.session.tokengained = 0;
    const account = await database.getAccount(this.session.lowID);
    const d = new Date(account.lastGame);
    const e = new Date();
    const f = e - d;
    if (f <= 20000) {
      return new LoginFailedMessage(this.session, "Произошла ошибка 14110. Перезайдите в игру", 0x1).send();
    }
    var game = (this.playersAmount === 10 && this.fields[0].Team === 0) ? 5 : (this.playersAmount === 6 ? 1 : (this.playersAmount === 10 ? 2 : game));
    
    new BattleEndMessage(this.session, this.battle_result, this.fields, this.rank, account, game, this.mapID).send();
    await database.replaceValue(this.session.lowID, "lastGame", new Date());
  }
}

module.exports = AskForBattleEndMessage;
