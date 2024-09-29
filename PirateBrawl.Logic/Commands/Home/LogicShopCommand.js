const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

class LogicShopCommand extends PiranhaMessage {
    constructor(session, account, items) {
        super(session);
        this.id = 24111;
        this.session = session;
        this.version = 1;
        this.stream = new ByteStream();
        this.account = account
        this.items = items
    }

    async encode() {
        this.session.Resources = this.account.Resources
        this.stream.writeVInt(203);
        this.stream.writeVInt(0);
        this.stream.writeVInt(1);
        this.stream.writeVInt(100);
        
        this.stream.writeVInt(this.items.length);
        for (const item of this.items) {
            this.stream.writeVInt(item.multiplier);
            if (item.id === 1){
                this.stream.writeVInt(0);
                this.stream.writeVInt(7);//coins

                this.stream.writeVInt(0);
                this.stream.writeVInt(0);
                this.session.Resources.Gold = this.session.Resources.Gold+item.multiplier
            }else if (item.id === 9){
                this.stream.writeVInt(0);
                this.stream.writeVInt(2);//TokensDoubler

                this.stream.writeVInt(0);
                this.stream.writeVInt(0);
                this.session.Resources.TokensDoubler = this.session.Resources.TokensDoubler+item.multiplier

            }else if (item.id === 3){
                this.stream.writeVInt(16);
                this.stream.writeVInt(item.dataRef[1]);

                this.stream.writeVInt(1);
                this.stream.writeVInt(0);

                const targetBrawler = this.account.Brawlers.find(brawler => brawler.id === item.dataRef[1]);
                targetBrawler.unlocked = true

            }else if (item.id === 4){
                this.stream.writeVInt(0);
                this.stream.writeVInt(9);//skins

                this.stream.writeDataReference(29, item.skinID || 0);
                this.stream.writeVInt(0);

                this.account.Skins.push(item.skinID)
            }else if (item.id === 8){
                this.stream.writeVInt(16);//brawler

                this.stream.writeVInt(item.dataRef[1]);
                this.stream.writeVInt(6);
                this.stream.writeVInt(0);

                const targetBrawler = this.account.Brawlers.find(brawler => brawler.id === item.dataRef[1]);
                targetBrawler.points = targetBrawler.points + item.multiplier
            }else if (item.id === 5){
                this.stream.writeVInt(0);
                this.stream.writeVInt(4);
                this.stream.writeVInt(0);
                this.stream.writeDataReference(23, item.dataRef[1]);
                this.stream.writeVInt(0);
                this.account.Skills.push(item.dataRef[1])
            }else if (item.id === 16){
                this.stream.writeVInt(0);
                this.stream.writeVInt(8);//gems

                this.stream.writeVInt(0);
                this.stream.writeVInt(0);
                this.session.Resources.Gems = this.session.Resources.Gems+item.multiplier
            }
            this.stream.writeVInt(0);
        }
        for (let i = 0; i < 13; i++) {
            this.stream.writeVInt(0);
        }
        await Promise.all([
            database.replaceValue(this.account.lowID, 'Resources', this.session.Resources),
            database.replaceValue(this.account.lowID, 'Brawlers', this.account.Brawlers),
            database.replaceValue(this.account.lowID, 'Skills', this.account.Skills),
            database.replaceValue(this.account.lowID, 'Skins', this.account.Skins)
        ]);
    }
}

module.exports = LogicShopCommand;
