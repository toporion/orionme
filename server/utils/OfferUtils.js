const Offer = require("../models/OfferModel");
const UserModel = require("../models/UserModel");

/**
 * Checks and removes expired tokens for users if the offer has ended.
 */
const clearExpiredTokens = async () => {
    // Find the active offer
    const activeOffer = await Offer.findOne({ isActive: true });

    if (!activeOffer) {
        // No active offer: Clear all tokens
        await UserModel.updateMany(
            { token: { $ne: null } },
            { $set: { token: null, discount: null } }
        );
    } else {
        // Check if the offer has expired
        const now = new Date();
        if (now > new Date(activeOffer.endDate)) {
            // Offer has expired: Clear all tokens
            await Offer.updateOne({ _id: activeOffer._id }, { isActive: false });
            await UserModel.updateMany(
                { token: { $ne: null } },
                { $set: { token: null, discount: null } }
            );
        }
    }
};

/**
 * Automatically expires offers if their endDate has passed.
 */
const expireOffers = async () => {
    const now = new Date();

    try {
        const result = await Offer.updateMany(
            { endDate: { $lt: now }, isActive: true },
            { $set: { isActive: false } }
        );
        console.log(`${result.modifiedCount} offers expired.`);
    } catch (error) {
        console.error("Error expiring offers:", error.message);
    }
};

module.exports = { clearExpiredTokens, expireOffers };
