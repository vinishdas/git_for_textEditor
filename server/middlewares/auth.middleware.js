const jwt = require('jsonwebtoken');
module.exports = function (req,res,next){
    const authHeader  = req.headers['authorization'];
    if(!authHeader||!authHeader.startsWith('Bearer')){
        return res.status(401).json({message:"jwt not valid "})
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded  = jwt.verify(token,process.env.JWT);
        req.userId = decoded.id;
        next();
        

    }catch(err){
        return res.status(500).json({error:err});

    }
}