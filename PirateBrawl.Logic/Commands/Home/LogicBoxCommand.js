const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

class LogicBoxCommand extends PiranhaMessage {
    constructor(session, box, account, count = 1, isClaim=false) {
        super(session);
        this.id = 24111;
        this.session = session;
        this.version = 1;
        this.stream = new ByteStream();
        this.account = account
        this.box = box
        this.items = []
        this.count = count
        this.isClaim = isClaim
        this.excludedIds = [36, 35, 33];
        this.commandID = 1337
    }

    dropSPG(chance){
        if (this.BrawlerOf9LVL.length <= 0) return false;
        const isDrop = Math.floor(Math.random() * 100);

        if (isDrop > chance) return false;

        let randomIndex = Math.floor(Math.random() * this.BrawlerOf9LVL.length);

        const brawleraID = this.BrawlerOf9LVL[randomIndex].id;
        let spg = 0;
        if(!this.account.Skills.includes(global.Cards.getBrawlerSkills(4, brawleraID)[0])){
            spg = global.Cards.getBrawlerSkills(4, brawleraID)[0];
        }
        if(!this.account.Skills.includes(global.Cards.getBrawlerSkills(4, brawleraID)[1])){
            spg = global.Cards.getBrawlerSkills(4, brawleraID)[1];
        }
		if (spg === 0) return false;
        if(!this.account.Skills.includes(spg)){
            this.account.Skills.push(spg);
            database.replaceValue(this.account.lowID, 'Skills', this.account.Skills);
            return {
                'newItem': { type: 4, amount: 1, brawler: spg },
                'brawlerDrop': true
            }
        }else{ return false }
    }

    dropBrawler(blockedBrawlers, brawlerDrop, blockB, chance){
        let BrawlerIdDrop;
        if (blockB.includes(BrawlerIdDrop)) return {'brawlerDrop': false}

        if (blockedBrawlers.length <= 0) return {'brawlerDrop': false}
        brawlerDrop = Math.floor(Math.random() * 100);
        brawlerDrop = brawlerDrop >= chance ? true : false;
        if (!brawlerDrop) return {'brawlerDrop': false}

        let randomIndex = Math.floor(Math.random() * blockedBrawlers.length);
        BrawlerIdDrop = blockedBrawlers[randomIndex].id;
        const targetBrawler = blockedBrawlers.find(brawler => brawler.id === BrawlerIdDrop);

        if (targetBrawler.unlocked === false) {
            targetBrawler.unlocked = true;
            database.replaceValue(this.account.lowID, 'Brawlers', this.account.Brawlers);
            return {
                'newItem': { type: 1, csvType: 16, ammount: 1, brawler: BrawlerIdDrop },
                'brawlerDrop': true
            }
        }else{
            return {
                'brawlerDrop': false
            }
        }
    }

