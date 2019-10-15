var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StockSchema = new Schema({
  stock: String,    
  likes: Number,  
  ipaddress: [String]
});

module.exports = mongoose.model('schema', StockSchema)