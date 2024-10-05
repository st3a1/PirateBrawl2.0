const fs = require('fs');
const Character = require("../../GameFiles/Characters")

class Shop {
    constructor() {
        //
    }

    loadShopArray() {
        try {
            const data = fs.readFileSync('../../PirateBrawl.Titan/JSON/offers.json', 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading offers.json:', error.message);
            return [];
        }
    }

    getAllOffer() {
        return this.shoparray;
    }
    async giftAllPlayer(data){
        const offers = fs.readFileSync('../../PirateBrawl.Titan/JSON/offers.json', 'utf8');
        const OffersParsed = JSON.parse(offers);
        const EndDate = new Date()
        EndDate.setDate(EndDate.getDate() + 1);
        EndDate.setHours(9, 0, 0, 0);

        data.EndDate = EndDate;
        OffersParsed.push(data)

        const jsonData = JSON.stringify(OffersParsed, null, 2);
        fs.writeFileSync('../../PirateBrawl.Titan/JSON/offers.json', jsonData, 'utf8');
    }
    findItemByIndex(index,Shop) {
        if (index >= 0 && index < Shop.length) {
          return Shop[index];
        } else {
          return null;
        }
      }
    shuffleArray(array) {
        let shuffledArray = array.slice(); // Create a copy of the array
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
        }
        return shuffledArray;
    }
    generateShop(player) {
        player.Shop = [];
        const EndDate = new Date()
        EndDate.setDate(EndDate.getDate() + 1);
        EndDate.setHours(9, 0, 0, 0);
        var unlockedBrawlers = player.Brawlers.filter(brawler => brawler.unlocked === true && brawler.points < 1440 && brawler.level < 8);
        var BrawlersONSkins = player.Brawlers.filter(brawler => brawler.unlocked === true);
        var BrawlerDailyShop = [];
        var skinofDay = [];

        const Random = Math.floor(Math.random() * 3);

        const commonProperties = {
            "name": "",
            "cost": 0,
            "EndDate": EndDate,
            "ShopDisplay": 1,
            "type": 0,
            "claim": false,
            "includes": [{"id": 0, "multiplier": 1, "dataRef": [0, 0], "skinID": 0}]
        };
        
        if (Random === 0) {
            commonProperties.includes[0].id = 1;
            commonProperties.includes[0].multiplier = Math.floor(Math.random() * 333);
        } else if (Random === 1) {
            commonProperties.includes[0].id = 6;
            commonProperties.cost = 0;
        } else if (Random === 2) {
            commonProperties.includes[0].id = 10;
            commonProperties.cost = 40;
        }
        player.Shop.push({ ...commonProperties });
        
        for (let i = 0; i < 5; i++) {
            if (unlockedBrawlers.length > 0) {
                let randomIndex = Math.floor(Math.random() * unlockedBrawlers.length);
                const bID = unlockedBrawlers[randomIndex].id;
                unlockedBrawlers.splice(randomIndex, 1);
                BrawlerDailyShop.push(bID);
            }
        }

        for (let i = 0; i < 6; i++) {
            if (BrawlersONSkins.length > 0) {
                let randomIndex2 = Math.floor(Math.random() * BrawlersONSkins.length);
                const bID2 = BrawlersONSkins[randomIndex2].id;
                BrawlersONSkins.splice(randomIndex2, 1);
                skinofDay.push(bID2);

            }
        }

        
        for (let id of BrawlerDailyShop) {
            let idk = Math.floor(Math.random() * 333)
            const commonProperties2 = {
                "name": " ",
                "cost": idk*2,
                "EndDate": EndDate,
                "ShopDisplay": 1,
                "type": 1,
                "claim": false,
                "includes": [
                    {
                        "id": 8,
                        "multiplier": idk,
                        "dataRef": [16, id],
                        "skinID": 0
                    }
                ]
            }
            player.Shop.push({ ...commonProperties2 });
        }

          
        let shuffledSkins = this.shuffleArray(global.skins);
        for (let id of shuffledSkins) {
            if (player.Skins && !player.Skins.includes(id.id)) {
                const brawler = Character.getBrawlerBySkinID(id.id);
                if (skinofDay.includes(brawler)) {
					const Random = Math.floor(Math.random() * 3);
					let oldcost = 0
					if (Random === 1) oldcost = id.cost/2;
					if (Random === 2) oldcost = id.cost/3;
                    const commonProperties2 = {
                        "name": "",
                        "cost": id.cost,
                        "EndDate": EndDate,
                        "ShopDisplay": 0,
                        "type": 0,
						"OldPrice": oldcost,
                        "claim": false,
                        "includes": [
                            {
                                "id": 4,
                                "multiplier": 1,
                                "dataRef": [0, 0],
                                "skinID": id.id
                            }
                        ]
                    }
                    player.Shop.push({ ...commonProperties2 });
                }        
            }
        }
        var GiftAll = this.loadShopArray();
        GiftAll.forEach(e => {
            const currentDate = new Date().getDay();
            const endDate = new Date(e.EndDate).getDay();
            
            const timeDifference = endDate - currentDate;
            const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
            
            if(dayDifference >= 0){
                e.EndDate = EndDate;
                player.Shop.push({ ...e });
            }
        });
        
        

        return player.Shop
    }

