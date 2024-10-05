class ChronosTextEntry {
    constructor(text, outOfCsv = false) {
        this.text = text;
        this.outOfCsv = outOfCsv;
    }

    encode(stream) {
        stream.writeInt(this.outOfCsv ? 1 : 0);
        stream.writeStringReference(this.text);
    }
}

module.exports = ChronosTextEntry;