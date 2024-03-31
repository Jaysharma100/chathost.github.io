const mongoose=require('mongoose');
const chatinfo= new mongoose.Schema({
    
    id_sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    id_reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    message:{
        type:String,
        required:true
    }
},
{
    timestamps:true
}
);

module.exports=mongoose.model('chat',chatinfo);