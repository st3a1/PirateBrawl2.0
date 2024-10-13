const nacl = require("tweetnacl")
const blake2b = require("blake2")
const crypto = require("crypto")
const config = require("config")

function recv(num) { // TODO
    return new Promise((resolve, reject) => {
        let data = Buffer.alloc(0)
        const ReceiveData = () => {
            this.session.once("data", (packet) => {
                if (!packet || packet.length === 0) {
                    return resolve(Buffer.alloc(0))
                }

                data = Buffer.concat([data, packet])

                if (data.length < num) {
                    receiveData()
                }else{
                    resolve(data)
                }
            })

            this.session.once("error", (error) => {
                reject(error)
            })
        }
        ReceiveData()
    })
}

class Nonce {
    constructor(nonce = null, clientKey = null, serverKey = null) {
        if (!clientKey) {
            this._nonce = nonce ? nonce : crypto.randomBytes(24)
        }else{
            const b2 = blake2b.createHash("blake2b", {digestLength: 24})
            if (nonce) {
                b2.update(nonce)
            }
            b2.update(clientKey)
            b2.update(serverKey)
            this._nonce = b2.digest()
        }
    }

    toBytes() {
        return this._nonce
    }

    increment() {
        const nonceInt = BigInt("0x" + this._nonce.toString("hex")) + 2n
        this._nonce = Buffer.from(nonceInt.toString(16).padStart(48, '0'), "hex")
    }
}

class Crypto {
    constructor() {
        this.serverPrivateKey = Buffer.from(config.cryptoKey, "hex")
        this.serverPublicKey = Buffer.alloc(32)
        this.clientPublicKey = null
        this.sessionKey = null
        this.sharedEncryptionKey = crypto.randomBytes(32)
        this.decryptNonce = null
        this.encryptNonce = new Nonce(crypto.randomBytes(24))
        this.nonce = null
        this.s = Buffer.alloc(32)
    }

    decryptClient(packetId, payload) {
        if (packetId === 10100) {
            return payload
        } else if (packetId === 10101) {
            this.clientPublicKey = payload.slice(0, 32)
            payload = payload.slice(32)

            nacl.scalarMult.base(this.serverPublicKey, this.serverPrivateKey);

            this.nonce = new Nonce(null, this.clientPublicKey, this.serverPublicKey) // nonce gen.

            this.s = nacl.scalarMult(this.serverPrivateKey, this.clientPublicKey)

            payload = Buffer.concat([Buffer.alloc(16), payload])
            const decrypted = nacl.secretbox.open(payload, this.nonce.toBytes(), this.s)

            if (!decrypted) throw new Error("decrypt error")

            this.decryptNonce = new Nonce(decrypted.slice(24, 48))
            return decrypted.slice(48)
        } else if (!this.decryptNonce) {
            return payload
        } else {
            this.decryptNonce.increment()
            payload = Buffer.concat([Buffer.alloc(16), payload])
            const decrypted = nacl.secretbox.open(payload, this.decryptNonce.toBytes(), this.sharedEncryptionKey)

            if (!decrypted) throw new Error("decrypr error")

            return decrypted.slice(32)
        }
    }

    encryptServer(packetId, payload) {
        if (packetId === 20100 || packetId === 20103) {
            return payload;
        } else if (packetId === 20104) {
            const nonce = new Nonce(this.decryptNonce.toBytes(), this.clientPublicKey, this.serverPublicKey)
            payload = Buffer.concat([this.encryptNonce.toBytes(), this.sharedEncryptionKey, payload])
            payload = Buffer.concat([Buffer.alloc(32), payload])

            const encrypted = nacl.secretbox(payload, nonce.toBytes(), this.s)
            return encrypted.slice(16)
        } else {
            this.encryptNonce.increment()
            payload = Buffer.concat([Buffer.alloc(32), payload])

            const encrypted = nacl.secretbox(payload, this.encryptNonce.toBytes(), this.sharedEncryptionKey)
            return encrypted.slice(16)
        }
    }
}

module.exports = { 
    Nonce,
    Crypto,
    recv
 }
