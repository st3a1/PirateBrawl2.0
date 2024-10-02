const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class SeasonRewardsMessage extends PiranhaMessage {
  constructor(session, type) {
    super(session);
    this.id = 24123;
    this.session = session;
    this.version = 0;
    this.stream = new ByteStream();
    this.type = type
  }

  async encode() {
    this.stream.writeVInt(this.type)
    if(this.type === 1){
        this.stream.writeVInt(1) // count
        this.stream.writeVInt(1488) // trophies start 1
        this.stream.writeVInt(1337) // trophies start 2
        this.stream.writeVInt(1611) // starpoints reward
        this.stream.writeVInt(1999) // trophies after
    }else if(this.type === 4) { // челендж какой то наверное по типу псж
    // потом, в 24 нету
    }else if(this.type === 6) { // special chempeonad
    // потом, в 24 нету 
    }
  }
}

module.exports = SeasonRewardsMessage;