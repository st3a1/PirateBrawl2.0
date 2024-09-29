const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class LogicDeliveryNotification extends PiranhaMessage {
  constructor(session, SkinID, BrawlerID, Gems) {
  super(session);
      this.id = 24111;
      this.session = session;
      this.version = 1;
      this.stream = new ByteStream();
      this.SkinID = SkinID;
      this.BrawlerID = BrawlerID;
      this.Gems = Gems;
  }
    async encode() {
        let math = 0 ;
        if (this.SkinID !== undefined) math+=1;
        if (this.BrawlerID !== undefined) math+=1;
        if (this.Gems !== undefined) math+=1;
        this.stream.writeVInt(203);
        this.stream.writeVInt(0);
        this.stream.writeVInt(1)
        this.stream.writeVInt(100)

        this.stream.writeVInt(math)
        if(this.SkinID !== undefined){
            this.stream.writeVInt(1)//multiplier
            this.stream.writeVInt(0);
            this.stream.writeVInt(9);//skins
            this.stream.writeDataReference(29, this.SkinID);
            this.stream.writeVInt(0);
            this.stream.writeVInt(0);
        }

        if(this.BrawlerID !== undefined){
            this.stream.writeVInt(1)//multiplier
            this.stream.writeDataReference(16, this.BrawlerID);
            this.stream.writeVInt(1);
            this.stream.writeVInt(0);
            this.stream.writeVInt(0);
        }
        if(this.Gems !== undefined){
            this.stream.writeVInt(this.Gems)//multiplier
            this.stream.writeVInt(0);
            this.stream.writeVInt(8);//gems
            
            this.stream.writeVInt(0);
            this.stream.writeVInt(0);

            this.stream.writeVInt(0);
        }
        for (let i = 0; i < 13; i++) {
            this.stream.writeVInt(0);
        }
    }
}

module.exports = LogicDeliveryNotification;