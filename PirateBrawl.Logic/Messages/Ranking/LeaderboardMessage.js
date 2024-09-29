const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const Entry = require('../../../PirateBrawl.Titan/Entry/Entry');

class LeaderboardMessage extends PiranhaMessage {
  constructor (session, brawler, type, leaders) {
    super(session)
    this.id = 24403
    this.session = session
    this.brawler = brawler
    this.type = type
    this.leaders = leaders
    this.version = 1
    this.stream = new ByteStream()

  }

  async encode () {
    const Entrys = new Entry();

    let x = 0;
    this.stream.writeVInt(this.type)// LeaderboardType

    if (this.type === 0){
      this.stream.writeVInt(0)
      this.stream.writeDataReference(16, this.brawler)
    }else{
      this.stream.writeVInt(0)
      this.stream.writeVInt(0)
    }

    this.stream.writeString()// Region
    this.stream.writeVInt(this.leaders.length);

    if (this.type === 1) {
      this.leaders.forEach((leader, i) => {
          if (leader.lowID === this.session.lowID) {
              x = i + 1;
          }
          this.stream.writeVInt(0); // High ID
          this.stream.writeVInt(leader.lowID); // Low ID
          this.stream.writeVInt(1);
          this.stream.writeVInt(leader.Trophies); // Player Trophies
          this.stream.writeVInt(1);
          this.stream.writeString(); // Club Name
          Entrys.PlayerDisplayData(this.stream, leader.Name, leader.Thumbnail, leader.Namecolor);
          this.stream.writeVInt(0);
      });  
    }else if (this.type === 0){
      this.leaders.forEach((leader, i) => {
        if (leader.lowID === this.session.lowID) {
            x = i + 1;
        }
        this.stream.writeVInt(0);
        this.stream.writeVInt(leader.lowID); // Low ID
        this.stream.writeVInt(1);
        this.stream.writeVInt(leader.brawler.trophies);
        this.stream.writeVInt(1);
        this.stream.writeString();
        Entrys.PlayerDisplayData(this.stream, leader.Name, leader.Thumbnail, leader.Namecolor);
        this.stream.writeVInt(0);
      }); 
    }else if (this.type === 2){
      this.leaders.forEach((leader, i) => {
        if (leader.lowID === this.session.lowID) {
            x = i + 1;
        }
        this.stream.writeVInt(0);
        this.stream.writeVInt(leader['clubID']);
  
        this.stream.writeVInt(1);
        this.stream.writeVInt(leader['Trophies']);
  
        this.stream.writeVInt(2);
  
        this.stream.writeString(leader['Name']);
        this.stream.writeVInt(leader['members'].length);
        this.stream.writeDataReference(8, leader['BadgeID'])
      }); 
    }
    this.stream.writeVInt(this.session.Trophies)
    this.stream.writeVInt(x)
    this.stream.writeVInt(this.type)
    this.stream.writeVInt(0)

    this.stream.writeString("BY")
  }
}

module.exports = LeaderboardMessage
