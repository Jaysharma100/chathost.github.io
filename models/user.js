const mongoose=require('mongoose');
const user= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    onlineinfo:{
        type:String,
        default:'0'
    }
},
{
    timestamps:true
}
);

module.exports=mongoose.model('user',user);