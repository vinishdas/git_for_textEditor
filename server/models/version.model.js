const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const versionSchema = new Schema(
  {
    fileId: {
      type: Types.ObjectId,
      ref: 'file',
      required: true
    },
    parentVersionId: {
      type: Types.ObjectId,
      ref: 'version',
      default: null // for first commit
    },
    chunkHashes: {
      type: [String], // ordered list of chunk hash IDs
      default:null
    },
    tag: {
      type: String,
      default: null // optional label like 'v1.0', 'draft'
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('version', versionSchema);
