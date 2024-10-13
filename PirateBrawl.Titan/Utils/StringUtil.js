class StringUtil {
    static hexToBytes(hex) {
        hex = hex.replace(/\s+/g, '').replace(/-/g, '');
        const bytes = [];

        for (let i = 0; i < hex.length; i += 2) {
            const byteString = hex.substr(i, 2);
            const byte = parseInt(byteString, 16);
            bytes.push(byte);
        }

        return Buffer.from(bytes);
    }
}