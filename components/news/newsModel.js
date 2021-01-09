const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: '' }
})

module.exports = mongoose.model("news", NewsSchema);
