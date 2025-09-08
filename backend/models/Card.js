const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  imagePath: { type: String, required: true },
  audioPath: { type: String, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);
