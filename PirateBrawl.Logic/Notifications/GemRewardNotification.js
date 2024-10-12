const BaseNotification = require("./BaseNotification");

class GemRewardNotification extends BaseNotification {
    constructor(isRead, text, gemCount) {
        super(isRead, text);
        this.gemCount = gemCount;
    }

    encode(stream) {
        super.encode(stream);

        stream.writeVInt(1337);
        stream.writeVInt(this.gemCount);
    }

    getNotificationType() {
        return 89;
    }
}

module.exports = GemRewardNotification;