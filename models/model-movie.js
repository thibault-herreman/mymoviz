var mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
    title: String,
    img: String
});
  
var MovieModel = mongoose.model('movies', movieSchema);

module.exports = MovieModel;