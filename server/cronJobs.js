const cron = require("node-cron");
const { expireOffers } = require("./utils/OfferUtils");

/**
 * Schedule a cron job to expire offers automatically every day at midnight.
 */
const scheduleJobs = () => {
    // Runs daily at midnight (00:00)
    cron.schedule("0 0 * * *", async () => {
        await expireOffers();
    });

    // Log a simple confirmation message
    console.log("Cron job for offer expiration set up!");
};

module.exports = { scheduleJobs };
