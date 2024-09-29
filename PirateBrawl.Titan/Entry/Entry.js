class Entry {
    PlayerDisplayData(stream, name, playericon, namecolor) {
        this.name = name;
        this.playericon = playericon
        this.namecolor = namecolor
        stream.writeString(this.name);
        stream.writeVInt(100);
        stream.writeVInt(28000000 + this.playericon);
        stream.writeVInt(43000000 + this.namecolor);
    }

    IntValueEntryLogicConfData(stream) {
        stream.writeVInt(6)//Home Events Count
        stream.writeLong(1, 41000000 + global.backgroundID);
        stream.writeLong(3, 3)//Level Required For Unlock Friendly Games
        stream.writeLong(5, 0)//Temporarily Disable Shop
        stream.writeLong(6, 0)// Temporarily Disable Brawl Boxes
        stream.writeLong(14, 0)//Double Token Weekend
        stream.writeLong(15, 0)//Disable Content Creator Boost
    }
    IntValueEntryLogicDailyData(stream,session) {
        stream.writeVInt(3) // Home Events Count
        stream.writeLong(3, session.tokengained)//Disable Content Creator Boost
        stream.writeLong(4, session.trophiesnew)//Disable Content Creator Boost
        stream.writeLong(5, session.bigtoken)//Disable Content Creator Boost
    }
    RelaseEntry(stream) {
        stream.writeVInt(0)
    }
}

module.exports = Entry;
