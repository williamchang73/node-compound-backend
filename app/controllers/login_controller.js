load('application');

var jwt = require('jwt-simple');
var secret = 'thisisallaboutcompany';

action('aboutus', function(req, res) {

	var email = req.body.email;
	var password = req.body.password;

	//get user first, check password
	var wheres = {
		where : {
			'email' : email
		}
	};

	User.findOne(wheres, function(err, user) {
		if (err || !user) {
			console.log('permission denied : ' + err + ' : ' + email);
			send({
				'error' : 'auth failed'
			}, 200);
		} else if(password != user.password ){
			send({
				'error' : 'password incorrect'
			}, 200);
		} else {
			var token = jwt.encode(email, secret);
			var memcache = require('memcache');
			var client = new memcache.Client('11211', 'localhost');
			client.connect();
			client.set(token, JSON.stringify(user) , null, 100*60*10); //10 mins
			send({
				'token' : token
			}, 200);
		}
	});

});
