const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage');
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream");
const si = require("systeminformation");

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager");
const AllianceStreamEntryMessage = require("./AllianceStreamEntryMessage");

class ChatToAllianceStreamMessage extends PiranhaMessage {
  constructor(c, d) {
    super(d);
    this.session = d;
    this.id = 14315;
    this.version = 0x0;
    this.stream = new ByteStream(c);
  }

  async ["decode"]() {
    this.msg = this.stream.readString();
    const forbiddenWords = ["мать", "сука", "блядина"];
    const regex = new RegExp(forbiddenWords.join("|"), "gi");
    const matches = this.msg.match(regex);

    if (matches && matches.length > 2) {
      this.msg = "*".repeat(this.msg.length);
    } else {
      this.msg = this.msg.replace(regex, (match) => "*".repeat(match.length));
    }
  }

  async ["process"]() {
    let botmsg = false;
    const c = {
      msg: this.msg,
      id: this.session.lowID,
      event: 0x2,
      name: this.session.Name,
      role: this.session.ClubRole,
      whosend: this.session.Name
      
    };

    if (this.msg === "/stat") {
      botmsg = true;
      c.id = -1;
      c.name = "Mix Helper";
      c.whosend = "Mix Helper";

      const cpuLoad = await si.currentLoad();
      const mem = await si.mem();
      const disk = await si.fsSize();

      console.log(c)
      c.msg = `Загрузка процессора: ${cpuLoad.currentLoad.toFixed(2)}%\nЗанятость ОЗУ: ${(mem.active / 1024 / 1024).toFixed(2)} MB / ${(mem.total / 1024 / 1024).toFixed(2)} MB\nИспользование диска: ${(disk[0].used / 1024 / 1024 / 1024).toFixed(2)} GB / ${(disk[0].size / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }

    else if (this.msg === "/help") {
      botmsg = true;
      c.id = -1;
      c.msg = "Доступные комманды:\n/online - показывает список онлайн-игроков\n/stat - статистика сервера";
      c.name = "Mix Helper";
      c.whosend = "Mix Helper";
      console.log(c)
    }
    console.log(c)
    const d = await database.getClub(this.session.ClubID);
    d.msg = await database.clubAddMessages(d.msg, c, this.session.ClubID);
    const e = d.msg.sort((f, g) => g.tick - f.tick);

    for (const f of d.members) {
      if (c.id !== -1) {
        new AllianceStreamEntryMessage(this.session, e[0x0]).sendLowID(f);
        console.log("sended with database")
      } else {
        new AllianceStreamEntryMessage(this.session, c).send();
        console.log("sended witout database")
      }
    }
  }
}

module.exports = ChatToAllianceStreamMessage;
