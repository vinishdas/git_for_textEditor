
  const Chunk  = require('../models/chunk.model')
const mongoose = require('mongoose');

exports.getRenderedHtml = async (hashList) => {
  if (!Array.isArray(hashList) || hashList.length === 0) {
    throw new Error('Invalid or empty hash list provided');
  }

  // Filter only valid ObjectId strings
  console.log("get rendedHtlm : ",hashList)
 const validHashes = hashList; // just use the hashes as-is


  if (validHashes.length === 0) {
    throw new Error('No valid ObjectIds found in hash list');
  }

  try {
    const chunks = await Chunk.find({ _id: { $in: validHashes } }).lean();
    const chunkMap = new Map(chunks.map(chunk => [chunk._id.toString(), chunk.content]));
    const missingChunks = [];

    const html = hashList.map(hash => {
      const content = chunkMap.get(hash);
      if (!content) missingChunks.push(hash);
      return content || '';
    }).join('');

    if (missingChunks.length > 0) {
      console.warn(`Missing chunks while rendering:`, missingChunks);
    }

    return html;

  } catch (err) {
    console.log("error generating html", err);
    throw new Error("failed to generate html from chunk hashes");
  }
};
