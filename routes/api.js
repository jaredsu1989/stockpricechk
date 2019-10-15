/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
var express = require("express");
var expect = require("chai").expect;
var MongoClient = require("mongodb");
var mongoose = require("mongoose");
var app = express();
var StockHandler = require("../controller/handler.js");
var address = require('address');

//var cors = require("cors");
//app.use(cors({ optionSuccessStatus: 200 }));

var alpha = require("alphavantage")({ key: "4POUT8V0PHA16VF7" }); //upload your own key

const CONNECTION_STRING = process.env.DB;
mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

var stockModel = require("../models/stock.js");

module.exports = function(app) {
  var stockHandler = new StockHandler();

  app.route("/api/stock-prices")
    .get(async function(req, res) {
    var ipaddress = address.ip(); //= req.header("x-forwarded-for").split(",")[0];    
   // console.log(ipaddress);
    //receive data from query
    let likeQuery = req.query.like;
    let stockQuery = req.query.stock;

    //arraytest
    var arrayTest = Array.isArray(stockQuery);

    //search database for the stock(s) mentioned, increment when necessary and save
    let searchSaveLikes = stockHandler.searchSaveLikes(
      arrayTest,
      stockQuery,
      likeQuery,
      ipaddress
    );

    //use the alpha.data function to search for the data and save it/them to variables //to be reactivated
    var AlphaData = await stockHandler.returnAlphaData(stockQuery); //need to be reactivated

    var returnStockData = function() {
      if (!arrayTest) {
        stockModel.findOne({ stock: stockQuery }, function(err, data) {
          if (err) {
            return res.send(
              "Invalid stock entered. Please check the stock ticker and try again."
            );
          }
          if (!data) {
            return res.send(
              "Invalid stock entered. Please check the stock ticker and try again."
            );
          } else {
            return res.json({
              stockData: {
                stock: stockQuery,
                price: AlphaData["Global Quote"]["05. price"],
                likes: data.likes
              }
            });
          }
        });
      } else {
        stockModel.findOne({ stock: stockQuery[0] }, function(err, data0) {
          stockModel.findOne({ stock: stockQuery[1] }, function(err, data1) {
            if (err) {
              return res.send(
                "Invalid stock entered. Please check the stock ticker and try again."
              );
            }
            if (!data0 || !data1) {
              return res.send(
                "Invalid stock entered. Please check the stock ticker and try again."
              );
            } else {
              
              var like0 = data0.likes;
              var like1 = data1.likes;
              return res.json({
                stockData: [
                  {
                    stock: stockQuery[0],
                    price: AlphaData[0]["Global Quote"]["05. price"],
                    rel_likes: like0 - like1
                  },
                  {
                    stock: stockQuery[1],
                    price: AlphaData[1]["Global Quote"]["05. price"],
                    rel_likes: like1 - like0
                  }
                ]
              });
            }
          });
        });
      }
    };

    returnStockData();
  })
  .delete(function(req, res) {
    
    stockModel.deleteMany({}, function(err){});
  });
};
