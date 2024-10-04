const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const RewardEntry = require("../../Entries/RewardEntry");

class SeasonRewardsMessage extends PiranhaMessage {
  constructor(session, type) {
    super(session);
    this.id = 24123;
    this.session = session;
    this.version = 0;
    this.stream = new ByteStream();
    this.type = type

    this.rewardEntries = [
      new RewardEntry(501, 524, 20, 500, false),
      new RewardEntry(525, 549, 50, 524, false),
      new RewardEntry(550, 574, 70, 549, false),
      new RewardEntry(575, 599, 80, 574, false),
      new RewardEntry(600, 624, 90, 599, false),
      new RewardEntry(625, 649, 100, 624, false),
      new RewardEntry(650, 674, 110, 649, false),
      new RewardEntry(675, 699, 120, 674, false),
      new RewardEntry(700, 724, 130, 699, false),
      new RewardEntry(725, 749, 140, 724, false),
      new RewardEntry(750, 774, 150, 749, false),
      new RewardEntry(775, 779, 160, 774, false),
      new RewardEntry(800, 824, 170, 799, false),
      new RewardEntry(825, 849, 180, 824, false),
      new RewardEntry(850, 874, 190, 849, false),
      new RewardEntry(875, 899, 200, 874, false),
      new RewardEntry(900, 924, 210, 885, false),
      new RewardEntry(925, 949, 220, 920, false),
      new RewardEntry(950, 974, 230, 940, false),
      new RewardEntry(975, 999, 240, 960, false),
      new RewardEntry(1000, 1049, 250, 999, false),
      new RewardEntry(1050, 1099, 260, 980, false),
      new RewardEntry(1100, 1149, 270, 1000, false),
      new RewardEntry(1150, 1199, 280, 1020, false),
      new RewardEntry(1200, 1249, 290, 1040, false),
      new RewardEntry(1250, 1299, 300, 1060, false),
      new RewardEntry(1300, 1349, 310, 1080, false),
      new RewardEntry(1350, 1399, 320, 1100, false),
      new RewardEntry(1400, 1449, 330, 1120, false),
      new RewardEntry(1450, 1499, 340, 1140, false),
      new RewardEntry(1500, -1, 350, 1150, true)
    ]
  }

  async encode() {
    this.stream.writeVInt(this.type)
    if(this.type === 1) {
        this.stream.writeVInt(this.rewardEntries.length) // count

        for (const entry of this.rewardEntries) {
          entry.encode(this.stream);
        }
    }else if(this.type === 4) { // челендж какой то наверное по типу псж
    // потом, в 24 нету
    }else if(this.type === 6) { // special chempeonad
    // потом, в 24 нету 
    }
  }
}

module.exports = SeasonRewardsMessage;