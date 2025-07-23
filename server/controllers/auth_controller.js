const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user.model');

exports.signup= async (req,res) =>{
    try{

        email,password = req.body;
        const  userfound= await user.findone({email});
        if(userfound){
            return res.status(409).json({message : "email already exists ",
                signup:0
            })
        }
        else{
            const hashedPassword = await bycrypt.hash(password,8);
            const usersignup = await user.create({email,password:hashedPassword});
            return res.status(200).json({message:"signup sucessful ",userId:usersignup._id,signup:1});
            
        }
    }catch(err){
            return res.status(500).json({error:err})
    }
        
}
exports.login =  async (req,res)=>{
    try{

        email,password = req.body;
        
        finduser = user.findone({email});
        if(!finduser) return res.status(404).json({message:"user not found"});
         const checkingPassword = await bycrypt.compare(password,finduser.password); 
         if (!checkingPassword) return res.status(401).json({ message: 'Invalid credentials' });
         const token =jwt.sign({id:finduser._id},process.env.JWT_SECRET,{expiresIn:'1hr'});
         res.json({token});

    }catch(err){
        return res.status(500).json({error:err})
    }

}