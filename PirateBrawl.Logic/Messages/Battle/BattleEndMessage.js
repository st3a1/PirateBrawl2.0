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
  constructor(session, battle_result, playerArray, rank, account, game, mapID) {
    super(session);
    this.id = 0x5ba0;
    this.session = session;
    this.version = 0x1;
    this.battle_result = battle_result;
    this.playerArray = playerArray;
    this.rank = rank;
    this.account = account;
    this.game = game;
    this.mapID = mapID
    this.stream = new ByteStream();
    this.newTokensDoublerValue = 0x0;
  }
  
  async encode() {
    console.log(this.rank)
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

    this.stream.writeVInt(this.game);
    this.stream.writeVInt((this.game === 2 || this.game === 5) ? this.rank : this.battle_result);
    this.stream.writeVInt(this.session.tokengained);
    this.stream.writeVInt(this.session.trophiesnew);
    this.stream.writeVInt(1337);// Unknown (Power Play Related)

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
    this.stream.writeVInt(16) // Battle Result Type (0-15 = Practice Battle End, 16-31 = Matchmaking Battle End, 32-47 = Friendly Game Battle End, 48-63  = Spectate and Replay Battle End)
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
    /*const brawl = this.account.Brawlers.find(brawler => brawler.id === this.brawler);

    var ranked = 0
    if (brawl.trophies >= 140 && brawl.trophies <= 160 && brawl.r10 == false) {
    ranked = 8
    this.account.Resources.Starpoints += 100
    brawl.r10 = true
    } else if (brawl.trophies >= 300 && brawl.trophies <= 340 && brawl.r15 == false) {
    ranked = 13
    this.account.Resources.Starpoints += 200
    brawl.r15 = true
    } else if (brawl.trophies >= 500 && brawl.trophies <= 550 && brawl.r20 == false) {
    ranked = 18
    this.account.Resources.Starpoints += 300
    brawl.r20 = true
    } else if (brawl.trophies >= 750 && brawl.trophies <= 800 && brawl.r25 == false) {
    ranked = 23
    this.account.Resources.Starpoints += 400
    brawl.r25 = true
    } else if (brawl.trophies >= 1000 && brawl.trophies <= 1050 && brawl.r30 == false) {
    ranked = 28
    this.account.Resources.Starpoints += 500
    brawl.r30 = true
    } else if (brawl.trophies >= 1250 && brawl.trophies <= 1300 && brawl.r35 == false) {
    ranked = 33
    this.account.Resources.Starpoints += 600
    brawl.r35 = true
    } else {
    star = 0
    }

    var star = 0
    if (brawl.trophies >= 140 || 300 || 500 || 750 || 1000 || 1250) {
    star = 1
    } else {
    star = 0
    }
    */
    
    this.stream.writeVInt(0) // Milestones Count
    //+this.stream.writeDataReference(39, 0)

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