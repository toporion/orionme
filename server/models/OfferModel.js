const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    name: { type: String, required: true }, // e.g., "Signup Bonus Offer"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    discountRange: { type: [Number], required: true }, // e.g., [10, 20]
    isActive: { type: Boolean, default: true }
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
