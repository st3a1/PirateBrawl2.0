class BaseNotification {
    constructor(isRead, text) {
        this.isRead = isRead;
        this.text = text;
    }

    encode(stream) {
        stream.writeInt(1);
        stream.writeBoolean(this.isRead);
        stream.writeInt(new Date().getSeconds());
        stream.writeString(this.text);
    }

    getNotificationType() {
        return -1;
    }
}

module.exports = BaseNotification;