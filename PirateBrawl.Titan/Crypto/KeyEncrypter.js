const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

class KeyEncrypter {
    constructor(key, nonce) {
        this.key = key;
        this.nonce = nonce;
    }

    decrypt(input, output) {
        this.nextNonce(this.nonce);

        try {
            const decrypted = nacl.secretbox.open(input, this.nonce, this.key);
            if (!decrypted) {
                throw new Error('Invalid Cipher Text');
            }
            decrypted.copy(output, 0, 0, decrypted.length);
        } catch (error) {
            return -1;
        }
        return 0;
    }

    encrypt(input, output) {
        this.nextNonce(this.nonce);

        const encrypted = nacl.secretbox(input, this.nonce, this.key);
        encrypted.copy(output, 0, 0, encrypted.length);

        return 0;
    }

    nextNonce(nonce) {
        const timesToIncrease = 3;
        for (let j = 0; j < timesToIncrease; j++) {
            let c = 1;
            for (let i = 0; i < nonce.length; i++) {
                c += nonce[i];
                nonce[i] = c & 0xff;
                c >>= 8;
            }
        }
    }

    getEncryptionOverhead() {
        return 16;
    }
}

module.exports = {
    KeyEncrypter,
    decrypt,
    encrypt,
    nextNonce
    }
