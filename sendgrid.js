var Key = require('./keys.js'),
var sgrdUser = Key[1],
var sgrdPw = Key[2],
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('designist.db');
var mailinglist = []
db.all("SELECT email FROM users WHERE category = ? ORDER BY post.upvote DESC LIMIT 10", id, function(err, data) {
		items = data;