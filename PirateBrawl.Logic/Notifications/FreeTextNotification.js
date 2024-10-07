const BaseNotification = require("./BaseNotification");

class FreeTextNotification extends BaseNotification {
    constructor(isRead, text) {
        super(isRead, text);
    }

    encode(stream) {
        super.encode(stream);
        stream.writeVInt(1);
    }

    getNotificationType() {
        return 81;
    }
}

module.exports = FreeTextNotification;