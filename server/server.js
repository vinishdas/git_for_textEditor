const express = require('express')
const connectDB = require('./config/db')
const dotevn = require('dotenv')
// dotevn.config({ path: path.resolve(__dirname, '.env') });
const cors = require('cors')
const AuthRoute  = require('./routes/auth.routes')
const FileRoute = require('./routes/file.routes')
const versionRoute = require('./routes/version.routes')
dotevn.config()
connectDB(); 
const app = express();
app.use(cors());
app.use(express.json())

//Routes
app.use('/api/auth',AuthRoute) ;
app.use('/api/FileRoute',FileRoute);
app.use('/api/versionRoute',versionRoute);
 
module.exports = app;

const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>console.log(`server started and running on ${PORT}`));
 
