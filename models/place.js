const mongoose = require('mongoose')

// category schema
const PlaceSchema = new mongoose.Schema({
    placeName: String,
});

const Place = mongoose.model('category', PlaceSchema);
module.exports = Place;
