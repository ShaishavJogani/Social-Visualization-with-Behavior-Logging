const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, required: true },
    TimeStamp:  { type: Date, default: Date.now },
    log_event: {type: String},
    page_url: {type:String},
    previous_url: {type:String},
    parameters: {type: Object},
    tags: {type: Array}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('dataAnalysis', schema);
