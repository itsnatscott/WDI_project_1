
-- DROP TABLE IF EXISTS post;
-- CREATE TABLE post (
--   id INTEGER PRIMARY KEY,
--   title TEXT,
--   comment INTEGER,
--   pic TEXT,
--   author INTEGER,
--   body TEXT,
--   category INTEGER,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   upvote INTEGER, --for posts
--   downvote INTEGER --not used
-- );


-- DROP TABLE IF EXISTS category;
-- CREATE TABLE category (
--   id INTEGER PRIMARY KEY,
--   title TEXT,
--   descrp TEXT,
--   posts INTEGER,
--   votes INTEGER
-- );

-- DROP TABLE IF EXISTS comments;
-- CREATE TABLE comments (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   comment TEXT,
--   userId TEXT,
--   postId INTEGER 
-- );

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  email TEXT, 
  subs INTEGER
);

-- CREATE TRIGGER timestamp_update BEFORE UPDATE ON entries BEGIN
--   UPDATE entries SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
-- END;