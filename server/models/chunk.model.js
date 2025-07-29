const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const chunkSchema = new Schema(
  {
    _id: {
      type: String, // SHA-256 or any hash string
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

module.exports = mongoose.model('chunk', chunkSchema);
