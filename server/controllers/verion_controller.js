const File = require('../models/file.model')
const Version = require('../models/version.model')
exports.getLatestVersion= async(req,res)=>{
    try{
            const {userId} = req.userId;

            const { fileId } = req.params;
            const file = await File.findById({fileId});
             if (!file) return res.status(404).json({ error: 'File not found' });
              if (file.ownerId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' })
    }
    const version = await Version.findById(file.latestVersionId)



    }catch(err){
        console.log('could not get the lastes version ',err);

    }
} 