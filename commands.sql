CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title) values ('jaska', 'jaskanblogi.com', 'jaskanblogi');
INSERT INTO blogs (author, url, title) values ('arska', 'arskanblogi.com', 'arskanblogi'); 