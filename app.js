require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//My Routes
const authRoutes = require("./routes/authenticate");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

//PORT
const PORT = process.env.PORT || 8000;

//DB Connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED");
}).catch((err)=>{
    console.log(err);
});

//MIDDLEWARES
// app.use(bodyParser.json()); //depricated
app.use(express.json()); 
app.use(cookieParser());
app.use(cors());

//ROUTES
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);

app.get('/',(req,res)=>{
    res.send("welcome to home page");
})


//Starting the Server
app.listen(PORT,()=>{
    console.log(`server started at port at port: ${PORT}`);
})