const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../Laser.Server/db")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../Laser.Server/Gameroom');

class TeamSpectateMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14358;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.mapSlot = this.stream.readVInt();
    this.roomID = this.stream.readVInt();
    this.roomType = this.stream.readVInt();
  }

  async process () {
    const gameroomInstance = new Gameroom();
    const playerdb = await database.getAccount(this.session.lowID)
    const brawler = playerdb.Brawlers.find(b => b.id === playerdb.BrawlerID);
    const plrData = {
        isOwner: true,
        lowID: playerdb.lowID,
        BrawlerID: playerdb.BrawlerID,
        SkinID: playerdb.SkinID,
        brawler: brawler,
        status: 3,
        ready: false,
        Name: playerdb.Name,
        Thumbnail: playerdb.Thumbnail,
        Namecolor: playerdb.Namecolor,
      }
      const messageData = {
        event: 4,
        id: this.session.lowID,
        senderName: playerdb.Name,
        senderID: this.session.lowID,
        msg: 102,
      };
    const roomInfo = gameroomInstance.roomJoin(this.roomID, plrData, messageData)
    if (roomInfo !== null){
        this.session.roomID = roomInfo.id
        for (const ids of roomInfo.players) {
          new TeamMessage(this.session, roomInfo).sendLowID(ids.lowID)
        }
    }
  }
}
module.exports = TeamSpectateMessage;
