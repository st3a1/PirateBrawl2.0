const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../Laser.Server/Gameroom');
const Characters = require("../../GameFiles/Characters")


class TeamChangeMemberSettingsMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14354;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.a1 = this.stream.readVInt();
    this.csv_id = this.stream.readVInt();
    this.SelectSkin = this.stream.readVInt();
    this.a2 = this.stream.readVInt();
  }

  async process () {
    const GM = new Gameroom();
    const roomInfo = GM.getRoomById(this.session.roomID);
    if (roomInfo !== null) {
      const playerdb = await database.getAccount(this.session.lowID);
      const brawlerID = global.Characters.getBrawlerBySkinID(this.SelectSkin);
      const brawler = playerdb.Brawlers.find(b => b.id === brawlerID);
      this.session.BrawlerID = brawlerID;
      this.session.SkinID = this.SelectSkin;
      GM.changePlayerFighter(this.session.roomID, this.session.lowID, this.SelectSkin, brawler);
      for (const player of roomInfo.players) {
        new TeamMessage(this.session, roomInfo).sendLowID(player.lowID);
      }
    }
  }
}
module.exports = TeamChangeMemberSettingsMessage;
