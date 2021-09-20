var express = require('express');
var router = express.Router();
var request = require('sync-request');

const MovieModel = require('../models/model-movie');

var myApiKey = process.env.TMDB;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MymovizBackend' });
});

router.get('/new-movies', function(req, res, next) {
  var data = request("GET", `https://api.themoviedb.org/3/discover/movie?api_key=${myApiKey}&language=fr-FR&region=FR&sort_by=release_date.desc&include_adult=false&include_video=false&page=1&release_date.lte=2020-01-01`);
  var resultWS = JSON.parse(data.body);
  res.json({movies: resultWS.results, result: true});
});

router.post('/wishlist-movie', async function(req, res, next) {
    var movie = req.body.movieName;
    movie = movie[0].toUpperCase() + movie.toLowerCase().substr(1);

    var alreadyExist = await MovieModel.findOne({ title: movie });
  
    if (alreadyExist == null && movie != '') {
        var newMovie = new MovieModel ({
          title: movie,
          img: req.body.img
        });
          
        var orderSaved = await newMovie.save();
        res.json({result: true});
    } else {
      res.json({result: false});
    }
});

router.delete('/wishlist-movie/:movie', async function(req, res, next) {
  var movie = req.params.movie;

  await MovieModel.deleteOne(
    { title: movie}
  );
  
  res.json({result: true});
});

router.get('/wishlist-movie', async function(req, res, next) {
  const movieList = await MovieModel.find();
  
  res.json({movieList: movieList, result: true});
});

module.exports = router;
