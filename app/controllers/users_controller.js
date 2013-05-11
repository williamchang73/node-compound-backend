load('application');

before(use('checkLogin'), {
	only : ['edit', 'update']
});

before(loadUser, {
	only : ['show', 'edit', 'update', 'destroy']
});

action('new', function() {
	this.title = 'New user';
	this.user = new User;
	render();
});

action(function create() {

	//check user exist
	User.getUserByEmail(req.body.User.email, function(err, user) {

		if (user == null) {
			User.create(req.body.User, function(err, user) {
				respondTo(function(format) {
					format.json(function() {
						if (err) {
							send({
								code : 500,
								error : user && user.errors || err
							});
						} else {
							send({
								code : 200,
								data : user.toObject()
							});
						}
					});
					format.html(function() {
						if (err) {
							flash('error', 'User can not be created');
							render('new', {
								user : user,
								title : 'New user'
							});
						} else {
							flash('info', 'User created');
							redirect(path_to.users);
						}
					});
				});
			});
		}else{
			response({}, 106);
		}
	});
});

action(function index() {
	this.title = 'Users index';
	User.all(function(err, users) {
		switch (params.format) {
			case "json":
				send({
					code : 200,
					data : users
				});
				break;
			default:
				render({
					users : users
				});
		}
	});
});

action(function show() {
	this.title = 'User show';
	switch(params.format) {
		case "json":
			send({
				code : 200,
				data : this.user
			});
			break;
		default:
			render();
	}
});

action(function edit() {
	this.title = 'User edit';
	switch(params.format) {
		case "json":
			send(this.user);
			break;
		default:
			render();
	}
});

action(function update() {
	var user = this.user;
	this.title = 'Edit user details';
	this.user.updateAttributes(body.User, function(err) {
		respondTo(function(format) {
			format.json(function() {
				if (err) {
					send({
						code : 500,
						error : user && user.errors || err
					});
				} else {
					send({
						code : 200,
						data : user
					});
				}
			});
			format.html(function() {
				if (!err) {
					flash('info', 'User updated');
					redirect(path_to.user(user));
				} else {
					flash('error', 'User can not be updated');
					render('edit');
				}
			});
		});
	});
});

action(function destroy() {
	this.user.destroy(function(error) {
		respondTo(function(format) {
			format.json(function() {
				if (error) {
					send({
						code : 500,
						error : error
					});
				} else {
					send({
						code : 200
					});
				}
			});
			format.html(function() {
				if (error) {
					flash('error', 'Can not destroy user');
				} else {
					flash('info', 'User successfully removed');
				}
				send("'" + path_to.users + "'");
			});
		});
	});
});

function loadUser() {
	console.log('load user');
	User.find(params.id, function(err, user) {
		if (err || !user) {
			if (!err && !user && params.format === 'json') {
				return send({
					code : 404,
					error : 'Not found'
				});
			}
			redirect(path_to.users);
		} else {
			this.user = user;
			next();
		}
	}.bind(this));
}

//for customize apis
var response = use('response');
var jwt = require('jwt-simple');

var secret = 'thisisallaboutcompany';

action('login', function() {

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
			//login successfully
			console.log('login successfully then connect to memcache...:', email);
			var token = jwt.encode(email, secret);
			var memcache = require('memcache');
			var client = new memcache.Client('11211', 'localhost');
			client.connect();
			client.set(token, JSON.stringify(user), null, 100 * 60 * 10);
			console.log('login successfully token has been saved into memcache !', token);
			response({
				'token' : token,
				'user' : user
			}, 200);
		}
	});

});

