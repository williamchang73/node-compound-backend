module.exports = function(compound) {

	var express = require('express');
	var app = compound.app;

	//CORS middleware
	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	}

	app.configure(function() {
		app.use(express.static(app.root + '/public', {
			maxAge : 86400000
		}));
		app.set('jsDirectory', '/javascripts/');
		app.set('cssDirectory', '/stylesheets/');
		app.set('cssEngine', 'stylus');
		app.use(express.bodyParser());
		app.use(express.cookieParser('secret'));
		
		app.use(express.session({
			secret : 'aboutusapi-catperson'
		}));
		app.use(express.methodOverride());
		app.use(allowCrossDomain);
		app.use(app.router);
	});

};
