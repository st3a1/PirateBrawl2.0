const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const ReleaseEntry = require('../../Entries/ReleaseEntry');
const LogicGemOffer = require('../../Offers/LogicGemOffer');
const LogicOfferBundle = require('../../Offers/LogicOfferBundle');
const ChronosTextEntry = require('../../Entries/ChronosTextEntry');

const Shop = require('../../../PirateBrawl.Server/Utils/Shop');
const Events = require('../../../PirateBrawl.Server/Utils/Events');
const Entry = require('../../../PirateBrawl.Titan/Entry/Entry');


class OwnHomeDataMessage extends PiranhaMessage {
  constructor (session, account) {
    super(session)
    this.id = 24101
    this.session = session
    this.account = account
    this.version = 0
    this.stream = new ByteStream()

    this.releaseEntries = [
      new ReleaseEntry(29, 259200),
      new ReleaseEntry(33, 432000)
    ];

    this.gemOffers = [
      new LogicGemOffer(1, 500)
    ]
    
    this.offers = [
      new LogicOfferBundle(this.gemOffers, 0, 0, 52000, 2, 0,false, false,new ChronosTextEntry("Мiнiтi", false), false, "offer_xmas")
    ]
  }


  async encode () {
    const currentDate = new Date();
    const targetDate = new Date(2024, 7, 1); 
    const timeDifference = targetDate - currentDate;

    const timeInSeconds = Math.floor(timeDifference / 1000);
    const Entrys = new Entry();
    this.stream.writeVInt(0)
    this.stream.writeVInt(0)

    this.stream.writeVInt(this.account.Trophies)//trophies
    this.stream.writeVInt(this.account.HightTrophies)//Hieght trophies

    this.stream.writeVInt(0)
    this.stream.writeVInt(this.account.TrophyRoadTier)

    this.stream.writeVInt(this.account.Experience) //Experience

    this.stream.writeDataReference(28, this.account.Thumbnail)
    this.stream.writeDataReference(43, this.account.Namecolor)

    this.stream.writeVInt(0)  // array

    // Selected Skins array
    this.stream.writeVInt(1)//len(this.player.brawlers_skins))
    this.stream.writeScId(29, this.account.SkinID);
    
    // Unlocked Skins array
    this.stream.writeVInt(this.account.Skins.length || 0) // UnlockedSkins
    for(let skin of this.account.Skins || []){
      this.stream.writeDataReference(29, skin)
    }

    this.stream.writeVInt(0) // Leaderboard Global TID (Asia, Global)
    this.stream.writeVInt(this.account.HightTrophies)
    this.stream.writeVInt(0)

    this.stream.writeBoolean(false)  // "token limit reached message" if true
    this.stream.writeVInt(1)
    this.stream.writeBoolean(true)

    this.stream.writeVInt(this.account.tokendoubler)  // Token doubler ammount
    this.stream.writeVInt(timeInSeconds)  // Season End Timer
    this.stream.writeVInt(0)
    this.stream.writeVInt(0)

    this.stream.writeVInt(0)
    this.stream.writeVInt(0)  // array

    this.stream.writeVInt(8)  // related to shop token doubler

    this.stream.writeBoolean(true)
    this.stream.writeBoolean(true)
    this.stream.writeBoolean(true)

    this.stream.writeVInt(0) // Name change price
    this.stream.writeVInt(0) // Timer for next name change

    // Shop Offers array
    new Shop().encode(this.stream, this.account)
    //TEST! TODO: REWRITE IT
    
    /*
    this.stream.writeVInt(1)
    this.stream.writeVInt(2)
        this.stream.writeVInt(4)
        this.stream.writeVInt(1)
        this.stream.writeDataReference(29, 134)
        this.stream.writeVInt(134)

        this.stream.writeVInt(3)
        this.stream.writeVInt(1)
        this.stream.writeDataReference(16, 25)
        this.stream.writeVInt(0)

    this.stream.writeVInt(0)

    
    this.stream.writeVInt(17)
    this.stream.writeVInt(1333338)//Timer ?? 

    this.stream.writeVInt(1)//Offer View | 0 = Absolutely "NEW", 1 = "NEW", 2 = Viewed
    this.stream.writeVInt(100)
    this.stream.writeBoolean(false)// purchased

    this.stream.writeBoolean(false)
    this.stream.writeVInt(0)// [0 = Normal, 1 = Daily Deals]
    this.stream.writeVInt(1488)//OldPrice

    this.stream.writeInt(1) // if str is csv - 1 else 0
    this.stream.writeString("TID_AVATAR_MESSAGE_TEXT_GEM_REVOKE")

    this.stream.writeBoolean(false)
    this.stream.writeString("offer_xmas")
    */
    



    this.stream.writeVInt(0)  // array

    this.stream.writeVInt(200)
    this.stream.writeVInt(0)  // Time till Bonus Tokens (seconds)

    this.stream.writeVInt(0)  // array

    this.stream.writeVInt(this.account.Resources.Tickets) // Tickets
    this.stream.writeVInt(0)

    this.stream.writeDataReference(16, this.session.BrawlerID)//brawlerID

    this.stream.writeString("RU")
    this.stream.writeString(this.account.AuthorCode)//authorCode


    Entrys.IntValueEntryLogicDailyData(this.stream,this.session)
    this.stream.writeVInt(1)  // cooldown entry
    this.stream.writeVInt(14)
    this.stream.writeDataReference(14, 14)
    this.stream.writeVInt(14)

    this.stream.writeVInt(0)  // array
    this.stream.writeVInt(0)  // array
    this.stream.writeVInt(0)  // array

    this.stream.writeVInt(2019049)

    this.stream.writeVInt(100) // Tokens needed for one brawl box
    this.stream.writeVInt(10) // Tokens needed for one big box

    this.stream.writeLogicLong(30, 3)

    this.stream.writeLogicLong(80, 10)

    this.stream.writeLogicLong(50, 1000)

    this.stream.writeVInt(500)
    this.stream.writeVInt(50)
    this.stream.writeVInt(999900)

    this.stream.writeVInt(0)  // array

    const EventsInstance = new Events();
    const Eventes = EventsInstance.getAllEvents()
    this.stream.writeVInt(Eventes.length)  // array
    for (const map of Eventes) {
        this.stream.writeVInt(map.slotid)
    }

    this.stream.writeVInt(Eventes.length)
    for (const map of Eventes) {
      this.stream.writeVInt(map.slotid)
      this.stream.writeVInt(map.slotid)
      this.stream.writeBoolean(map.Ended)

      this.stream.writeVInt(3600); // Записываем в поток
      this.stream.writeVInt(map.reward) // tokensш
      this.stream.writeDataReference(15, map.id)
      if(map.slotid === 5){
        this.stream.writeVInt(0)
      }else{
        this.stream.writeVInt(map.tokensclaimed.includes(this.session.lowID) === true ? 2 : 1)//Used
      }
      this.stream.writeString()
      this.stream.writeVInt(0) 
      this.stream.writeVInt(0) 
      this.stream.writeVInt(0) 
      this.stream.writeBoolean(true)
      const modif = map.slotid === 4 ? [1,3,4,5] : [1,2,3,4,5]
      this.stream.writeVInt(modif[Math.floor(Math.random() * modif.length)])
      this.stream.writeVInt(0)
    }

    this.stream.writeVInt(0) // Coming events array

    this.stream.writeVInt(8)
    for (const i of [20, 35, 75, 140, 290, 480, 800, 1250]) {
      this.stream.writeVInt(i)
    }

    this.stream.writeVInt(8)
    for (const i of [1, 2, 3, 4, 5, 10, 15, 20]) {
      this.stream.writeVInt(i)
    }

    this.stream.writeVInt(3)
    for (const i of [10, 30, 80]) {
      this.stream.writeVInt(i)
    }

    this.stream.writeVInt(3)
    for (const i of [6, 20, 60]) {
      this.stream.writeVInt(i)
    }

    this.stream.writeVInt(4)
    for (const i of [20, 50, 140, 280]) {
      this.stream.writeVInt(i)
    }

    this.stream.writeVInt(4)
    for (const i of [150, 400, 1200, 2600]) {
      this.stream.writeVInt(i)
    }

    this.stream.writeVInt(0)
    this.stream.writeVInt(200)  // Max Tokens
    this.stream.writeVInt(20)  // Plus Tokens

    this.stream.writeVInt(8640)
    this.stream.writeVInt(10)
    this.stream.writeVInt(5)

    this.stream.writeVInt(6)

    this.stream.writeVInt(50)
    this.stream.writeVInt(604800)

    this.stream.writeBoolean(true)  // Box boolean

    this.stream.writeVInt(this.releaseEntries.length)  // array

    for (const entry of this.releaseEntries) {
      entry.encode(this.stream);
    }

    Entrys.IntValueEntryLogicConfData(this.stream)

    //this.stream.writeVInt(1)
    

    this.stream.writeLong(0, this.account.lowID)

    const notificationCount = this.account.Notification.length;
    const notifications = this.account.Notification.reverse();

    this.stream.writeVInt(notificationCount);


    for (const notdata of notifications) {
      this.stream.writeVInt(notdata.ID); // NotificationID
      this.stream.writeInt(notdata.index); // NotificationIndex
      this.stream.writeBoolean(notdata.claim); // isSeen
      const sendeDate = new Date(notdata.date);
      this.stream.writeInt(Math.floor((currentDate - sendeDate) / 1000)); // Time ago was received
      this.stream.writeString(notdata.text); // Message
      if(notdata.ID === 94 || notdata.ID === 89 || notdata.ID === 81) this.stream.writeVInt(notdata.type > 1 ? 29000000+notdata.reward : notdata.type); // NotificationID
      if(notdata.ID === 89) this.stream.writeVInt(notdata.reward);
      if(notdata.ID === 93) this.stream.writeVInt(notdata.reward);
      if(notdata.ID === 79) {
        this.stream.writeVInt(notdata.brawlers.length);
        notdata.brawlers.forEach(e => {
          this.stream.writeVInt(16000000 + e.id)
          this.stream.writeVInt(Math.round(e.t/0.90))//HeroesTrophies
          this.stream.writeVInt(Math.round(e.t/0.90)-e.t)//HeroesTrophiesReseted
          this.stream.writeVInt(Math.round(e.t/0.90)-e.t)//StarpointsAwarded
        });
      }
    }

    this.stream.writeVInt(0)

    this.stream.writeBoolean(false)

    this.stream.writeLogicLong(0, 0)
    this.stream.writeLogicLong(0, this.session.lowID)
    this.stream.writeLogicLong(0, 0)
    this.stream.writeLogicLong(0, 0)

    this.stream.writeString(this.account.Name)
    this.stream.writeVInt(this.account.Name !== "JSV19" ? 1 : 0);


    this.stream.writeString()

    this.stream.writeVInt(8)

    this.stream.writeVInt(this.account.Brawlers.length + 4)

    for (const brawler of this.account.Brawlers) {
      this.stream.writeDataReference(23, brawler.cardID)
      this.stream.writeVInt(brawler.unlocked ? 1 : 0)
    }


    this.stream.writeDataReference(5, 1)
    this.stream.writeVInt(1337)//еthis.account.Resources.Box) // Small Box tokens

    this.stream.writeDataReference(5, 8)
    this.stream.writeVInt(1337)//this.account.Resources.Gold) // Gold

    this.stream.writeDataReference(5, 9)
    this.stream.writeVInt(1337)//this.account.Resources.BigBox) // Big Box tokens

    this.stream.writeDataReference(5, 10)
    this.stream.writeVInt(1337)//this.account.Resources.Starpoints) // StarPoints
    this.stream.writeVInt(this.account.Brawlers.length)
    for (const brawler of this.account.Brawlers) {
      this.stream.writeDataReference(16, brawler.id)
      this.stream.writeVInt(brawler.trophies)
    }

    this.stream.writeVInt(this.account.Brawlers.length)
    for (const brawler of this.account.Brawlers) {
      this.stream.writeDataReference(16, brawler.id)
      this.stream.writeVInt(brawler.trophies)
    }

    this.stream.writeVInt(0) // UnknownArray

    this.stream.writeVInt(this.account.Brawlers.length)
    for (const brawler of this.account.Brawlers) {
      this.stream.writeDataReference(16, brawler.id)
      this.stream.writeVInt(brawler.points)
    }

    this.stream.writeVInt(this.account.Brawlers.length)
    for (const brawler of this.account.Brawlers) {
      this.stream.writeDataReference(16, brawler.id)
      this.stream.writeVInt(brawler.level)
    }

    this.stream.writeVInt(global.skills.length)
    for(let skill of global.skills){
      this.stream.writeDataReference(23, skill)
      if (this.account.Skills.includes(skill)){
        this.stream.writeVInt(this.session.spg === skill ? 2 : 1)
      }else{
        this.stream.writeVInt(0)
      }
    }

//Brawlers Seem State Array
    this.stream.writeVInt(0)
//Brawlers Seem State Array End

    this.stream.writeVInt(this.account.Resources.Gems)
    this.stream.writeVInt(this.account.Resources.Gems)
    this.stream.writeVInt(1)//Player Experience Level
    this.stream.writeVInt(100)
    this.stream.writeVInt(0)//Cumulative Purchased Gems
    this.stream.writeVInt(0)//Battles Count
    this.stream.writeVInt(0)//Win Count
    this.stream.writeVInt(0)//Lose Count
    this.stream.writeVInt(0)//Win/Loose Streak
    this.stream.writeVInt(0)//Npc Win Count
    this.stream.writeVInt(0)//Npc Lose Count
    this.stream.writeVInt(2)//Tutorial State
    this.stream.writeVInt(1585502369)
    this.session.tokengained = 0;
    this.session.trophiesnew = 0;
    this.session.Trophies = this.account.Trophies
    this.session.bigtoken = 0;
    this.session.Name = this.account.Name
    this.session.Namecolor = this.account.Namecolor

    this.session.BrawlerID = this.account.BrawlerID;
    this.session.SkinID = this.account.SkinID;
  }
}

module.exports = OwnHomeDataMessage