    encode(stream, account) {
        const currentTime = new Date();
        this.stream = stream
        this.offers = account.Shop
        this.stream.writeVInt(this.offers.length) 
    
        for(let offer of this.offers){
            this.stream.writeVInt(offer.includes.length)
            for(let item of offer.includes){
                this.stream.writeVInt(item.id)
                this.stream.writeVInt(item.multiplier)
                this.stream.writeDataReference(item.dataRef[0], item.dataRef[1])
                this.stream.writeVInt(item.skinID)
            }
            this.stream.writeVInt(offer.type)
        
            this.stream.writeVInt(offer.cost)
            this.stream.writeVInt(Math.floor((new Date(offer.EndDate) - currentTime) / 1000))//Timer ?? 
        
            this.stream.writeVInt(1)//Offer View | 0 = Absolutely "NEW", 1 = "NEW", 2 = Viewed
            this.stream.writeVInt(100)
            this.stream.writeBoolean(offer.claim)// purchased
        
            this.stream.writeBoolean(false)
            this.stream.writeVInt(offer.ShopDisplay)// [0 = Normal, 1 = Daily Deals]
            this.stream.writeVInt(offer.OldPrice || 0)//OldPrice
      
            this.stream.writeInt(0)
            this.stream.writeString(offer.name)
      
            this.stream.writeBoolean(false)
            this.stream.writeString("")

        }
    }
}

module.exports = Shop;

