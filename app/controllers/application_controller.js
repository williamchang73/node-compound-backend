before('protect from forgery', function() {
	protectFromForgery('e9d79d90fc416fea7bf9a5e46033df68b5f8bfb1');
});

function returnJson(data, status) {
	var status_msg = '';
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
	} else if (status == 109) {
		status_msg = 'saving failed';
	}
	var ret = {
		"data" : data,
		"status" : status,
		"status_msg" : status_msg
	};
	console.log("api server result : ", ret);
	send(ret);
}


publish('response', function(data, code) {
	returnJson(data, code);
});

//@TODO : need to block the user from api server backend
publish('checkLogin', function() {

	//if my ip

	var myip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	if (myip == '127.0.0.1' && req.query.token == undefined) {
		next();
	} else {
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
		} else {
			returnJson('', 104);
		}

	}
});

