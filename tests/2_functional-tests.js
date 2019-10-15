/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/


var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');


chai.use(chaiHttp);
suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})        
        .end(function(err, res){          
          assert.equal(res.status, 200);
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.typeOf(res.body.stockData.price, 'string');
          assert.typeOf(res.body.stockData.likes, 'number');      
          chai.request(server).delete('/api/stock-prices').end(function(err, response) {           
          });
          done();
        });
      });
      
      test('1 stock with like', function(done) {
       
           chai.request(server)
              .get('/api/stock-prices')
              .query({stock: 'goog', like: 'true'})
              .end(function(err, res){               
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.likes, 1);
                done();
        });       
      });
      //
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
         chai.request(server)
              .get('/api/stock-prices')
              .query({stock: 'goog', like: 'true'})
              .end(function(err, res){                
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.likes, 1);
                done();
        });       
      });
      //
      test('2 stocks', function(done) {
         chai.request(server)
              .get('/api/stock-prices')
              .query({stock: ['goog','msft']})
              .end(function(err, res){
                var stockData = res.body.stockData;
                assert.equal(res.status, 200);
                assert.isArray(stockData);
                assert.property(stockData[0], 'stock');
                assert.property(stockData[0], 'price');
                assert.property(stockData[0], 'rel_likes');
                assert.typeOf(stockData[0].price, 'string');
                assert.typeOf(stockData[0].rel_likes, 'number');
                assert.property(stockData[1], 'stock');
                assert.property(stockData[1], 'price');
                assert.property(stockData[1], 'rel_likes');
                assert.typeOf(stockData[1].price, 'string');
                assert.typeOf(stockData[1].rel_likes, 'number');
                chai.request(server).delete('/api/stock-prices').end(function(err, response) { 
                 
          });
              done();   
        }); 
      });
      /*/
      test('2 stocks with like', function(done) {
        chai.request(server)
              .get('/api/stock-prices')
              .query({stock: ['goog', 'msft'], like: 'true'})
              .end(function(err, res){
              var stockData = res.body.stockData;
              chai.request(server).delete('/api/stock-prices').end(function(err, response) {         
          });    
              console.log(res.body); 
              assert.equal(res.status, 200);
              assert.equal(stockData[0].rel_likes, 0);
              assert.equal(stockData[1].rel_likes, 0); 
             
              done();
                
        });    
      });
      /*/
    });

});
