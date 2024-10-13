class BitStream {
    constructor(buffer, length) {
        this.buffer = buffer || Buffer.alloc(length);
        this.length = length;
        this._bitOffset = 0;
        this._offset = 0;
    }

    static fromLength(length) {
        return new BitStream(null, length);
    }

    readBit() {
        if (this._offset >= this.buffer.length)
            return 0

        const value = (this.buffer[this._offset] >> this._bitOffset) & 1
        this._bitOffset++

        if (this._bitOffset === 8) {
            this._bitOffset = 0
            this._offset++
        }

        return value
    }

    readBytes(lengthBi) {
        const data = []
        for (let i = 0; i < lengthBi;) {
            let value = 0
            for (let p = 0; p < 8 && i < lengthBi; p++, i++) {
                value |= this.readBit() << p
            }
            data.push(value)
        }

        return Buffer.from(data)
    }

    readInt(bits) {
        return (2 * this.readPositiveInt(1) - 1) * this.readPositiveInt(bits)
    }

    readIntMax1() {
        return this.readInt(1)
    }

    readIntMax3() {
        return this.readInt(2)
    }

    readIntMax7() {
        return this.readInt(3)
    }

    readIntMax15() {
        return this.readInt(4)
    }

    readIntMax31() {
        return this.readInt(5)
    }

    readIntMax63() {
        return this.readInt(6)
    }

    readIntMax127() {
        return this.readInt(7)
    }

    readIntMax255() {
        return this.readInt(8)
    }

    readIntMax511() {
        return this.readInt(9)
    }

    readIntMax1023() {
        return this.readInt(10)
    }

    readIntMax2047() {
        return this.readInt(11)
    }

    readIntMax4095() {
        return this.readInt(12)
    }

    readIntMax16383() {
        return this.readInt(14)
    }

    readIntMax32767() {
        return this.readInt(15)
    }

    readIntMax65535() {
        return this.readInt(16)
    }

    readPositiveInt(bitsCount) {
        const bytes = this.readBytes(bitsCount)
        switch (bytes.length) {
            case 1:
                return bytes[0]
            case 2:
                return bytes.readUInt16LE(0)
            case 3:
                return (bytes[0] << 16) | (bytes[1] << 8) | bytes[2]
            case 4:
                return bytes.readInt32LE(0)
            default:
                return -1
        }
    }

    readPositiveIntMax1() {
        return this.readPositiveInt(1)
    }

    readPositiveIntMax3() {
        return this.readPositiveInt(2)
    }

    readPositiveIntMax7() {
        return this.readPositiveInt(3)
    }

    readPositiveIntMax15() {
        return this.readPositiveInt(4)
    }

    readPositiveIntMax31() {
        return this.readPositiveInt(5)
    }

    readPositiveIntMax63() {
        return this.readPositiveInt(6)
    }

    readPositiveIntMax127() {
        return this.readPositiveInt(7)
    }

    readPositiveIntMax255() {
        return this.readPositiveInt(8)
    }

    readPositiveIntMax511() {
        return this.readPositiveInt(9)
    }

    readPositiveIntMax1023() {
        return this.readPositiveInt(10)
    }

    readPositiveIntMax2047() {
        return this.readPositiveInt(11)
    }

    readPositiveIntMax4095() {
        return this.readPositiveInt(12)
    }

    readPositiveIntMax8191() {
        return this.readPositiveInt(13)
    }

    readPositiveIntMax16383() {
        return this.readPositiveInt(14)
    }

    readPositiveIntMax32767() {
        return this.readPositiveInt(15)
    }

    readBoolean() {
        return this.readPositiveInt(1) === 1
    }

    readPositiveVIntMax255() {
        const v2 = this.readPositiveInt(3) + 1
        return this.readPositiveInt(v2)
    }

    writeBit(data) {
        if (this._bitOffset === 0) {
            this._offset++
            this.writeByte(0xFF)
        }

        let value = this.buffer[this._offset - 1]
        value &= ~(1 << this._bitOffset)
        value |= data << this._bitOffset
        this.buffer[this._offset - 1] = value
        this._bitOffset = (this._bitOffset + 1) % 8
    }

    writeByte(value) {
        this.ensureCapacity(1)
        this._bitOffset = 0
        this.buffer[this._offset - 1] = value
    }

    writeBits(bits, count) {
        let position = 0
        for (let i = 0; i < count;) {
            for (let p = 0; p < 8 && i < count; i++, p++) {
                const value = (bits[position] >> p) & 1
                this.writeBit(value)
            }
            position++
        }
    }

    writeInt(value, bits) {
        if (value <= -1) {
            this.writePositiveInt(0, 1)
            value = -value
        } else {
            this.writePositiveInt(1, 1)
        }
        this.writePositiveInt(value, bits)
    }

    writePositiveInt(value, bits) {
        const bytes = Buffer.alloc(bits)
        bytes.writeUIntBE(value, 0, bits)
        this.writeBits(bytes, bits)
    }

    ensureCapacity(capacity) {
        if (this._offset + capacity > this.buffer.length) {
            const newBuffer = Buffer.alloc(this.buffer.length + capacity)
            this.buffer.copy(newBuffer, 0, 0, this.buffer.length)
            this.buffer = newBuffer
        }
    }

    getByteArray() {
        return this.buffer
    }

    getLength() {
        return Math.max(this.length, this._offset)
    }
}
