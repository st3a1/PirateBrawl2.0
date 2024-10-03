const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const LogicDeliveryNotification = require('./LogicDeliveryNotification');

class LogicViewInboxNotificationCommand extends PiranhaMessage {
    constructor(bytes, session) {
        super(bytes);
        this.session = session;
        this.commandID = 528;
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
        this.index = this.stream.readVInt();
    }

    async process() {
        const account = await database.getAccount(this.session.lowID);
        const findednotif = account.Notification.find(e => e.index === this.index)
        if(findednotif.ID === 94){
            account.Skins.push(findednotif.reward)
            if(findednotif.reward == 59){
                const brawler = account.Brawlers.find(e => e.id == 6)
                if(brawler.unlocked === false){
                    brawler.unlocked = true; 
                    new LogicDeliveryNotification(this.session, findednotif.reward, brawler.id).send()
                    await database.replaceValue(this.session.lowID, 'Brawlers', account.Brawlers)
                }else new LogicDeliveryNotification(this.session, findednotif.reward, undefined, undefined).send()
            }else{
                new LogicDeliveryNotification(this.session, findednotif.reward, undefined, undefined).send()
            }
            await database.replaceValue(this.session.lowID, 'Skins', account.Skins)
        }
        if(findednotif.ID === 89){
            account.Resources.Gems += parseInt(findednotif.reward);
            new LogicDeliveryNotification(this.session, undefined, undefined, parseInt(findednotif.reward)).send()
            await database.replaceValue(this.session.lowID, 'Resources', account.Resources)
        }
        if(findednotif.ID === 84){ // SP donated
            // case 84
            // 23 dataref
        }
        if(findednotif.ID === 90){ // resource donated
            // case 90
        }   // 50 dataref
        if(findednotif.ID === 91){ // tickets donated
            // case 91
        }
        if(findednotif.ID === 92){ // brawler power points donated
            // case 92
        }   // 16 dataref
        if(findednotif.ID === 93){ // brawler donated
            // case 93
        }   // 16 dataref
        findednotif.claim = true;
        await database.replaceValue(this.session.lowID, 'Notification', account.Notification)
    }
}

module.exports = LogicViewInboxNotificationCommand;
