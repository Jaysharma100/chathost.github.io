require('dotenv').config();
let mongoose=require('mongoose');
mongoose.connect('mongodb+srv://jaysharma100125:jay123@cluster0.lle8nyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const app=require('express')();
const http=require('http').Server(app);

const userroute=require('./routes/userroute');
app.use('/',userroute);


const User=require('./models/user');
const socketio=require('socket.io')(http);
const nsp1= socketio.of('/namespace1');
nsp1.on('connection',async function(socketid){
    console.log('user connected');
   
    var userid= socketid.handshake.auth.token;
    await User.findByIdAndUpdate({ _id:userid },{$set:{onlineinfo:'1'}});

    socketid.broadcast.emit('getonlinelist',{user_id:userid});

    socketid.on('disconnect', async function(){
        var userid= socketid.handshake.auth.token;
        await User.findByIdAndUpdate({ _id:userid },{$set:{onlineinfo:'0'}});
        console.log('user disconnected');
        socketid.broadcast.emit('getofflinelist',{user_id:userid}); 
    });

});



http.listen(3000,function(){
    console.log('server is running');
});
