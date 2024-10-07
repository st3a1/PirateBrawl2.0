const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage');
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream");
const si = require("systeminformation");

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager");
const AllianceStreamEntryMessage = require("./AllianceStreamEntryMessage");

class ReportAllianceStreamMessage extends PiranhaMessage {
  constructor(bytes, session) {
    super(session);
    this.session = session;
    this.id = 10119;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async ["decode"]() {
    this.idk = this.stream.readLong()
    this.idk1 = this.stream.readLong()
  }

  async ["process"]() {
    console.log(this.idk)
    console.log(this.idk)
  }
}

module.exports = ReportAllianceStreamMessage;
