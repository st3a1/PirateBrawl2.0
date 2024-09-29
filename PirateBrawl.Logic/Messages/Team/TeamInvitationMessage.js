const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const Entry = require('../../../PirateBrawl.Titan/Entry/Entry')

class TeamInvitationMessage extends PiranhaMessage {
  constructor(session, roomInfo, plr) {
    super(session);
    this.id = 24589;
    this.session = session;
    this.version = 1;
    this.roomInfo = roomInfo;
    this.plr = plr;
    this.stream = new ByteStream();
  }

  async encode() {
    const Entrys = new Entry();

    this.stream.writeVInt(1);

    this.stream.writeInt(0);
    this.stream.writeInt(this.roomInfo.id);//this.roomInfo.id
    this.stream.writeInt(0);
    this.stream.writeInt(this.plr.lowID+3); //low id inviter

    this.stream.writeString();
    this.stream.writeString();
    this.stream.writeString();

    this.stream.writeString();
    this.stream.writeString();
    this.stream.writeString();

    this.stream.writeInt(this.plr.Trophies);//this.inviter.trophies
    this.stream.writeInt(0);
    this.stream.writeInt(0);

    this.stream.writeInt(0);
    this.stream.writeInt(0);

    this.stream.writeBoolean(true);
    this.stream.writeInt(0);
    this.stream.writeInt(3);
    this.stream.writeInt(0);

    this.stream.writeString();
    this.stream.writeInt(0);
    this.stream.writeInt(0);

    this.stream.writeString();
    this.stream.writeInt(0);
    this.stream.writeBoolean(true);
    Entrys.PlayerDisplayData(this.stream, this.plr.Name, this.plr.Thumbnail, this.plr.Namecolor);
  }
}

module.exports = TeamInvitationMessage;
