
class ReleaseEntry {
    constructor(instanceId, time) {
        this.instanceId = instanceId;
        this.time = time;
    }

    encode(stream) {
        stream.writeDataReference(16, this.instanceId);
        stream.writeInt(this.time);
        stream.writeInt(-1);
    }
}

module.exports = ReleaseEntry;