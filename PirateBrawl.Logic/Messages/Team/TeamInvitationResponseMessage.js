const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../Laser.Server/db")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../Laser.Server/Gameroom');
const TeamChatMessages = require('./TeamChatMessages');

class TeamInvitationResponseMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14479;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.Response = this.stream.readVInt(); // 1 confirm - 2 deny
    this.ID2 = this.stream.readInt();
    this.roomID = this.stream.readInt();
  }

  async process () {
    const gameroomInstance = new Gameroom();
    if (this.Response === 1){
      const playerdb = await database.getAccount(this.session.lowID)
      const brawler = playerdb.Brawlers.find(b => b.id === playerdb.BrawlerID);
      const plrData = {
          isOwner: false,
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

      gameroomInstance.removeInvite(this.roomID, this.session.lowID);
      const roomInfo = gameroomInstance.roomJoin(this.roomID, plrData, messageData)
      if (roomInfo !== null){
        this.session.roomID = roomInfo.id
        for (const ids of roomInfo.players) {
          new TeamMessage(this.session, roomInfo).sendLowID(ids.lowID)
        }
      }
      
	  }else if (this.Response === 2){
      const roomInfo = gameroomInstance.removeInvite(this.roomID, this.session.lowID);
      for (const ids of roomInfo.players) {
        new TeamMessage(this.session, roomInfo).sendLowID(ids.lowID)
      }
    }
  }
}
module.exports = TeamInvitationResponseMessage;
