const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const Entry = require('../../../PirateBrawl.Titan/Entry/Entry');
class TeamMessage extends PiranhaMessage {
  constructor(session, roomInfo) {
    super(session);
    this.id = 24124;
    this.session = session;
    this.roomInfo = roomInfo;
    this.version = 0;
    this.stream = new ByteStream();
  }

  async encode() {
    const Entrys = new Entry();

    this.stream.writeVInt(this.roomInfo.roomType);//RoomType
    this.stream.writeBoolean(false)//?
    this.stream.writeVInt(3);

    this.stream.writeLong(0, this.roomInfo.id);


    this.stream.writeVInt(Math.floor(Date.now() / 1000));
    this.stream.writeBoolean(false)//?
    this.stream.writeVInt(0);

    this.stream.writeVInt(this.roomInfo.mapSlot);//Slot index
    this.stream.writeDataReference(15, this.roomInfo.mapID)//
    this.stream.writeVInt(this.roomInfo.players.length);//player lenght

    for (const player of this.roomInfo.players) {
      this.stream.writeBoolean(player.isOwner)//
      this.stream.writeInt(0);
      this.stream.writeInt(player.lowID);
      this.stream.writeDataReference(16, player.BrawlerID)//mapid
      this.stream.writeDataReference(29, player.SkinID)//mapid
      this.stream.writeVInt(player.brawler.trophies);//brawler trop
      this.stream.writeVInt(player.brawler.trophies);//brawler trop
      this.stream.writeVInt(player.brawler.level+1);//brawler levl
      this.stream.writeVInt(player.status);//Player State | 11: Events, 10: Brawlers, 9: Writing..., 8: Training, 7: Spectactor, 6: Offline, 5: End Combat Screen, 4: Searching, 3: Not Ready, 2: AFK, 1: In Combat, 0: OffLine
      this.stream.writeBoolean(player.ready)//IsReady
      this.stream.writeVInt(0);//Team 0 blue 1 read
      this.stream.writeVInt(0);
      this.stream.writeVInt(2);
      Entrys.PlayerDisplayData(this.stream, player.Name, player.Thumbnail, player.Namecolor);

      this.stream.writeDataReference(0, 0) 
    }
    this.stream.writeVInt(this.roomInfo.invites.length);//
    for (const invites of this.roomInfo.invites){
      this.stream.writeInt(0);
      this.stream.writeInt(this.roomInfo.id);

      this.stream.writeInt(0);
      this.stream.writeInt(invites.lowID);
      this.stream.writeString(invites.Name);
      this.stream.writeVInt(1);
    }
    this.stream.writeVInt(0);//Array
    this.stream.writeByte(2)

  }
}

module.exports = TeamMessage;
