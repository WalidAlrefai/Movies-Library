'use strict';

const express = require('express');

const app = express();

const jsonData = require("./Movie Data/data.json");

const axios = require("axios");

const dotenv = require('dotenv');
app.use(express.json());
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const pg = require("pg")
const cors = require('cors');
app.use(cors());
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});


// const client =new pg.Client(DATABASE_URL);
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;


app.get('/', moviesHandler);
app.get('/favorite', welcomeToFavoriteHandler);
app.get("/trending", getMoviesHandler);
app.get("/search", searchMoviesHandler);
app.get("/collection",getCollectionHandler);
app.post("/addFavMovies", addFavMovieHandler);
app.get("/getAllFavMovies", getAllFavMovieHandler);
app.get("/getFavMovie/:id", getFavMovieHandler);
app.put("/updateFavMovies/:id", updateFavMovieHandler);
app.delete("/deleteFavMovie/:id", deleteFavMovieHandler)


app.use(errorHandler);
app.use("*", notFountHandler);



function Movies(id,title,release_date,poster_path,overview){
    this.id = id,
    this.title =title,
    this.release_date=release_date,
    this.poster_path = poster_path,
    this.overview =overview 
}
function Collection(id,name,overview,poster_path,backdrop_path){
    this.id = id,
    this.name =name,
    this.overview =overview
    this.poster_path = poster_path,
    this.backdrop_path=backdrop_path 
}

function getMoviesHandler(req,res){
     let movieArr=[] 
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}`).then(value => {
        
        value.data.results.forEach(value=>{
            let movieOne = new Movies (value.id,value.title,value.overview,value.poster_path,value.backdrop_path);
            movieArr.push(movieOne)
            })
         return res.status(200).json(movieArr);
    }).catch(error => {
        errorHandler(error, req,res);
    
    });
};


function getCollectionHandler(req,res){
    axios.get(`https://api.themoviedb.org/3/collection/575165?api_key=${APIKEY}`).then(value => {
                
            let collectionOne = new Collection(value.data.id,value.data.name,value.data.overview,value.data.poster_path,value.data.backdrop_path);            
         return res.status(200).json(collectionOne);
    }).catch(error => {
        errorHandler(error, req,res);
    
    });
};


function searchMoviesHandler(req, res){
    console.log(req.query.search);
    let searchForquery = req.query.search;
    let newArray=[];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${searchForquery}`).then(value => {
        
        value.data.results.forEach(movies => {
            let movie = new Movies (movies.title,movies.poster_path,movies.overview);
            newArray.push(movie);
        })

        return res.status(200).json(newArray);
    }).catch(error => {
        errorHandler(error, req,res);
    })

}

function addFavMovieHandler(req,res){
    let movie = req.body

    const sql = `INSERT INTO favMovies(title, release_date, poster_path, overview,comments) VALUES($1, $2, $3, $4, $5) RETURNING * ;`
   

    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview,movie.comments]
    
    client.query(sql, values).then((data) => {
       
        return res.status(201).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res);
    })
};

function getAllFavMovieHandler(req, res){
    const sql = `SELECT * FROM favMovies`;
    client.query(sql).then(data => {
        return res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req,res);
    })
}

function getFavMovieHandler(req,res){
    console.log(req.params);
    const id = req.params.id;
    const sql = `SELECT * FROM favMovies WHERE id=${id};`

    client.query(sql).then(data => {
        
        res.status(200).json(data.rows);
    }).catch(error => {
        console.log(error);
        errorHandler(error, req, res);
    })
}


function updateFavMovieHandler(req, res){
    const id = req.params.id;
    const movie = req.body;
    console.log(res.body)

    const sql = `UPDATE favMovies SET  comments=$1 WHERE id=${id} RETURNING *;`
    const values = [ movie.comments];

    client.query(sql,values).then(data => {
        return res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res);
    })
};

function deleteFavMovieHandler(req, res){
    const id = req.params.id;

    const sql = `DELETE FROM favMovies WHERE id=${id};`

    client.query(sql).then(() => {
        return res.status(204).json([]);
    }).catch(error => {
        errorHandler(error, req, res);
    })
}


function welcomeToFavoriteHandler(req, res){
    return res.status(200).send("Welcome to Favorite Page");
};

function  moviesHandler(req, res){
    let movies = new Movies(jsonData.title, jsonData.poster_path, jsonData.overview); ;
    

    return res.status(200).json(movies);
};

function notFountHandler(req,res){
    res.status(404).send("No endpoint with this name");
}

function errorHandler(error, req, res){
    const err = {
        status : 500,
        message : error
    }
}

client.connect().then(() => {
    
    app.listen(PORT, () => {
        console.log(`I am using port ${PORT}`);
    });
});
