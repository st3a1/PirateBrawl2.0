const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const deliveryItems = require('./deliveryItems')
const LogicBoxCommand = require('./LogicBoxCommand')

const milestones  = require('../../../GameFiles/milestones');

const LoginFailedMessage = require('../../Messages/Account/LoginFailedMessage')
const fs = require('fs');

class LkPrtctrdMilestone extends PiranhaMessage{
    constructor(bytes, session){
        super(bytes)
        this.session = session;
        this.commandID = 517
        this.version = 0        
        this.stream = new ByteStream(bytes);
    }

    decode(self){
        for (let i of Array(9).keys()){this.stream.readVInt()}   
        this.stream.readVInt()
        this.Brawler = this.stream.readVInt()  
    }

    async process(){
        function GetQuantityFromLevel(AllLevels,AllQuantities,ThisLevel){
            return AllQuantities[AllLevels.indexOf(ThisLevel)]
        }
        const account = await database.getAccount(this.session.lowID)
        this.session.Resources = account.Resources
        const findProgress = milestones.findProgress(account.TrophyRoadTier-1)
        if(findProgress > account.Trophies){
            return new LoginFailedMessage(this.session, `Произошла ошибка 517. Перезайдите в игру`, 1).send();
		}
        this.Level = account.TrophyRoadTier-1
        if (global.ListAwards.Gold.Indexes.includes(this.Level)){
            var Amount = GetQuantityFromLevel(global.ListAwards.Gold.Indexes, global.ListAwards.Gold.Amount, this.Level)
            new deliveryItems(this.session,100,7,Amount,-1,this.Level+1).send()
            this.session.Resources.Gold = this.session.Resources.Gold + Amount
            await database.replaceValue(account.lowID, 'Resources', this.session.Resources)
        }
        if (global.ListAwards.Box.Indexes.includes(this.Level)){
            new LogicBoxCommand(this.session,10,account,1, true).send()
        }
        if (global.ListAwards.BigBox.Indexes.includes(this.Level)){
            new LogicBoxCommand(this.session,12,account,1, true).send()
        }
        if (global.ListAwards.MegaBox.Indexes.includes(this.Level)){
            new LogicBoxCommand(this.session,11,account,1, true).send()
        }
        if (global.ListAwards.TokenDoubler.Indexes.includes(this.Level)){
            var Amount = GetQuantityFromLevel(global.ListAwards.TokenDoubler.Indexes, global.ListAwards.TokenDoubler.Amount, this.Level)
			new deliveryItems(this.session,100,2,Amount,-1,this.Level+1).send()
			this.session.Resources.TokensDoubler = this.session.Resources.TokensDoubler + Amount
			await database.replaceValue(account.lowID, 'Resources', this.session.Resources)
        }
        if (global.ListAwards.PowerPoints.Indexes.includes(this.Level)){
            var Amount = GetQuantityFromLevel(global.ListAwards.PowerPoints.Indexes, global.ListAwards.PowerPoints.Amount, this.Level)
			new deliveryItems(this.session,100,6,Amount,this.Brawler,this.Level+1).send()
			const targetBrawler = account.Brawlers.find(brawler => brawler.id === this.Brawler);
            console.log(targetBrawler)
			if (targetBrawler !== undefined){
				targetBrawler.points = targetBrawler.points + Amount;
				await database.replaceValue(account.lowID, 'Brawlers', account.Brawlers);    
			}
        }
        if (global.ListAwards.Tickets.Indexes.includes(this.Level)){
            var Amount = GetQuantityFromLevel(global.ListAwards.Tickets.Indexes, global.ListAwards.Tickets.Amount, this.Level)
			new deliveryItems(this.session,100,3,Amount,-1,this.Level+1).send()
			this.session.Resources.Tickets = this.session.Resources.Tickets + Amount
			await database.replaceValue(account.lowID, 'Resources', this.session.Resources)
        }
        if (global.ListAwards.toDoNothing.Indexes.includes(this.Level)){
        }
        if (global.ListAwards.Brawlers.Indexes.includes(this.Level)){
            var Character = GetQuantityFromLevel(global.ListAwards.Brawlers.Indexes, global.ListAwards.Brawlers.Amount, this.Level)
			const targetBrawler = account.Brawlers.find(brawler => brawler.id === Character);
			if (!targetBrawler.unlocked){
				targetBrawler.unlocked = true;
				new deliveryItems(this.session,100,1,1,Character,this.Level+1).send()
				await database.replaceValue(account.lowID, 'Brawlers', account.Brawlers)
			}
			else{
				new LogicBoxCommand(this.session,10,account,1, true).send()
			}
        }
        await database.replaceValue(account.lowID, 'TrophyRoadTier', account.TrophyRoadTier + 1)
    }
}
module.exports = LkPrtctrdMilestone