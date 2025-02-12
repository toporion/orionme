const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const tokenSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    tokenCode: { type: String, unique: true, required: true },
    discount: { type: Number, required: true }, // e.g., 10, 15%
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true } // Matches the offer's endDate
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
