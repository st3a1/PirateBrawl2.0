const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const Entry = require('../../../PirateBrawl.Titan/Entry/Entry');
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const {
  calculateShowdown,
  calculateDuoShowdown,
  calculateGemGrab
} = require("../../../PirateBrawl.Server/Utils/TrophiesData");
class BattleEndMessage extends PiranhaMessage {
  constructor(session, battle_result, playerArray, rank, account, game, vip, mapID) {
    super(session);
    this.id = 0x5ba0;
    this.session = session;
    this.version = 0x1;
    this.battle_result = battle_result;
    this.playerArray = playerArray;
    this.rank = rank;
    this.account = account;
    this.game = game;
    this.vip = vip
    this.mapID = mapID
    this.stream = new ByteStream();
    this.newTokensDoublerValue = 0x0;
  }
  
  async encode() {
    const Entrys = new Entry();
    const Brawler = this.account.Brawlers.find(brawler => brawler.id === this.account.BrawlerID);
    if (this.game === 1) {//3x3
      this.session.tokengained += Math.floor(Math.random() * 50);
      this.session.trophiesnew = calculateGemGrab(Math.round(Brawler.trophies), this.battle_result);
    } else if (this.game === 5){
      this.session.tokengained += Math.floor(Math.random() * 60);
      this.session.trophiesnew = calculateDuoShowdown(Math.round(Brawler.trophies), this.rank);
    }else if (this.game === 2) {//Showdown
      this.session.tokengained += Math.floor(Math.random() * 40);
      this.session.trophiesnew = calculateShowdown(Math.round(Brawler.trophies), this.rank);
    }
	if (this.session.trophiesnew === null) this.session.trophiesnew = 0;
	if (this.session.trophiesnew === undefined) this.session.trophiesnew = 0;
    if (this.vip) this.session.tokengained += Math.floor(Math.random() * 50)
    if (this.vip) this.session.trophiesnew += 8

    this.stream.writeVInt(this.game);
    this.stream.writeVInt((this.game === 2 || this.game === 5) ? this.rank : this.battle_result);
    this.stream.writeVInt(this.session.tokengained);
    this.stream.writeVInt(this.session.trophiesnew);
    this.stream.writeVInt(0);// Unknown (Power Play Related)

    if (this.account.Resources.TokensDoubler > 0) {
      let TokensDoubler = this.account.Resources.TokensDoubler;
      let cacult2 = TokensDoubler - this.session.tokengained;
      let cacult3 = Math.max(0, TokensDoubler - cacult2);
      this.stream.writeVInt(cacult3);
      this.stream.writeVInt(0);
      this.stream.writeVInt(Math.max(0, this.account.Resources.TokensDoubler - this.session.tokengained));
      this.newTokensDoublerValue = Math.max(0, this.account.Resources.TokensDoubler - this.session.tokengained);
      this.session.tokengained = this.session.tokengained + cacult3;
    } else {
      this.stream.writeVInt(0);
      this.stream.writeVInt(0);
      this.stream.writeVInt(0);
    }


    this.stream.writeVInt(0) // Championship Level Passed
    this.stream.writeVInt(0) // Challenge Reward Type (0 = Star Points, 1 = Star Tokens)
    this.stream.writeVInt(0) // Challenge Reward Ammount
    this.stream.writeVInt(0) // Championship Losses Left

    this.stream.writeVInt(0) // Championship Maximun Losses
    this.stream.writeVInt(0) // Coin Shower Event
    this.stream.writeVInt(0) // Underdog Trophies
    this.stream.writeVInt(16) // Battle Result Type
    this.stream.writeVInt(0) // Championship Cleared and Beta Quests
    const ingame = this.game === 5 ? 1 : this.playerArray.length

    this.stream.writeVInt(1+ingame);//Battle End Screen Players
    
    this.stream.writeVInt(1);// Player Team and Star Player Type
    this.stream.writeDataReference(16,this.account.BrawlerID);
    this.stream.writeDataReference(29,this.account.SkinID);
    this.stream.writeVInt(Brawler.trophies)
    this.stream.writeVInt(Brawler.trophies)
    this.stream.writeVInt(Brawler.level+1); // хз ебать
    this.stream.writeBoolean(true);// Player HighID and LowID Array
    this.stream.writeInt(0);// HighID
    this.stream.writeInt(this.account.lowID);// LowID

    Entrys.PlayerDisplayData(this.stream, this.account.Name, this.account.Thumbnail, this.account.Namecolor)
    for (let i = 0; i < ingame; i++) {
      this.stream.writeVInt(this.playerArray[i]['Team'] === 1 ? 2 : 0);// Player Team and Star Player Type

      this.stream.writeDataReference(16, this.playerArray[i]['brawlerID']);
      this.stream.writeVInt(this.playerArray[i]['skinID']);
      this.stream.writeVInt(Brawler.trophies*0.50);// Brawler Trophies
      this.stream.writeVInt(Brawler.trophies*0.50);// Brawler Trophies
      this.stream.writeVInt(Brawler.level); // brawler lvl
      this.stream.writeBoolean(false);// Player HighID and LowID Array
      Entrys.PlayerDisplayData(this.stream, this.playerArray[i]['name'], 0, 0)
    }

    // # Experience Entry Array
    this.stream.writeVInt(1) //# Count
    let Experience = Math.floor(Math.random() * 40);
    this.stream.writeVInt(this.battle_result)
    this.stream.writeVInt(Experience)
    //this.stream.writeVInt(8)// Star Player Experience ID
    //this.stream.writeVInt(mvpexperience) // Star Player Experience Gained
    // # Experience Entry Array End
    this.stream.writeVInt(0) // Milestones Count

    this.stream.writeVInt(2);
    this.stream.writeVInt(1)
    this.stream.writeVInt(Brawler.trophies)
    this.stream.writeVInt(Brawler.trophies)
    this.stream.writeVInt(5)
    this.stream.writeVInt(this.account.Experience - Experience)// 
    this.stream.writeVInt(this.account.Experience - Experience)

    this.stream.writeDataReference(28,0);
    this.stream.writeBoolean(false);

    Brawler.trophies = Math.round(Brawler.trophies) + this.session.trophiesnew

    this.account.Resources.Box += this.session.tokengained
    this.account.Resources.TokensDoubler = this.newTokensDoublerValue


    if(this.session.trophiesnew > 0){
      this.session.bigtoken += 1
      this.account.Resources.BigBox += this.session.bigtoken
      if (this.game === 2) {
        this.account.Indicators.SOLOWINS += 1
      } else if(this.game === 5){
        this.account.Indicators.DUOWINS += 1
      } else {
        this.account.Indicators.TRIOWINS += 1
      }
      await database.replaceValue(this.account.lowID, 'Indicators', this.account.Indicators)
    }
    await database.replaceValue(this.account.lowID, 'Resources', this.account.Resources);
    await database.replaceValue(this.account.lowID, 'Brawlers', this.account.Brawlers)
    await database.replaceValue(this.account.lowID, 'Experience', this.account.Experience+Experience)
  }
}

module.exports = BattleEndMessage;