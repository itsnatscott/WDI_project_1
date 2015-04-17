-- INSERT INTO post (title, comment, pic, author, body, category, upvote, downvote) VALUES 
-- ("Arthur Rackham",
-- 0, 
-- "http://cdn2.peterharrington.co.uk/wp-content/uploads/2013/01/79524_3_Rackham-549x700.jpg",
-- 0,
-- "Beautiful use of line and implied movement in composition",
-- 1,
-- 0,
-- 0),
-- ("NC Wyeth",
-- 0, 
-- "https://aaronpocock.files.wordpress.com/2011/01/giant.jpg",
-- 0,
-- "atmosphere and pirates for shizzle",
-- 1,
-- 0,
-- 0),
-- ("Pixel Pro Quo Designers",
-- 0, 
-- "https://pixelproquo.com/wp-content/uploads/2012/12/corporate-website-templates6.jpg",
-- 0,
-- "bland corporate goodness",
-- 2,
-- 0,
-- 0);

-- INSERT INTO users (username, password, email) VALUES 
-- ("ItsNatScott",
-- "password", 
-- "itsnatscott@gmail.com");

INSERT INTO comments (comment, userId, postId) VALUES 
("Needs brighter colors",
"itsnatscott", 
1),
("Needs more unicorns",
"itsnatscott", 
2),
("Needs personality",
"itsnatscott", 
3);

-- INSERT INTO category (title, descrp, posts) VALUES 
-- ("Illustration",
-- "Books, Editorial, Advertising", 
-- 2),
-- ("Corporate Web Design",
-- "Branding pages, customer service, product release",
-- 1);
