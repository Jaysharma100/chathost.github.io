const User=require('../models/user');
const chat=require('../models/chat');
const bcrypt=require('bcrypt');


const registerload=async(req,res)=>{
    try{
        res.render('register');
    }
    catch(err){
        console.log(err.message);
    }
}
const register=async(req,res)=>{
    try{
        const  passhash= await bcrypt.hash(req.body.password,10);

        const user= new User({
            name:req.body.name,
            email:req.body.email,
            image:'image/'+req.file.filename,
            password: passhash
        });
        await user.save();
        res.render('register',{message:'your registeration is done'})
    }
    catch(err){
        console.log(err.message);
    }
}

const loginload= async(req, res)=>{
    try{
        res.render('login');
    }
    catch(err){
        console.log(err.message);
    }
}

const login= async(req, res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const userdata= await User.findOne({email:email});
        
        if(userdata){
            const passmatch= await bcrypt.compare(password,userdata.password); //returns promise thus await
            if(passmatch){
                req.session.user =userdata;
                res.redirect('./dashboard');
            }
            else{
                res.render('login',{message:'Email or password is incorrect!'});
            }
        }
        else{
            res.render('login',{message:'Email or password is incorrect!'});
        }
    }
    catch(err){
        console.log(err.message);
    }
}

const logout= async(req, res)=>{
    try{
        req.session.destroy()
        res.redirect('/');
    }
    catch(err){
        console.log(err.message);
    }
}

const dashboardload= async(req, res)=>{
    try{
        var users = await User.find({_id:{ $nin:[req.session.user._id]}});//nin=not in
        res.render('dashboard',{ user: req.session.user, users:users});
    }
    catch(err){
        console.log(err.message);
    }
}

const chatsave= async(req,res)=>{
    try{
        new chat({
            id_sender:req.body.id_sender,
            id_reciever:req.body.id_reciever,
            message:req.body.message
        });
        var newchat= await chat.save();
        res.status(200).send({success:true,msg:"chat inserted",data:newchat});
    }
    catch(err){
        res.status(400).send({success:false,msg:err.message});
    }
}

module.exports={
    login,
    loginload,
    logout,
    dashboardload,
    registerload,
    register,
    chatsave
}