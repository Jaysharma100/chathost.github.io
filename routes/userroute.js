const express= require('express');
const route=express();

const bodyparser=require('body-parser');
route.use(bodyparser.json());
route.use(bodyparser.urlencoded({extended:true}));

const session=require('express-session');
const {SECRET}=process.env;
route.use(session({secret:SECRET, resave: true,
    saveUninitialized: true}));

route.set('view engine','ejs');
route.set('views','./views');

route.use(express.static('public'));

const path1=require('path');
const multer=require('multer');

const store=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path1.join(__dirname,'../public/image'));
    },
    filename:function(req,file,cb){
        const name= Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload=multer({storage:store});

const auth=require('../middleware/auth');
const usercontrol=require('../controllers/usercontrol')
route.get('/register',auth.islogout, usercontrol.registerload);
route.post('/register',upload.single('image'),usercontrol.register);

route.get('/',auth.islogout,usercontrol.loginload);
route.post('/',usercontrol.login);
route.get('/logout',auth.islogin,usercontrol.logout);
route.get('/dashboard',auth.islogin,usercontrol.dashboardload);
route.post('/chatsave',usercontrol.chatsave);

route.get('*',function(req,res){
    res.redirect('/');
});

module.exports=route;