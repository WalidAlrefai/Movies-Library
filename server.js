'use strict';

const express = require('express');

const app = express();

const jsonData = require("./Movie Data/data.json");

const axios = require("axios");

const dotenv = require('dotenv');

dotenv.config();

const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`Listen to ${PORT} `);

});
app.get('/', moviesHandler);
app.get('/favorite', welcomeToFavoriteHandler);

app.get("/trending", getMoviesHandler);

app.get("/search", searchMoviesHandler)

app.use(errorHandler);

app.use("*", notFountHandler);
app.get("/collection",getCollectionHandler)


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
    axios.get(`https://api.themoviedb.org/3/movie/634649?api_key=${APIKEY}`).then(value => {
        
            let movieOne = new Movies (value.data.id,value.data.title,value.data.overview,value.data.poster_path,value.data.backdrop_path);            
         return res.status(200).json(movieOne);
    }).catch(error => {
        errorHandler(error, req,res);
    
    });
};
// the link for api link can't work with me 
// https://api.themoviedb.org/3/collection/575165?api_key=e846edf8214daa93100e86adb8e417b9&language=en-US
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
