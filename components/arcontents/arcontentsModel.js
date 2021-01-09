const mongoose = require('mongoose');

const ArContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: Array },
    description: { type: String, default: '' },
    username: { type: String, default: '' },
    projectDir: { type: String, default: '' },
    priority: { type: Number, default: 100 },
    thumbnail: { type: String, required: true },
    passcode: { type: String },
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    marker: { type: String },
    backsound: { type: String },
    slug: String,
    dataApkArr: { type: Array },
    commerceData: {
        commerce_title: { type: String },
        commerce_description: { type: String },
        commerce_thumbnail: { type: String },
        commerce_buttons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ButtonCommerce',
            autopopulate: {
                select: 'iconUrl redirectUrl -_id' // remove listed fields from selection
            },
        }]
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: '' }
})

ArContentSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model("ArContent", ArContentSchema);
