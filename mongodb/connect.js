const mongoose = require('mongoose')
const config = require('../config/default.js');
// const chalk = require('chalk')

function connect() {
    mongoose.connect(config.url,()=>{
        console.log('Connected!')
    },e=>{
        console.error(e)
    });
}
module.exports = connect;
