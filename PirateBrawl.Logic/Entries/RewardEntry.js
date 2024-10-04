class RewardEntry {
    constructor(trophies, trophies2, reward, trophiesAfter, flag) {
        this.trophies = trophies;
        this.trophies2 = trophies2;
        this.reward = reward;
        this.trophiesAfter = trophiesAfter;
        this.flag = flag;
    }

    encode(stream) {
        stream.writeVInt(this.trophies);
        stream.writeVInt(this.trophies2);
        stream.writeVInt(this.reward);
        stream.writeVInt(this.trophiesAfter);
        stream.writeVInt(0);
        stream.writeBoolean(this.flag);
    }
}

module.exports = RewardEntry;