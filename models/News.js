const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    section: {type: String},
    dateofarticle: {type: Date},
    headline: {type: String, required: true, index: true, unique: true },
    summary: {type: String, required: true},
    url: {type: String, required: true, index: true, unique: true},
    created_at: { type: Date, required: true, default: Date.now },
    displayed: {type: Boolean, default: false},
    saved: {type: Boolean, default: false},
    notes: [
        {
          type: Schema.Types.ObjectId,
          ref: "Note"
        }
      ]
});

// This creates our model from the above schema, using mongoose's model method
const News = mongoose.model('News', NewsSchema);

News.createIndexes();

// Export the Article model
module.exports = News;
