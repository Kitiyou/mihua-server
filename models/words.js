const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wordsSchema = Schema({
  _id: Number,
  creatorId: Schema.Types.ObjectId,
  title: String,
  content: String,
  publishTime: Date,
});
const counterSchema = Schema({
  _id: { type: Number, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('wordsidcounter', counterSchema);

wordsSchema.pre('save', async function(next) {
  let { seq } = await Counter.findOneAndUpdate({}, { $inc: { seq: 1 } }, { new: true, upsert: true });
  this._id = seq;
});

const Words = mongoose.model('words', wordsSchema);

module.exports = Words;
