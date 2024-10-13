// это переписанный код с сервака данинула, то ли нуллс то ли меджик я хз честн, я прост нашел какой то высер ха
const sodium = require('libsodium-wrappers')

class Sodium {
  constructor() {
    if (!Sodium.instance) {
      Sodium.instance = this
    }
    return Sodium.instance
  }

  genericHash(input) {
    return sodium.crypto_generichash(32, input)
  }

  openPublicBox(ciphertext, nonce, publicKey, secretKey) {
    return sodium.crypto_box_open_easy(ciphertext, nonce, publicKey, secretKey)
  }

  createPublicBox(message, nonce, publicKey, secretKey) {
    return sodium.crypto_box_easy(message, nonce, publicKey, secretKey)
  }

  openBox(ciphertext, nonce, sharedKey) {
    return sodium.crypto_secretbox_open_easy(ciphertext, nonce, sharedKey)
  }

  createBox(message, nonce, sharedKey) {
    return sodium.crypto_secretbox_easy(message, nonce, sharedKey)
  }

  incr2x(nonce) {
    sodium.increment(nonce)
  }
}

class Crypt {
  constructor() {
    this.sodiumInstance = new Sodium()
    this.clientKey = null
    this.sharedKey = null
    this.decryptNonce = null
    this.encryptNonce = this.sodiumInstance.genericHash(Buffer.from("hashedpass"))
  }

  static parseHexBinary(hex) {
    return Buffer.from(hex, 'hex')
  }

  static sk = Crypt.parseHexBinary(config.sk)
  static pk = Crypt.parseHexBinary(config.pk)

  async decrypt(packet, id) {
    if (id === 10100) {
      return packet
    }
    if (id === 10101) {
      this.clientKey = packet.slice(0, 32)
      this.sharedKey = packet.slice(0, 32)

      const nonce = this.sodiumInstance.genericHash(Buffer.concat([this.clientKey, Crypt.pk]))
      const cipherText = packet.slice(this.clientKey.length)

      const message = this.sodiumInstance.openPublicBox(cipherText, nonce, this.clientKey, Crypt.sk)

      this.decryptNonce = message.slice(24, 48)
      return message.slice(48)
    }

    this.sodiumInstance.incr2x(this.decryptNonce)
    return this.sodiumInstance.openBox(packet, this.decryptNonce, this.sharedKey)
  }

  async encrypt(packet, id) {
    if (id === 20100 || (id === 20103 && !this.clientKey)) {
      return packet
    }

    if (id === 20103 || id === 20104) {
      const nonce = this.sodiumInstance.genericHash(Buffer.concat([this.decryptNonce, this.clientKey, Crypt.pk]))
      const message = Buffer.concat([this.encryptNonce, this.sharedKey, packet])

      const cipherText = this.sodiumInstance.createPublicBox(message, nonce, this.clientKey, Crypt.sk)
      return cipherText
    }

    this.sodiumInstance.incr2x(this.encryptNonce)
    return this.sodiumInstance.createBox(packet, this.encryptNonce, this.sharedKey)
  }
}

module.exports = {
    Crypt, 
    Sodium
}