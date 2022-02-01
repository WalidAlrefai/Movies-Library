DROP TABLE IF EXISTS favMovies;

CREATE TABLE IF NOT EXISTS favMovies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(1000),
    poster_path VARCHAR(1000),
    overview VARCHAR(1000),
    comments VARCHAR(225)
)