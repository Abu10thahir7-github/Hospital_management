const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role:{
        type:String,
        default:"admin"
    }
})                               

const authModel=mongoose.model("Auth", authSchema)
module.exports=authModel