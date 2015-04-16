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
var pageId = 0

//show all posts
app.get('/designistforum', function(req, res) {
	db.all("SELECT category.title AS category_title , category.id AS category_ID , post.id AS post_id , post.title , post.pic , post.comment , post.upvote , post.downvote FROM post INNER JOIN category ON post.category = category.id", function(err, data) {
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
//render page to add new users
app.get('/designistforum/user/new', function(req,res){
	res.render('newuser.ejs');
})
app.post('/designistforum/user', function(req,res){
	db.run("INSERT INTO users (username, password, email) VALUES (?, ?, ?)" , req.body.username, req.body.password, req.body.email, function(err){if (err) console.log(err);
		res.redirect('/');
	});
});
//render page to add category
app.get('/designistforum/category/new', function(req, res) {
	res.render('newcat.ejs');
});
//add category
app.post('/designistforum/category/', function(req, res) {
	db.run("INSERT INTO category (title, descrp, posts) VALUES (? , ?, ?)", req.body.title, req.body.descrp, 0, function(err) {
		if (err) console.log(err);
	});

	db.get("SELECT id FROM category WHERE title = ?", req.body.title, function(err, data) {
		var newCatId = data.id
		console.log(newCatId)
		res.redirect('/designistforum/category/' + newCatId + '/new');
	});
});
//show all from certain category
app.get('/designistforum/category/:id', function(req, res) {
	var id = req.params.id
	db.all("SELECT * FROM post WHERE category = ?", id, function(err, data) {
		items = data;
		db.all("SELECT * FROM category", function(err, data2) {
			var pageId = req.params.id
			var cats = data2
			var pTite = cats[id - 1].title
			var pDesc = cats[id - 1].descrp
			res.render('showcat.ejs', {
				posts: items,
				cat: cats,
				ids: pageId,
				title: pTite,
				script: pDesc
			});
		});
	});
});



//render page to make new post
app.get('/designistforum/category/:id/new', function(req, res) {
	var id = req.params.id;
	console.log(id)
	db.all("SELECT title , id FROM category WHERE id = ?", id, function(err, data) {
		var cat = data;
		var catTitle = cat[0].title
		var catId = cat[0].id
		pageId = req.params.id;
		res.render('new.ejs', {
			catTitles: catTitle,
			catIds: catId
		});
	});
});
//push the new post into existance
app.post('/designistforum', function(req, res) {
	db.run("INSERT INTO post (title, body, pic, category, author, comment , upvote , downvote) VALUES (? , ? , ? , ? , ? , ? , ? , ?)", req.body.title, req.body.body, req.body.pic, pageId,0,0,0,0, function(err) {
		if (err) console.log(err);
	})
	db.run("UPDATE category SET posts = posts +1 WHERE id = ?", pageId)
	res.redirect('/designistforum/category/' + pageId)
});


//show individual post
app.get("/designistforum/:id", function(req, res) {
	var id = req.params.id
	db.get("SELECT * FROM post WHERE id = ?", id, function(err, data) {
		item = data
		db.get("SELECT category.title, category.id FROM post INNER JOIN category on post.category = category.id WHERE post.id = ?", id, function(err, data2) {
			catItem = data2
			res.render('show.ejs', {
				thisPost: item, thisCat: catItem
			});
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
		if (err) {
			console.log(err)
		};
		res.redirect("/designistforum/" + id)
	});
});

//delete a post
app.delete("/designistforum/:id", function(req, res) {
	var id = req.params.id
	var thisCat = 0
	db.get("SELECT category FROM post WHERE id = ?", id, function(err, data) {
		thisCat = data.category;
		console.log("deleting 1 from", thisCat)
		db.run("UPDATE category SET posts = posts - 1 WHERE id = ?", thisCat, function(err) {
			if (err) {
				console.log(err)
			};
		});
	});
	db.run("DELETE FROM post WHERE id = ?", id, function(err) {
		if (err) console.log(err);
		res.redirect('/')
	});
});


//SELECT post.title  FROM post INNER JOIN category on post.category = category.id;
//SELECT category.title FROM post INNER JOIN category on post.category = category.id;
/*SELECT category.title , post.title , post.pic , post.comment , post.upvote , post.downvote FROM post INNER JOIN category on post.category = category.id;*/
app.listen(3000);
console.log("Listening 3000")