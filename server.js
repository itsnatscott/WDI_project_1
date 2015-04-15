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
//redirect "/"
app.get("/", function(req, res) {
	res.redirect("/designistforum");
});

//show all posts
app.get('/designistforum', function(req, res) {
	db.all("SELECT * FROM post", function(err, data) {
		var posts = data;
		db.all("SELECT * FROM category", function(err, data2) {
			var cats = data2
			res.render("index.ejs", {
				post: posts,
				cat: cats
			});
		});
	});
});
//show all from certain category
app.get('/designistforum/category/:id', function(req, res) {
	var id = req.params.id
	db.all("SELECT * FROM post WHERE category = ?", id, function(err, data) {
		items = data;
		db.all("SELECT * FROM category", function(err, data2) {
			var cats = data2
			res.render('showcat.ejs', {
				posts: items, cat: cats
			});
		});
	});
});

//show individual post
app.get("/designistforum/:id", function(req, res) {
	var id = req.params.id
	db.get("SELECT * FROM post WHERE id = ?", id, function(err, data) {
		item = data
		res.render('show.ejs', {
			thisPost: item
		});
	});
});

//send user to edit form
app.get("/designistforum/:id/edit", function(req, res) {
	var id = req.params.id
	db.get("SELECT * FROM post WHERE id = ?", id, function(err, data) {
		item = data
		res.render('edit.ejs', {
			thisPost: item
		})
	});
});

//update post
app.put("/designistforum/:id", function(req, res) {
	var id = req.params.id
	db.run("UPDATE post SET title = ? , body = ? WHERE id = ?", req.body.title, req.body.body, id, function(err) {
		if (err) console.log(err);
		res.redirect("/designistforum/" + id)
	});
});

//SELECT post.title  FROM post INNER JOIN category on post.category = category.id;
//SELECT post.title FROM post INNER JOIN category on post.category = category.id;
//SELECT category.title FROM post INNER JOIN category on post.category = category.id;

app.listen(3000);
console.log("Listening 3000")