    generateItems() {
        const newItem = [];
        this.blockB = global.ListAwards.Brawlers.Amount;
        this.blockB.push(...this.excludedIds)
        
        const unlockedBrawlers = this.account.Brawlers.filter(brawler => brawler.unlocked === true && brawler.level < 8 && brawler.points < 1440 && !this.excludedIds.includes(brawler.id));
        this.blockedBrawlers = this.account.Brawlers.filter(brawler => brawler.unlocked === false && !this.blockB.includes(brawler.id));
        this.BrawlerOf9LVL = this.account.Brawlers.filter(brawler => brawler.level >= 8 && !this.excludedIds.includes(brawler.id));
        
        switch (this.box) {
            case 10:{
                const info = this.dropBrawler(this.blockedBrawlers, false, this.blockB, 95)
                if(info.brawlerDrop) newItem.push(info.newItem)
                if (!info.brawlerDrop) {
                    const gold = Math.floor(Math.random() * (55) + 21);
                    newItem.push({ type: 7, ammount: gold })
                    const randomcount = Math.floor(Math.random() * 3)
                    for (let i = 0; i < randomcount; i++) {
                        if (unlockedBrawlers.length > 0) {
                            const randomIndex = Math.floor(Math.random() * unlockedBrawlers.length);
                            const randomBrawlerID = unlockedBrawlers[randomIndex].id;
                            unlockedBrawlers.splice(randomIndex, 1);

                            const targetBrawler = this.account.Brawlers.find(brawler => brawler.id === randomBrawlerID);
                            const brawlerPoints = Math.floor(Math.random() * (55) + 32);
                            targetBrawler.points += brawlerPoints
                            newItem.push({ type: 6, csvType: 16, ammount: brawlerPoints, brawler: randomBrawlerID })
                        }
                    }

                    const dropSPG = this.dropSPG(85)
                    if(dropSPG !== false) newItem.push(dropSPG.newItem);

                    const dropGems = Math.floor(Math.random() * 100)
                    if (dropGems >= 90) newItem.push({ type: 8, ammount: gold / 15 });
                }

                database.replaceValue(this.account.lowID, 'Brawlers', this.account.Brawlers)

                this.items.push(...newItem);
                break;
            }
            case 11: {// mega
                const gold = Math.floor(Math.random() * (480 - 120) + 120);
                newItem.push({ type: 7, ammount: gold })

                const randomcount = Math.floor(Math.random() * 4) + 3;
                for (let i = 0; i < randomcount; i++) {
                    if (unlockedBrawlers.length > 0) {
                        const randomIndex = Math.floor(Math.random() * unlockedBrawlers.length);
                        const randomBrawlerID = unlockedBrawlers[randomIndex].id;
                        unlockedBrawlers.splice(randomIndex, 1);

                        const targetBrawler = this.account.Brawlers.find(brawler => brawler.id === randomBrawlerID);
                        const brawlerPoints = Math.floor(Math.random() * (55) + 144);
                        targetBrawler.points += brawlerPoints
                        newItem.push({ type: 6, csvType: 16, ammount: brawlerPoints, brawler: randomBrawlerID })
                    }
                }

                const dropSPG = this.dropSPG(85)
                if(dropSPG !== false) newItem.push(dropSPG.newItem);

                if(randomcount >= 5){
                    var info = this.dropBrawler(this.blockedBrawlers, false, this.blockB, 0)
                    if(info.brawlerDrop) newItem.push(info.newItem)
                    if(info.brawlerDrop === false){
                        const dropSPG = this.dropSPG(70)
                        if(dropSPG !== false) newItem.push(dropSPG.newItem);
                    }
                }else{
                    const gems = Math.floor(Math.random() * 100)
                    if (gems >= 60) newItem.push({ type: 8, ammount: gold / 15 });
                }

                database.replaceValue(this.account.lowID, 'Brawlers', this.account.Brawlers)

                this.items.push(...newItem);
                break;
            }
            case 12: {  // big
                const gold = Math.floor(Math.random() * (68) + 27);
                newItem.push({ type: 7, ammount: gold })

                const randomcount = Math.floor(Math.random() * 2) + 3;
                for (let i = 0; i < randomcount; i++) {
                    if (unlockedBrawlers.length > 0) {
                        const randomIndex = Math.floor(Math.random() * unlockedBrawlers.length);
                        const randomBrawlerID = unlockedBrawlers[randomIndex].id;
                        unlockedBrawlers.splice(randomIndex, 1);

                        const targetBrawler = this.account.Brawlers.find(brawler => brawler.id === randomBrawlerID);
                        const brawlerPoints = Math.floor(Math.random() * (55) + 65);
                        targetBrawler.points += brawlerPoints
                        newItem.push({ type: 6, csvType: 16, ammount: brawlerPoints, brawler: randomBrawlerID })
                    }
                }

                const info = this.dropBrawler(this.blockedBrawlers, false, this.blockB, 90)
                if(info.brawlerDrop){
                    newItem.push(info.newItem)
                } else{
                    const dropSPG = this.dropSPG(85)
                    if(dropSPG !== false) newItem.push(dropSPG.newItem);
                }

                const gems = Math.floor(Math.random() * 100)
                if (gems >= 80) newItem.push({ type: 8, ammount: gold / 15});

                database.replaceValue(this.account.lowID, 'Brawlers', this.account.Brawlers)

                this.items.push(...newItem);
                break;
            }
                
        }
        return newItem;

    }

    async encode() {
        this.stream.writeVInt(203);
        this.stream.writeVInt(1); 
        this.stream.writeVInt(this.count);

        for (let i = 0; i < this.count; i++) {
            const items = this.generateItems(); // Generation
            this.stream.writeVInt(this.box);
            this.stream.writeVInt(items.length);
            for (const item of items) {
                this.stream.writeVInt(item.ammount);
                this.stream.writeDataReference(item.csvType || 0, item.brawler);

                this.stream.writeVInt(item.type);
                this.stream.writeVInt(0);

                this.stream.writeDataReference(item.type === 4 ? 23 : 0, item.brawler);
                this.stream.writeVInt(0);
                
                if(item.type === 7){this.account.Resources.Gold += item.ammount}
                if(item.type === 8){this.account.Resources.Gems += item.ammount}
            }
        }

        if (this.isClaim){
            this.stream.writeVInt(0);
            this.stream.writeVInt(6);
            this.stream.writeVInt(this.account.TrophyRoadTier+1);
            this.stream.writeVInt(0);
        }else{
            for (let i = 0; i < 13; i++) {
                this.stream.writeVInt(0);
            }
        }
        await database.replaceValue(this.account.lowID, 'Resources', this.account.Resources)
    }
}

module.exports = LogicBoxCommand;