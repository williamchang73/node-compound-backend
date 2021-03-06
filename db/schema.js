/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
     property('email', String, { index: true });
     property('password', String);
     property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
     // model definitions here
 });

*/

var Company = describe('Company', function () {
    property('name', String);
    property('data', String);
    property('userid', String);
    property('status', Number , {default:0}); //0 : draft 1 : submit 2 : publish
    property('create_time', String, {default:Date});
    property('update_time', String, {default:Date});
    set('restPath', pathTo.companies);
});

var User = describe('User', function () {
    property('email', String);
    property('password', String);
    property('create_time', String, {default:Date});
    property('update_time', String, {default:Date});
    set('restPath', pathTo.users);
});

