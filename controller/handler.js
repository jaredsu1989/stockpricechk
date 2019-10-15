
var mongo = require('mongodb');
var mongoose = require('mongoose');

let DB_STRING = process.env.DB;
mongoose.connect(DB_STRING, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

var alpha = require('alphavantage')({key: '4POUT8V0PHA16VF7'}); 

//Import  models
var stockModel = require('../models/stock.js');


//Handler function
function StockHandler() {  
  this.returnAlphaData =  function(stockQuery) {
    //checks whether the returned query is a single stock
    if (!(Array.isArray(stockQuery))) {
      return  alpha.data.quote(stockQuery)
    } else {    
      var stockA=  alpha.data.quote(stockQuery[0]);
      var stockB=  alpha.data.quote(stockQuery[1]);
      return  Promise.all([stockA, stockB]).then(function(value) {        
                                         return value
                                         })       
    }    
  };
  
  //searchSaveLikes
  this.searchSaveLikes =  function(arrayTest, stockQuery, likeQuery, ipaddress){ 
  //function for saving handling database search and save
    var saveQuery = function(stock) {
      var saveStock0 = new stockModel({
      stock: stock,
      likes: 0,
      ipaddress: []
    });      
      stockModel.findOne({stock: stock}, function(err, data) {
      if(!data) {
       if(likeQuery === 'true') {
        saveStock0.likes = 1;
        saveStock0.ipaddress.push(ipaddress); 
        saveStock0.save();         
        } else {
        saveStock0.save();
        }
      } else {
        if(likeQuery === 'true' && !(data.ipaddress.includes(ipaddress))) {
        data.ipaddress.push(ipaddress); 
        data.likes++;         
        data.save();         
        }
      }
      });
    }    
    
    if(arrayTest === false) {
      saveQuery(stockQuery);
    } else {
      saveQuery(stockQuery[0]);
      saveQuery(stockQuery[1]);
    } 
  };  
};
  

module.exports = StockHandler;