/*


const fs = require("fs")
const LogicOfferBundle = require("../../PirateBrawl.Logic/Offers/LogicOfferBundle")
const Character = require("../../GameFiles/Characters")
const LogicGemOffer = require("../../PirateBrawl.Logic/Offers/LogicGemOffer")
const ChronosTextEntry = require("../../PirateBrawl.Logic/Entries/ChronosTextEntry")

class ShopOffers {
    constructor(){
    this.gemOffers = []
    // патом я типо в this.gemOffers буду push new LogicGemOffer(Shop.GemOffer.Type, Shop.GemOffer.Count, ShopGemOffer.DataReference, Shop.GemOffer.ExtraData)  
    this.offers = []
    // а тутв new LogicOfferBundle(this.gemOffers, Shop.ShopType, Shop.Cost, Shop.Timer, Shop,OldCost, Shop.Status, Shop.IsClaim, Shop.Display, false, "offer_xmas")
    }
    shuff(array) {
        let shuffledArray = array.slice(); // Create a copy of the array
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
        }
        return shuffledArray;
    }

    generate(player) {
        player.Shop = []
        const EndDate = new Date()
        EndDate.setDate(EndDate.getDate() + 1)
        EndDate.setHours(11, 0, 0, 0)
        var unlockedBrawlers = player.Brawlers.filter(brawler => brawler.unlocked === true && brawler.points < 1440 && brawler.level < 8)
        var BrawlersONSkins = player.Brawlers.filter(brawler => brawler.unlocked === true)
        var BrawlerDailyShop = []
        var skinofDay = []

        const Random = Math.floor(Math.random() * 3);

        /*const commonProperties = {
            "Text": "",
            "Cost": 1,
            "Timer": 4444,
            "ShopDisplay": 1,
            "ShopType": 0,
            "Status" : 0,
            "OldCost": 1337,
            "IsClaim": false,
            "GemOffer": [
                {
                    "Type": 1,
                    "Count": 1337,
                    "DataReference": [0, 0],
                    "ExtraData": 0
                }
            ]
        };
        
        if (Random === 0) {
            commonProperties.includes[0].id = 1;
            commonProperties.includes[0].multiplier = Math.floor(Math.random() * 333);
        } else if (Random === 1) {
            commonProperties.includes[0].id = 6;
            commonProperties.cost = 0;
        } else if (Random === 2) {
            commonProperties.includes[0].id = 10;
            commonProperties.cost = 40;
        }
        player.Shop.push({ ...commonProperties });
        
        for (let i = 0; i < 5; i++) {
            if (unlockedBrawlers.length > 0) {
                let randomIndex = Math.floor(Math.random() * unlockedBrawlers.length);
                const bID = unlockedBrawlers[randomIndex].id;
                unlockedBrawlers.splice(randomIndex, 1);
                BrawlerDailyShop.push(bID);
            }
        }

        for (let i = 0; i < 6; i++) {
            if (BrawlersONSkins.length > 0) {
                let randomIndex2 = Math.floor(Math.random() * BrawlersONSkins.length);
                const bID2 = BrawlersONSkins[randomIndex2].id;
                BrawlersONSkins.splice(randomIndex2, 1);
                skinofDay.push(bID2);

            }
        }

        
        for (let id of BrawlerDailyShop) {
            let idk = Math.floor(Math.random() * 333)
            const commonProperties2 = {
                "Text": "",
                "Cost": idk*2,
                "Timer": EndDate,
                "ShopDisplay": 1,
                "ShopType": 1,
                "Status" : 0,
                "OldCost": 123,
                "IsClaim": false,
                "OfferBGR": "offer_coins",
                "GemOffer": [
                    {
                        "Type": 8,
                        "Count": idk,
                        "DataReference": [16, id],
                        "ExtraData": 0
                    }
                ]
            }
            player.Shop.push({ ...commonProperties2 });
        }

          
        let shuffledSkins = this.shuff(global.skins);
        for (let id of shuffledSkins) {
            if (player.Skins && !player.Skins.includes(id.id)) {
                const brawler = Character.getBrawlerBySkinID(id.id);
                if (skinofDay.includes(brawler)) {
					const Random = Math.floor(Math.random() * 3);
					let oldcost = 0
					if (Random === 1) oldcost = id.cost/2;
					if (Random === 2) oldcost = id.cost/3;
                    const SkinsData = {
                        "Text": "",
                        "Cost": id.cost,
                        "Timer": EndDate,
                        "ShopDisplay": 0,
                        "ShopType": 0,
                        "Status" : 0,
						"OldCost": 0,
                        "IsClaim": false,
                        "OfferBGR": "offer_coins",
                        "GemOffer": [
                            {
                                "Type": 4,
                                "Count": 1,
                                "DataReference": [0, 0],
                                "ExtraData": id.id
                            }
                        ]
                    }
                    player.Shop.push({ ...SkinsData });
                    
                }  
            }
        } 
        //this.gemOffers.push(new LogicGemOffer({ ...SkinsData }))
        return player.Shop
    }

    encode(stream, account){
        this.offers = account.Shop
        stream.writeVInt(this.offers.length)
        new LogicOfferBundle(account, stream)
    }
}
module.exports = ShopOffers;
*/
