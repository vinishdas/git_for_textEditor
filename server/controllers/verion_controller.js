const File = require('../models/file.model');
const Version = require('../models/version.model');
const { getRenderedHtml } = require('../services/hashloader');
const Chunk = require('../models/chunk.model')
const Branch = require('../models/branch.model')
const { changeLastestVersion } = require('../controllers/file_controller')

exports.getLatestVersion = async (req, res) => {
  try {
    const userId = req.userId;
    const { fileId, branchId } = req.params;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });

    if (file.ownerId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const branch = await Branch.findOne({ _id: branchId, fileId });
     
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found for this file' });
    }

    const branches = await Branch.find({ fileId }).select("name _id");
    const branchList = branches.map(b => ({ id: b._id, name: b.name }));

    const version = await Version.findById(branch.headVersionId);
    if (!version) return res.status(404).json({ error: 'Version file does not exist' });

    if (version.chunkHashes.length === 0) {
      //   console.log('[No Chunks]', version._id, version.tag);
      return res.status(200).json({
        title: file.title,
        versionId: version._id,
        tag: version.tag,
        chunklist: null,
        content: null,
        branchName: branch.name,
         branchList:branchList
      });
    }

    const contentHtml = await getRenderedHtml(version.chunkHashes);
    if (!contentHtml) {
      return res.status(404).json({ error: 'Could not find content for hash code' });
    }

    return res.status(200).json({
      versionId: version._id,
      title: file.title,
      tag: version.tag,
      chunklist: version.chunkHashes,
      content: contentHtml,
      branchName: branch.name,
       branchList
    });
  } catch (err) {
    console.error('Could not get the latest version', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.createchunk = async (req, res) => {
  try {

    // const chunkhash = req.chunk;
    // const content = req.content;
    const { chunkHash, content } = req.body;
    console.log("Entered chunk aread  ", chunkHash, content)
    // if(!(userId && ParentVersion && tag && fileId && newchunkHashes)) return res.status(200).json({"not good request"})
    if (!(chunkHash && content)) return res.status(200).json({ Error: "not good request" })

    const ChunkExists = await Chunk.findById(chunkHash);
    if (!ChunkExists) await Chunk.create({ _id: chunkHash, content })
    return res.status(200).json({ message: "chunk created" });
  } catch (err) {
    console.log("could not create chunk ", err);
    return res.status(400).json({ Error: "failed to create chunk due to error in server" })
  }

}
exports.createversion = async (req, res) => {
  try {
    const userId = req.userId; // Make sure your auth middleware sets this
    const {
      branchId,
      versionId: parentVersionId,
      updatedTag: tag,
      fileId,
      newchunkHashes: chunkHashes,
    } = req.body;
    console.log("chunk hash ", chunkHashes);

    if (!(userId && parentVersionId && tag && fileId && chunkHashes)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const createdVersion = await Version.create({
      fileId,
      branchId,
      parentVersionId,
      chunkHashes,
      tag,
    });


    if (!createdVersion) {
      return res.status(400).json({ error: "Failed to create version document" });
    }
    await Branch.updateOne(
      { _id: branchId },
      { $set: { headVersionId: createdVersion._id }, $currentDate: { updatedAt: true } }
    );

    // await changeLastestVersion(fileId, userId,createdVersion._id);  

    return res.status(200).json({ message: "Created version successfully" });
  } catch (err) {
    console.error("Failed to create version:", err);
    return res.status(500).json({ error: "Server error while creating version" });
  }
};

exports.createBranch = async (req, res) => {
  try {
    const userId = req.userId;
    const { fileId, parentBranchId, startFromVersionId, branchName, tag, newchunkHashes } = req.body;

    if (!(userId && fileId && branchName && startFromVersionId && tag && newchunkHashes)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const newBranch = await Branch.create({
      fileId,
      name: branchName,
      parentBranchId: parentBranchId || null,
      headVersionId: null
    });
    // Step 1: create the new version (branch's first commit)
    const createdVersion = await Version.create({
      fileId,
      branchId: newBranch._id,
      parentVersionId: startFromVersionId,
      chunkHashes: newchunkHashes,
      tag
    });
    newBranch.headVersionId = createdVersion._id;
    await newBranch.save();

    if (!createdVersion) {
      return res.status(400).json({ error: "Failed to create version for branch" });
    }

    // Step 2: create the new branch pointing to this version

    return res.status(200).json({
      message: "Branch created with initial version",
      branchId: newBranch._id,
      headVersionId: createdVersion._id
    });

  } catch (err) {
    console.error("Failed to create branch:", err);
    return res.status(500).json({ error: "Server error while creating branch" });
  }
};
