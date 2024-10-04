
class ReleaseEntry {
    constructor(instanceId, time) {
        this.dataId = instanceId;
        this.time = time;
    }

    encode(stream) {
        stream.writeDataReference(16, this.dataId);
        stream.writeInt(this.time);
        stream.writeInt(-1);
    }
}

module.exports = ReleaseEntry;