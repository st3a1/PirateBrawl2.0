const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class TeamChatMessages extends PiranhaMessage {
  constructor(session, roomInfo) {
    super(session);
    this.id = 24131;
    this.session = session;
    this.version = 1;
    this.roomInfo = roomInfo;
    this.stream = new ByteStream();
  }

  async encode() {

    const Message = this.roomInfo.msg[this.roomInfo.msg.length - 1];
    const fm =[]
    if (Message){
      this.stream.writeVInt(0);
      this.stream.writeVInt(this.roomInfo.id);
      this.stream.writeVInt(1);
        this.stream.writeVInt(Message.event);
        this.stream.writeVInt(0);
        this.stream.writeVInt(this.roomInfo.Tick);//Tick?
        this.stream.writeVInt(0);
        this.stream.writeVInt(Message.id);//id
        this.stream.writeString(Message.senderName);
        this.stream.writeVInt(0);
        this.stream.writeVInt(0);
        this.stream.writeVInt(0);
        if (Message.event === 4){
          this.stream.writeVInt(Message.msg);
          this.stream.writeVInt(1);
          this.stream.writeVInt(0);
          this.stream.writeVInt(Message.senderID);
          this.stream.writeString(Message.senderName);
        }else if (Message.event === 8){
          this.stream.writeScId(40, Message.Pin) // Message Data ID (40 - messages.csv)
          this.stream.writeBoolean(Message.mode === undefined ? true : false) // Target Boolean
          this.stream.writeString(Message.senderName) //# Target Name
          this.stream.writeVInt(1) // ??
          if(Message.mode === undefined) this.stream.writeVInt(52000000 + Message.Pin);
          if(Message.mode !== undefined) this.stream.writeVInt(Message.mode);

        }else{
          this.stream.writeString(Message.msg);
        }
    }
  }
}

module.exports = TeamChatMessages;
