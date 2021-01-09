const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
    status: {
        type: String,
        required: true,
    }
})

StatusSchema.plugin(timestamps)

module.exports = mongoose.model("status", StatusSchema);
