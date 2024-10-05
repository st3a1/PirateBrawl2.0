class LogicOfferBundle {
    constructor(
        gemOffers, 
        currency,
        offerPrice,
        endTime,
        isPurchased,
        isInDailyOffers,
        chronosText,
        isNew,
        backgroundTheme
    ) {
        this.gemOffers = gemOffers;
        this.currency = currency;
        this.offerPrice = offerPrice;
        this.endTime = endTime;
        this.isPurchased = isPurchased;
        this.isInDailyOffers = isInDailyOffers;
        this.chronosText = chronosText;
        this.isNew = isNew;
        this.backgroundTheme = backgroundTheme;
    }

    encode(stream) {
        stream.writeVInt(this.gemOffers.length);
        for (const offer of this.gemOffers) {
            offer.encode(stream);
        }

        stream.writeVInt(this.currency);
        stream.writeVInt(this.offerPrice);
        stream.writeVInt(this.endTime);

        stream.writeVInt(0); // idk
        stream.writeVInt(0); // idk
        stream.writeBoolean(this.isPurchased); // Purchased?
        stream.writeVInt(0);
        stream.writeBoolean(this.isInDailyOffers); // Is In Daily Offers
        stream.writeVInt(0);
        this.chronosText.encode(stream);
        stream.writeBoolean(this.isNew); // New ?
        stream.writeString(this.backgroundTheme); // Background Theme
    }
}

module.exports = LogicOfferBundle;