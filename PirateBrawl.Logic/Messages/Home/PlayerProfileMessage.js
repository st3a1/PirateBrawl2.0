const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const Entry = require('../../../PirateBrawl.Titan/Entry/Entry');
const Entrys = new Entry();

class PlayerProfileMessage extends PiranhaMessage {
  constructor(session, account, club) {
    super(session);
    this.id = 24113;
    this.session = session;
    this.version = 0;
    this.account = account;
    this.club = club
    this.stream = new ByteStream();
  }

  async encode() {
    this.stream.writeLogicLong(0, this.account.lowID)
    this.stream.writeVInt(0)

    const brawlersArray = this.account.Brawlers;

    const excludedIds = [36, 35, 33];
    const unlockedBrawlers = brawlersArray.filter(brawler => brawler.unlocked === true && !excludedIds.includes(brawler.id));
    const unlockedCount = unlockedBrawlers.length;

    this.stream.writeVInt(unlockedCount);
    for (const brawler of unlockedBrawlers) {
        this.stream.writeDataReference(16, brawler.id);
        this.stream.writeVInt(0);
        this.stream.writeVInt(brawler.trophies);
        this.stream.writeVInt(brawler.trophies);
        this.stream.writeVInt(brawler.level);
    }
    this.stream.writeVInt(14)
    this.stream.writeLogicLong(1, this.account.Indicators.TRIOWINS) // 3vs3 wins
    this.stream.writeLogicLong(2, this.account.Experience) // exp
    this.stream.writeLogicLong(3, this.account.Trophies) // trophies
    this.stream.writeLogicLong(4, this.account.HightTrophies) // hightrophies
    this.stream.writeLogicLong(5, unlockedCount) // brawlersAmount
    this.stream.writeLogicLong(6, 1) // idk
    this.stream.writeLogicLong(7, 1)  // Something.
    this.stream.writeLogicLong(8, this.account.Indicators.SOLOWINS) // Solo wins
    this.stream.writeLogicLong(9, 0) // RoboRumble time
    this.stream.writeLogicLong(10, 0) // BigBrawler time
    this.stream.writeLogicLong(11, this.account.Indicators.DUOWINS) // Duo wins
    this.stream.writeLogicLong(12, 0) // Passed level BossFight
    this.stream.writeLogicLong(13, 0)//9999
    this.stream.writeLogicLong(14, 0) // Best place in power play
    
    Entrys.PlayerDisplayData(this.stream, this.account.Name, this.account.Thumbnail, this.account.Namecolor);

    if (this.club !== null){
      this.stream.writeBoolean(true) // alliance
      this.stream.writeInt(0)
      this.stream.writeInt(this.account.ClubID)
      this.stream.writeString(this.club.Name)  // club name
      this.stream.writeDataReference(8, this.club.BadgeID); // BadgeID type
      this.stream.writeVInt(this.club.Type)  // club type | 1 = Open, 2 = invite only, 3 = closed
      this.stream.writeVInt(this.club.members.length) // Current members count
      this.stream.writeVInt(this.club.Trophies)
      this.stream.writeVInt(this.club.Trophiesneeded)  // Trophy required
      this.stream.writeVInt(0)  // (Unknown)
      this.stream.writeString("BY")  // region
      this.stream.writeVInt(0)  // (Unknown)
      this.stream.writeDataReference(25, this.account.ClubRole);
    }else{
      this.stream.writeVInt(0)
      this.stream.writeVInt(0)
    }
  }
}

module.exports = PlayerProfileMessage;
