const express = require('express')
const connectDB = require('./config/db')
const dotevn = require('dotenv')
const cors = require('cors')
const AuthRoute  = require('./routes/auth.routes')

dotevn.config()
connectDB(); 
const app = express();
app.use(cors());
app.use(express.json())

//Routes
app.use('/api/auth',AuthRoute) ;
 

const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>console.log(`server started and running on ${PORT}`));
 
