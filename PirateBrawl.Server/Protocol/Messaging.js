class Messaging {
    constructor(session) {
        this.session = session;
    }

    send(sessionId) {
        if (this.id < 20000) return;
        this.processSending(sessionId);
    }

    sendLowID(sessionId) {
        if (this.id < 20000) return;
        this.processSending(sessionId);
    }

    processSending(sessionId) {
        this.encode();
        const session = sessionId ? Array.from(global.sessions.values()).find(session => session.lowID === sessionId) : this.session;
        if (!session) return;
        const header = this.generateHeader(this.id, this.stream.buffer.length, this.version);
        
        const dataWithSession = Buffer.concat([header, this.stream.buffer, Buffer.from([0xFF, 0xFF, 0x0, 0x0, 0x0, 0x0, 0x0])]);
        session.write(dataWithSession);
        if(this.id !== 24109){
            session.log(`Packet ${this.id} (${this.constructor.name}) sent`);
        }
    }

    generateHeader(id, length, version) {
        const header = Buffer.alloc(7);
        header.writeUInt16BE(id, 0);
        header.writeUIntBE(length, 2, 3);
        header.writeUInt16BE(version, 5);
        return header;
    }
}

module.exports = Messaging;
