const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class BattleLogMessage extends PiranhaMessage {
  constructor(session) {
    super(session);
    this.id = 23458;
    this.session = session;
    this.version = 0x1;
    this.stream = new ByteStream();
  }
  
  async encode() {
    this.stream.writeBoolean(true)
    this.stream.writeVInt(1) // Count
    this.stream.writeVInt(1337)
    this.stream.writeVInt(0) // log create timer
    this.stream.writeVInt(1) // log type 1 - ok 3 - roborumble
    this.stream.writeVInt(1337) // reward count
    this.stream.writeVInt(0) // battle timer
    this.stream.writeVInt(2) // event type 1 ranked 2 frendly
    this.stream.writeDataReference(15, 0) //mb map id
    this.stream.writeVInt(0) // 0 win 1 defeat 3 draw
    this.stream.writeVInt(1)

    this.stream.writeInt(1337)
    this.stream.writeInt(1337)

    this.stream.writeVInt(1337)
    this.stream.writeBoolean(true)
    this.stream.writeVInt(1337)

    this.stream.writeVInt(1) // хз наверное BattleLogPlayerEntry::encode ja idk или players count тк я хз да привет

    this.stream.writeVInt(1)
    this.stream.writeLong(0, this.session.lowID)
    this.stream.writeVInt(1)
    this.stream.writeBoolean(false)
    this.stream.writeDataReference(16, 0) // brawler id
    this.stream.writeVInt(1)
    this.stream.writeVInt(1)
    this.stream.writeVInt(1)


    this.stream.writeString("idk")
    this.stream.writeVInt(100)
    this.stream.writeVInt(28000000)
    this.stream.writeVInt(43000000)




    this.stream.writeVInt(0)
    this.stream.writeBoolean(true)
    this.stream.writeBoolean(true)
  }
}

module.exports = BattleLogMessage;