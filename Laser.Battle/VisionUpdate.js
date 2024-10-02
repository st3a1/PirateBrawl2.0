const ByteStream = require('../Utils/ByteStream');

class VisionUpdate {
    constructor() {
        this.stream = null;
        this.Tick = 0;
        this.InputCounter = 0;
    }

    encode() {
        this.stream.writeVInt(this.Tick);
        this.stream.writeVInt(this.InputCounter);
        this.stream.writeVInt(0);
        this.stream.writeVInt(this.Tick);

        this.stream.writeBytes(this.stream.getBuff(), this.stream.getOffset());
    }
}

module.exports = VisionUpdate;
