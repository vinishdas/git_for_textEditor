const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');//dtatbase scheme


//sign up logic 

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already exists',
        signup: 0,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await User.create({ email, password: hashedPassword });

    return res.status(200).json({
      message: 'Signup successful',
      userId: newUser._id,
      signup: 1,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err });
  }
};

exports.login =  async (req,res)=>{
    try{

       const  {email,password} = req.body;
        
       const  user =await  User.findOne({email});
        if(!user) return res.status(404).json({message:"user not found"});
         const checkingPassword = await bcrypt.compare(password,user.password); 
         //comparing request password with db hash password
         if (!checkingPassword) return res.status(401).json({ message: 'Invalid credentials' });
         //invalid password use case 
         const token =jwt.sign({id:user._id},process.env.JWT,{expiresIn:'1hr'}); 
         //issue a json web token , which expires after 1 hour
         res.json({token});

    }catch(err){
        console.log(err)
        return res.status(500).json({error:err})
        //internal server error 
    }

}