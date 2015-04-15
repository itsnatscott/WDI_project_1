
DROP TABLE IF EXISTS post;
CREATE TABLE post (
  id INTEGER PRIMARY KEY,
  title TEXT,
  comment INTEGER,
  pic TEXT,
  author INTEGER,
  body TEXT,
  category INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  upvote INTEGER,
  downvote INTEGER 
);


-- DROP TABLE IF EXISTS category;
-- CREATE TABLE category (
--   id INTEGER PRIMARY KEY,
--   title TEXT,
--   descrp TEXT,
--   posts INTEGER,
-- );

-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   uname TEXT,
--   pw TEXT,
--   email TEXT, 
--   pic TEXT, 
-- );

-- CREATE TRIGGER timestamp_update BEFORE UPDATE ON entries BEGIN
--   UPDATE entries SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
-- END;