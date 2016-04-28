var express = require('express'),
    http = require('http'),
	Bourne = require('bourne'),
	bodyParser = require('body-parser'),
	session=require('express-session'),	
    /* connect = require('connect') ,
    RedisStore = require('connect-redis'), */
	

	db = new Bourne('./public/data.json'),

	router = express.Router();
 var redis=require('redis');
	var client=redis.createClient();
    	client.on('connect', function() {
    console.log('connected');
});

 	var store = new session.MemoryStore;
	var stor2;
	var tempid; 
	var temp=6; 
  /* client.on('error',function(error){
	  console.log('error during making connection with socket');
  }) */
	router
      /*  .use(function(req,res,next){
			if(!req.user) req.user={id: 1};
			next();
		})  */
       .use(bodyParser.json())     
	  .use(session({secret:'g', saveUninitialized: true,
                 resave: true}))
	
		.route('/contact')
		 .get(function(req,res){
		  
			if(req.session.userId!==undefined){
		    stor=req.session.userId;
          console.log('later reply store'+stor);
		  client.set('tempo', stor, function(err, reply) {
          });
			temp=temp+7;}
			else{console.log('in the end'); /* stor2=stor; */}
		/* 	console.log("rehrt"+temp+stor2); */
			/* console.log("fff"+tempid); */
	     client.get('tempo', function(err, reply) {
           db.find({ userId:parseInt(reply, 10)}, function (err, data){
	        res.json(data);
		    
		});
});
		    	
			
		 })
		 .post(function(req,res){
			
                 client.get('tempo', function(err, reply) {			
			     var contact = req.body;
		          contact.userId=parseInt(reply, 10);
				 db.insert(contact,function(err,data){
				 res.json(data);   			
			     console.log('dta'+reply+data);
		});
        
			});
		 
		 })
	
	router.
	  param('id',function(req,res,next){
      		 req.dbQuery={id: parseInt(req.params.id,10)};
		    
		  next();
		 })
	   /* 
	     param('userId',function(req,res,next){
      		  req.dbQuery1={userId: parseInt(req.params.UserId,10)};
		      next();
		 }) */
	 .route('/contact/:id')
	 .get(function(req,res){
		 db.findOne(req.dbQuery,function(err,data){
			 res.json(data);
		 });
	 })
	 .put(function(req,res){
		 var contact=req.body;
		 delete contact.$promise;
		 delete contact.$resolved;
		 db.update(req.dbQuery,contact,function(err,data){
          			
			console.log('dbquery'+req.dbQuery.id);
			
			res.json(data[0]);
		 });
	 })
	 .delete(function(req,res){
		 db.delete(req.dbQuery,function(){
			res.json(null); 
		 });
	 });
	 module.exports=router;   