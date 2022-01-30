'use strict';

const express = require('express');

const app = express();

const jsonData = require("./Movie Data/data.json");


app.listen(3100, () => {
    console.log('Listen to port 3000');

});
app.get('/', moviesHandler);
app.get('/favorite', welcomeToFavoriteHandler);


function Movies(title,poster_path,overview){
    this.title =title,
    this.poster_path = poster_path,
    this.overview =overview 
}

function welcomeToFavoriteHandler(req, res){
    return res.status(200).send("Welcome to Favorite Page");
};

function  moviesHandler(req, res){
    let movies = new Movies(jsonData.title, jsonData.poster_path, jsonData.overview); ;
    

    return res.status(200).json(movies);
};

