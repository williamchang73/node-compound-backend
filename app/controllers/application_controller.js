before('protect from forgery', function() {
	protectFromForgery('e9d79d90fc416fea7bf9a5e46033df68b5f8bfb1');
});

publish('response', function(data, code) {
	returnJson(data, code);
});

function returnJson(data, status) {
	if (status == 200) {
		status_msg = '';
	} else if (status == 101) {
		status_msg = 'please login first';
	} else if (status == 102) {
		status_msg = 'user invalid';
	} else if (status == 103) {
		status_msg = 'password incorrect';
	} else if (status == 104) {
		status_msg = 'memcache invalid';
	} else if (status == 106) {
		status_msg = 'user already exist';
	} else if (status == 107) {
		status_msg = 'can not find company';
	} else if (status == 108) {
		status_msg = 'you have no permission';
	}


	var ret = {
		data : data,
		status : status,
		status_msg : status_msg
	};
	send(ret);
}

publish('checkLogin', function() {
	console.log('check Login...');
	//use token to get user
	var token = req.query.token;
	var memcache = require('memcache');
	var client = new memcache.Client('11211', 'localhost');
	if (client) {
		client.connect();
		client.get(token, function(error, user) {
			user = JSON.parse(user);
			if (user) {
				req.userid = user.id;
				console.log('user id : ' + req.userid);
				next();
			} else {
				returnJson('', 101);
			}
		});
	}else{
		returnJson('', 104);
	}
});

