//set up npm modules
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('designist.db');
var ejs = require('ejs');
app.set('view_engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));





















app.listen(3000);
console.log("Listening 3000")

