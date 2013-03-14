before('protect from forgery', function() {
	protectFromForgery('e9d79d90fc416fea7bf9a5e46033df68b5f8bfb1');
});

publish('checkLogin', function() {

	var token = req.query.token;
	console.log('token : ' + token);
	var memcache = require('memcache');
	var client = new memcache.Client('11211', 'localhost');
	client.connect();
	client.get(token, function(error, user) {
		user = JSON.parse(user);
		if(user){
			console.log(user.id);
			next();
		}else{
			send({'data' : 'please login first'}, 200);
		}
	});
});

