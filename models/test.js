const mongoose = require('mongoose')



const testSchema = new mongoose.Schema({
    name: String
  });

//   将schema编译成Model
const Test = mongoose.model('test', testSchema);
module.exports = Test;


