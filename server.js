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
app.get("/", function(req,res){
	res.redirect("/designistforum");
});

//show all posts
app.get('/designistforum', function(req, res){
	db.all("SELECT * FROM post", function(err, data){
		if (err) {
			console.log(err);
		} else {
			var posts = data;
		}
		res.render("index.ejs",{
			post: posts
		});
	});
});
//show individual post
app.get("/designistforum/:id", function(req,res){
	var id = req.params.id
	db.get("SELECT * FROM post WHERE id = ?"
		, id, function(err,data){
			item = data
			res.render('show.ejs', {
				thisPost: item
				});
		 });
});
//send user to edit form
app.get("/designistforum/:id/edit", function(req,res){
	var id = req.params.id
	db.get("SELECT * FROM post WHERE id = ?", id, function(err, data) {
		item = data
		res.render('edit.ejs', {
			thisPost: item
		})
	});
});

//update post
app.put("/designistforum/:id", function(req,res){
	var id = req.params.id
	db.run("UPDATE post SET title = ? , body = ? WHERE id = ?", req.body.title, req.body.body, id, function(err){
		if (err) console.log(err);
		res.redirect("/designistforum/" + id)
	});
});




















app.listen(3000);
console.log("Listening 3000")

