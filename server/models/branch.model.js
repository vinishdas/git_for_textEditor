const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const branchSchema = new Schema(
  {
    fileId: { type: Types.ObjectId, ref: 'file', required: true },
    name: { type: String, required: true }, // e.g. "main", "feature-x"
    headVersionId: { type: Types.ObjectId, ref: 'version', default: null }, // latest commit
    parentBranchId: { type: Types.ObjectId, ref: 'branch', default: null }, // for forked branches
  },
  { timestamps: true }
);

module.exports = mongoose.model('branch', branchSchema);
