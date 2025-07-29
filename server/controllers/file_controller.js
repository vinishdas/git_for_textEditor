const File = require('../models/file.model')
const Version = require('../models/version.model')


exports.getfiles = async (req, res) => {

    try {
        const userid = req.userId;
        if (!userid) {
            return res.status(401).json({ error: 'Unauthorized access: no user ID' });
        }

        const files = await File.find({ ownerId: userid }).sort({ updateAt: -1 })
        return res.status(200).json({
            success: true,
            count: files.length,
            files,
        });

    } catch (err) {
        console.error('Error getting file:', err);
        return res.status(500).json({ Error: err });
    }
}

exports.createfile = async(req,res)=>{
    try{
        const ownerId = req.userId;
        if (!ownerId) {
            return res.status(401).json({ error: 'Unauthorized access: no user ID' });
        }
        const title  = 'untitled'; 
        // const trimedtitle = title?.trim() || 'untitled'
        // const copyExist= await File.findOne({ownerId,title});
        // console.log(copyExist.title)
        // if(copyExist.title!='untitled') return res.status(409).json({copy:"same title used"})
        const createfile = await File.create({title,ownerId,latestVersionId:null,}) 
        await Version.create({})

        console.log("file created " ,createfile.title)
        return res.status(200).json({fileId:createfile._id});
    }catch(err){
        console.log("error detected from serer : ",err)
        return res.status(500).json({err});
    }
}