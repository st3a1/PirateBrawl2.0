const GlobalID = require('../Data/GlobalID');

class LogicGemOffer {
    constructor(type, count, itemGlobalId = 0, skinId = 0) {
        this.type = type;
        this.count = count;
        this.itemGlobalId = itemGlobalId;
        this.skinId = skinId;
    }

    encode(stream) {
        stream.writeVInt(this.type) // type
        stream.writeVInt(this.count) // count
        stream.writeDataReference(GlobalID.getClassId(this.itemGlobalId), GlobalID.getInstanceId(this.itemGlobalId)) // item global id
        stream.writeVInt(this.skinId); // skin global id
    }
}

module.exports = LogicGemOffer;