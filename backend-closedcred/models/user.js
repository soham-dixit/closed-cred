const mongoose=require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/closedcred');
const userSchema=mongoose.Schema({
    Name:String,
    UpiID:String,
    AccountID:String,
    RawID:String,
    RoundUpContractAddress:String
})

const user=mongoose.model("user",userSchema)
module.exports=user;