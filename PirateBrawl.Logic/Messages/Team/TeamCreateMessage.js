const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const TeamMessage = require('./TeamMessage');
const Events = require('../../../PirateBrawl.Server/Utils/Events');
const Gameroom = require('../../../PirateBrawl.Server/Utils/Gameroom');
const DisconnectedMessage = require('../Home/DisconnectedMessage');

class TeamCreateMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14350; // 350
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.idk = this.stream.readVInt();
    this.mapSlot = this.stream.readVInt();
    this.roomType = this.stream.readVInt();
  }

  async process () {
    const playerdb = await database.getAccount(this.session.lowID)

    this.mapID = 7
    if (this.mapSlot === -64){
      this.mapSlot = 0;
      this.mapID = 7;
    }else{
      const EventsInstance = new Events();
      this.mapID = EventsInstance.getIdBySlotID(this.mapSlot); // Вызываем метод для поиска события
    }
    const gameroomInstance = new Gameroom();
    const roomData = {
      mapSlot:this.mapSlot,
      mapID:this.mapID,
      roomType:this.roomType,
      msg: {
        event: 4,
        id: this.session.lowID,
        senderName: this.session.Name,
        senderID: this.session.lowID,
        msg: 101,
      }
    }
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
    const room = gameroomInstance.create(roomData, plrData);
    this.session.roomID = room.id;
    new TeamMessage(this.session, room).send()
  }
}
module.exports = TeamCreateMessage;
