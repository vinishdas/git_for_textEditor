const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');//dtatbase scheme


//sign up logic 
exports.signup= async (req,res) =>{
    try{

        email,password = req.body;
        const  user= await User.findone({email});
        if(user){
            return res.status(409).json({message : "email already exists ",
                signup:0
            })
            //return if the email already exits in the data base
        }
        else{
            const hashedPassword = await bycrypt.hash(password,8);
            const usersignup = await User.create({email,password:hashedPassword});
            return res.status(200).json({message:"signup sucessful ",userId:usersignup._id,signup:1});
            //return that the sign up was sucessful for the user and can now redirect to login page in frontend

        }
    }catch(err){
            return res.status(500).json({error:err})
            //internal server error
    }
        
}
exports.login =  async (req,res)=>{
    try{

        email,password = req.body;
        
        user = User.findone({email});
        if(!user) return res.status(404).json({message:"user not found"});
         const checkingPassword = await bycrypt.compare(password,user.password); 
         //comparing request password with db hash password
         if (!checkingPassword) return res.status(401).json({ message: 'Invalid credentials' });
         //invalid password use case 
         const token =jwt.sign({id:user._id},process.env.JWT,{expiresIn:'1hr'}); 
         //issue a json web token , which expires after 1 hour
         res.json({token});

    }catch(err){
        return res.status(500).json({error:err})
        //internal server error 
    }

}