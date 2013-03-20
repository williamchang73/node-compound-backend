load('application');

var response = use('response');
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
			response('', 102);
		} else if (password != user.password) {
			response('', 103);
		} else {
			var token = jwt.encode(email, secret);
			var memcache = require('memcache');
			var client = new memcache.Client('11211', 'localhost');
			client.connect();
			client.set(token, JSON.stringify(user), null, 100 * 60 * 10);
			response({
				'token' : token,
				'user' : user
			}, 200);
		}
	});

});
