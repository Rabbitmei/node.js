var express = require('express'),
mongoose = require('mongoose');
// 将表的id 转为可查id 格式
//var ObjectID =mongodb.ObjectID;
//构建应用 2.5
app = express.createServer(); // 高版本 app = express();
//中间件
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret:'my secret'}));
app.use(function(req,res,next){
	//console.log("---loggedIn---"+req.session.loggedIn)
	if(req.session.loggedIn){
		res.local("authenticated",true);
		User.findOne({'_id': req.session.loggedIn},function(err,doc){
			if(err) return next(err);
			//console.log("---doc---"+doc)
			res.local('me',doc);
			next();
		});
	}else{
		res.local("authenticated",false);
		next();
	}
})
//设置模板
app.set('view engine','jade');
app.set('view options',{layout:false});

//定义路由
/*主页路由*/
app.get('/',function(req,res){
	//console.log(res)
	res.render('index') //authenticated 这个参数，判断是否登录成功。
	//res.render('index',{authenticated:false}) //authenticated 这个参数，判断是否登录成功。
})
/*登录路由*/
app.get('/login',function(req,res){
	console.log('/login')
	res.render('login')
});
app.get('/login/:signupEmail',function(req,res){
	console.log('/login')
	res.render('login',{signupEmail:req.params.signupEmail})
});
app.post('/login',function(req,res){
	User.findOne({'email':req.body.user.email,passowrd:req.body.user.passowrd},function(err,doc){
		if(err) return next(err);
		if(!doc) return res.send('user no font goback try again!!!');
		console.log('---------'+doc._id);
		req.session.loggedIn = doc._id.toString();
		res.redirect('/');
	})
});
/*注册路由*/
app.get('/signup',function(req,res,next){
	console.log('singup')
	res.render('singup')
});
app.post('/signup',function(req,res,next){
	//插入数据
	var user = new User(req.body.user).save(function(err,user){
		if(err) return next(err);
		console.log(user+"--")
        res.redirect('/login/' + user.email)
	})
	console.log('singup')
	//res.render('singup')
});
/*登出*/
app.get('/logout',function(req,res){
	console.log('logout')
	req.session.loggedIn = null
	res.redirect('/')
	//res.render('singup')
})
//app.listen(3000);
//console.log('3000 ')


/*连接数据库,提供ip和端口*/
mongoose.connect('mongodb://127.0.0.1/my-website');
app.listen(3000,function(){
	console.log('applisen 3000')
})
/*建立模型*/
var Schema = mongoose.Schema;
var User = mongoose.model('User',new Schema({
	first:String 
	,last:String
	,email:{type:String,unique:true}
	,passowrd:{type:String,index:true}
}));
app.use(function(req,res,next){
    if(req.session.loggedIn){
    	res.local('authenticated',true);
    	User.findById(req.session.loggedIn,function(err,doc){
    		if(err) return next(err);
    		res.local('me',doc);
    		next();
    	})
    }else{
    	res.local('authenticated',false);
    	next();
    }
})


