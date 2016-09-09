var mongodb = require('mongodb');
/*连接数据库,提供ip和端口*/
 var server =new mongodb.Server('127.0.0.1',27017);
 /*指定数据库*/
 new mongodb.Db('my-website',server).open(function(err,client){
 	if(err) throw err;
 	console.log('connected to mongodb！')
 	app.users = new mongodb.Collection(client,'user');
 	app.listen(3000,function(){
 		console.log('app linsening on 3000')
 	});

 })
