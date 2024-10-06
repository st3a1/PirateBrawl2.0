class FriendEntry {
    constructor() {

    }

    encode(stream) {
        stream.writeLong(0, 1); //acc id

        stream.writeString(null);
        stream.writeString(null);
        stream.writeString(null);
        stream.writeString(null);
        stream.writeString(null);
        stream.writeString(null);

        stream.writeInt(999); // trophies
        stream.writeInt(0); // state
        stream.writeInt(0); // reason
        stream.writeInt(0);
        stream.writeInt(0);

        stream.writeBoolean(false); // Alliance?
        stream.writeString(null);

        stream.writeInt(0); // last online time

        stream.writeBoolean(true);

        //PlayerDisplayData::encode
        stream.writeString("TEST ENTITY");
        stream.writeVInt(100);
        stream.writeVInt(28000000);
        stream.writeVInt(43000000);
        //PlayerDisplayData::encode end
    }
}

module.exports = FriendEntry;