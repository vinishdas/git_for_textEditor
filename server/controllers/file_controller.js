const File = require('../models/file.model')
const Version = require('../models/version.model')
const Branch = require('../models/branch.model');



exports.getfiles = async (req, res) => {
  try {
    const userid = req.userId;
    if (!userid) {
      return res.status(401).json({ success: false, error: 'Unauthorized: no user ID' });
    }

    const files = await File.find({ ownerId: userid })
      .sort({ updatedAt: -1 })
      .lean();

    const enrichedFiles = await Promise.all(
      files.map(async (file) => {
        // find the most recently updated branch for this file
        const branch = await Branch.findOne({ fileId: file._id })
          .sort({ updatedAt: -1 }) // ✅ latest worked branch
          .lean();

        return {
          fileid: file._id,
          title: file.title,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
          branchId: branch ? branch._id : null,
          latestVersionId: branch ? branch.headVersionId : null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: enrichedFiles.length,
      files: enrichedFiles,
    });
  } catch (err) {
    console.error('Error getting file:', err);
    return res.status(500).json({ success: false, error: 'Server error fetching files' });
  }
};


exports.createfile = async (req, res) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return res.status(401).json({ error: 'Unauthorized access: no user ID' });
    }
    const title = req.body?.title || 'untitled';

    // const trimedtitle = title?.trim() || 'untitled'
    // const copyExist= await File.findOne({ownerId,title});
    // console.log(copyExist.title)
    // if(copyExist.title!='untitled') return res.status(409).json({copy:"same title used"})
    const createfile = await File.create({ title, ownerId })
    const mainBranch = await Branch.create({ fileId: createfile._id, name: "main" });
    const initialVersion = await Version.create({
      fileId: createfile._id,
      branchId: mainBranch._id,
      parentVersionId: null,
      tag: "Version: #0"
    });
    // const VersionfileCreated = await Version.create({ fileId: createfile._id, tag: "Version: #0" })

      await Branch.updateOne(
      { _id: mainBranch._id },
      { $set: { headVersionId: initialVersion._id } }
    );
     
    console.log("file created ", createfile.title)
    return res.status(200).json({ fileId: createfile._id, branchId: mainBranch._id });


  } catch (err) {
    console.log("error detected from serer : ", err)
    return res.status(500).json({ err });
  }
}
exports.changeLastestVersion = async (branchId, userId, createdVersion) => {
  try {
    const updated = await Branch.updateOne(
      { _id: branchId, ownerId: userId },
      { $set: {headVersionId : createdVersion } }
    );

    if (updated.modifiedCount === 0) {
      console.log("No file document was updated — check fileId or userId.");
    } else {
      console.log("Latest version updated successfully.");
    }
  } catch (err) {
    console.log("Failed to change latest version", err);
  }
}

exports.changetitle = async (req, res) => {
  const userId = req.userId;
  const { title, fileId } = req.body;

  try {
    const result = await File.updateOne(
      { _id: fileId, ownerId: userId },
      { $set: { title } }
    );

    if (result.matchedCount === 0) {
      console.log("No file found to update");
      return res.status(404).json({ error: "File not found or doesn't belong to user" });
    }

    return res.status(200).json({ message: "File title updated" });

  } catch (err) {
    console.error("Title change failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
