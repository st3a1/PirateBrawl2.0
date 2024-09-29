const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const Shop = require('../../../PirateBrawl.Server/Utils/Shop');
const LogicBoxCommand = require('./LogicBoxCommand');
const LogicShopCommand = require('./LogicShopCommand');
const LoginFailedMessage = require('../../Messages//Account/LoginFailedMessage');
const myShop = new Shop();

class LogicPurchaseOfferCommand extends PiranhaMessage {
    constructor(bytes, session) {
        super(bytes);
        this.session = session;
        this.commandID = 519;
        this.version = 0;
        this.stream = new ByteStream(bytes);
    }

    decode() {
        this.stream.readVInt();
        this.stream.readVInt();
        this.stream.readVInt();
        this.stream.readVInt();
        this.stream.readVInt();
        this.stream.readVInt();
        this.stream.readVInt();
        this.stream.readVInt();
        this.stream.readVInt();
        this.offerID = this.stream.readVInt();
    }

    async process() {
        const account = await database.getAccount(this.session.lowID) 
        const foundOffer = myShop.findItemByIndex(this.offerID, account.Shop);

        if (!foundOffer.claim){
            const includesArray = foundOffer.includes;
            var cost = foundOffer.cost;
            const { Gems, Gold, Starpoints } = account.Resources;
            switch (foundOffer.type) {
                case 0:
                    if (Gems >= cost) account.Resources.Gems -= cost;
                    break;
                case 1:
                    if (Gold >= cost) account.Resources.Gold -= cost;
                    break;
                case 2:
                    if (Starpoints >= cost) account.Resources.Starpoints -= cost;
                    break;
                default:
                    return new LoginFailedMessage(this.session, `Произошла ошибка 519. Перезайдите в игру`, 1).send();
            }

            if (includesArray.find(item => item.id === 6)) {
                new LogicBoxCommand(this.session,10,account,includesArray[0].multiplier).send()
            }else if (includesArray.find(item => item.id === 10)){
                new LogicBoxCommand(this.session,11,account,includesArray[0].multiplier).send()
            }else if (includesArray.find(item => item.id === 14)){
                new LogicBoxCommand(this.session,12,account,includesArray[0].multiplier).send()
            }else{
                new LogicShopCommand(this.session,account,includesArray).send()
            }
            foundOffer.claim = true

            await database.replaceValue(account.lowID, 'Shop', account.Shop);
        }
    }
}

module.exports = LogicPurchaseOfferCommand;
