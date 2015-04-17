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
	db.all("SELECT category.title AS category_title , category.id AS category_ID , post.id AS post_id , post.title , post.pic , post.comment , post.upvote , post.downvote FROM post INNER JOIN category ON post.category = category.id ORDER BY post.id DESC LIMIT 10", function(err, data) {
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
app.get('/designistforum/user/new', function(req, res) {
	res.render('newuser.ejs');
})
app.post('/designistforum/user', function(req, res) {
	db.run("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", req.body.username, req.body.password, req.body.email, function(err) {
		if (err) console.log(err);
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
		res.redirect('/designistforum/category/' + newCatId + '/posts/new');
	});
});
//show all from certain category
app.get('/designistforum/category/:id', function(req, res) {
	var id = req.params.id
	db.all("SELECT * FROM post WHERE category = ? ORDER BY post.id DESC LIMIT 10", id, function(err, data) {
		items = data;
		db.all("SELECT * FROM category", function(err, data2) {
			var cats = data2
			var pTite = cats[id - 1].title
			var pDesc = cats[id - 1].descrp
			res.render('showcat.ejs', {
				posts: items,
				cat: cats,
				ids: req.params.id,
				title: pTite,
				script: pDesc
			});
		});
	});
});



//render page to make new post
app.get('/designistforum/category/:id/posts/new', function(req, res) {
	var id = req.params.id;
	db.all("SELECT title , id FROM category WHERE id = ?", id, function(err, data) {
		var cat = data;
		var catTitle = cat[0].title
		var catId = cat[0].id
		res.render('new.ejs', {
			catTitles: catTitle,
			catIds: catId
		});
	});
});
//shove the new post into existance
app.post('/designistforum/category/:catid/posts', function(req, res) {
	var pageId = req.params.catid
	db.run("INSERT INTO post (title, body, pic, category, author, comment , upvote , downvote) VALUES (? , ? , ? , ? , ? , ? , ? , ?)", req.body.title, req.body.body, req.body.pic, pageId, 0, 0, 0, 0, function(err) {
		if (err) console.log(err);
	})
	db.run("UPDATE category SET posts = posts +1 WHERE id = ?", pageId)
	res.redirect('/designistforum/category/' + pageId)
});


//show individual post
app.get("/designistforum/category/posts/:id", function(req, res) {
	var id = req.params.id
	db.get("SELECT * FROM post WHERE id = ?", id, function(err, data) {
		item = data
		db.get("SELECT category.title, category.id FROM post INNER JOIN category on post.category = category.id WHERE post.id = ?", id, function(err, data2) {
			catItem = data2
			db.all("SELECT comment, userId FROM comments WHERE postId = ?", id,
				function(err, data3) {
					var comm = data3;
					res.render('show.ejs', {
						thisPost: item,
						thisCat: catItem,
						comment: comm
					});
				});
		});
	});
});

//increment upvote or downvote log
app.put('/designistforum/category/posts/:id/votes', function(req, res){
			if (req.body.vote === "up") { 
				db.run("UPDATE post SET upvote = upvote + 1 WHERE id = ?", req.params.id);
			} else if (req.body.vote === "down") { console.log("downvoting in progress")
				db.run("UPDATE post SET downvote = downvote - 1 WHERE id = ?", req.params.id);
			};
			res.redirect('/designistforum/category/posts/'+req.params.id)
		});

	//add comment to a post
		app.post('/designistforum/category/posts/:id/comments', function(req, res) {
			db.run("INSERT INTO comments (comment, userId, postId) VALUES (? , ? , ?)", req.body.comment, req.body.name, req.params.id)
			db.run("UPDATE post SET comment = comment +1 WHERE id = ?", req.params.id)
			res.redirect("/designistforum/category/posts/" + req.params.id)
		});

		//send user to edit form
		app.get("/designistforum/category/:catid/posts/:id/edit", function(req, res) {
			var posId = req.params.id
			var catId = req.params.catid
			db.get("SELECT * FROM post WHERE id = ?", req.params.id, function(err, data) {
				item = data
				res.render('edit.ejs', {
					thisPost: item,
					postId: posId,
					catsIds: catId
				})
			});
		});

		//update post
		app.put("/designistforum/category/:catid/posts/:id/update", function(req, res) {
			var id = req.params.id
			var catId = req.params.catid
			db.run("UPDATE post SET title = ? , body = ? WHERE id = ?", req.body.title, req.body.body, id, function(err) {
				if (err) {
					console.log(err)
				};
				res.redirect("/designistforum/category/posts/" + id)
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

		//SELECT * FROM tablename ORDER BY column DESC LIMIT 1
		//SELECT post.title  FROM post INNER JOIN category on post.category = category.id;
		//SELECT category.title FROM post INNER JOIN category on post.category = category.id;
		/*SELECT category.title , post.title , post.pic , post.comment , post.upvote , post.downvote FROM post INNER JOIN category on post.category = category.id;*/
		app.listen(3000); console.log("Listening 3000")