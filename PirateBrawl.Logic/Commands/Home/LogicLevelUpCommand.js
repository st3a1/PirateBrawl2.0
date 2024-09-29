const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const LoginFailedMessage = require('../../Messages/Account/LoginFailedMessage')

class LogicLevelUpCommand extends PiranhaMessage {
    constructor(bytes, session) {
        super(bytes);
        this.session = session;
        this.commandID = 520;
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
        this.stream.readVInt();
        this.brawlerID = this.stream.readVInt();
    }

    async process() {

        function GetQuantityFromLevel(AllLevels, AllQuantities, ThisLevel) {
            return AllQuantities[AllLevels.indexOf(ThisLevel)];
        }

        const account = await database.getAccount(this.session.lowID);

        const targetBrawler = account.Brawlers.find(brawler => brawler.id === this.brawlerID);
        if(targetBrawler.level > 7){
            return new LoginFailedMessage(this.session, `Произошла ошибка 520. Перезайдите в игру или сообщите админу`, 1).send();
        }
        const Amount = GetQuantityFromLevel(
            [0, 1, 2, 3, 4, 5, 6, 7],
            [20, 35, 75, 140, 290, 480, 800, 1250],
            targetBrawler.level
        );
        targetBrawler.level += 1;
        account.Resources.Gold -= Amount;
        await Promise.all([
            database.replaceValue(account.lowID, 'Brawlers', account.Brawlers),
            database.replaceValue(account.lowID, 'Resources', account.Resources)
        ]);
    }
}

module.exports = LogicLevelUpCommand;
