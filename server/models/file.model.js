const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const fileSchema = new Schema(
  {
    ownerId: {
      type: Types.ObjectId,
      ref: 'user', // referenced model is 'user'
      required: true
    },
    title: {
      type: String,
      required: true
    },
    // latestVersionId: {
    //   type: Types.ObjectId,
    //   ref: 'version',
    //   default: null// optional cache, can be null initially
    // }
  },
  {
    timestamps: true // auto-generates createdAt and updatedAt
  }
);

module.exports = mongoose.model('file', fileSchema);
