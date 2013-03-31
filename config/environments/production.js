/*
module.exports = function (compound) {
    var app = compound.app;

    app.configure('production', function () {
        app.enable('merge javascripts');
        app.enable('merge stylesheets');
        app.disable('assets timestamps');
        app.use(require('express').errorHandler());
        app.settings.quiet = true;
    });
};
*/

var express = require('express');

module.exports = function (compound) {
    var app = compound.app;

    app.configure('production', function () {
        app.enable('log actions');
        app.enable('env info');
        app.enable('watch');
        app.use(require('express').errorHandler({ dumpExceptions: true, showStack: true }));
    });
};
