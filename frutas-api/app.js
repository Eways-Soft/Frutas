var express = require('express');
var app = express();
var cors = require('cors');
var db_connect = require('./database');
var bodyParser = require('body-parser');
var async = require("async");
var config = require('./config');

var customerRouter = require('./routes/customer/index');
var customerRouterprelogin = require('./routes/customer/prelogin');

var adminIndex = require('./routes/admin/index');
var adminProducts = require('./routes/admin/product/index');
var adminbaskets = require('./routes/admin/basket/index');
var adminsubscription = require('./routes/admin/subscription/index');
var adminuser = require('./routes/admin/user/index');
var adminrole = require('./routes/admin/role/index');
var types = require('./routes/admin/types/index');
var discounts = require('./routes/admin/discounts/index');
var orders = require('./routes/admin/orders/index');
var mainslider = require('./routes/admin/app_slider/main_slider');
var offer_slider = require('./routes/admin/app_slider/offer_slider');
 
const functions = require("./functions.js");
const mysql = require('mysql');

var multer  = require('multer');
const fs = require('fs')

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '1234';

const base_url = 'http://localhost:9000/';

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/order_invoice', express.static('order_invoice'));
//app.use('/public', express.static('public'));

app.use('/customer', customerRouter);
app.use('/customer/prelogin/api', customerRouterprelogin);

app.use('/admin/products/', adminProducts);
app.use('/admin/baskets/', adminbaskets);
app.use('/admin/subscription/', adminsubscription);
app.use('/admin/user/', adminuser);
app.use('/admin/role/', adminrole);
app.use('/admin/types/', types);
app.use('/admin/discounts/', discounts);
app.use('/admin/orders/', orders);
app.use('/admin/', adminIndex);
app.use('/admin/app/mainslider', mainslider);
app.use('/admin/app/offerslider', offer_slider);

app.get('/getpricetypes', cors(),(req, res) => {
  db_connect.query("SELECT * FROM product_price_type", (err, results) => {
  if(err) throw err;
    if(results != ''){
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata); 
    }      
  });
});

app.get('/getallbasketfor', cors(),(req, res) => {
  db_connect.query("SELECT * FROM basket_for WHERE basket_for_status='1'", (err, results) => {
  if(err) throw err;
    if(results != ''){
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata); 
    }      
  });
});

app.get('/getAllActiveSubscriptionCities', cors(),(req, res) => {
  db_connect.query("SELECT * FROM subscription_cities", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

app.post('/getSubscriptionCitydata', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM subscription_cities WHERE city_id = '"+id+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

app.post('/updatesubscriptioncity', cors(),(req, res) => {

  var id = req.body.id;
  var name = req.body.name;
  var status = req.body.status;

  var query = "UPDATE `subscription_cities` SET `city_name`='"+name+"',`city_status`='"+status+"' WHERE `city_id`='"+id+"'"
  console.log(query)
  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

app.post('/addsubscriptioncity', cors(),(req, res) => {
  var name = req.body.name;
  var query = "INSERT INTO subscription_cities(city_name, city_status) VALUES ('"+name+"','1')";
  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

app.get('/subscriptionActiveCities', cors(),(req, res) => {
  var query = "SELECT * FROM subscription_cities WHERE city_status='1'";
  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

app.get('/getdeliveries', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM plan_delivery WHERE status ='1'", (err, results) => {
  if(err) throw err;
    if(results != ''){
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':200,'success':'No data found','data':''}
      res.send(returndata); 
    }      
  });
});

app.post('/createDeliveryPlan', cors(),(req, res) => {
  
  var dateFuntion = new Date();
  var year = dateFuntion.getFullYear();
  var month = dateFuntion.getMonth()+1;
  var day = dateFuntion.getDate();
  var date = year+'-'+month+'-'+day;

  var user_id = req.body.user_id
  var basket_id = req.body.basket_id
  var subscription_id = req.body.subscription
  var plans = req.body.plans
  var plan1 = req.body.plan1
  var plan2 = req.body.plan2
  var plan3 = req.body.plan3
  
  var delqueryLoop = ['1','2','3']
  
  if(plan1){
    var plan_id = 1
    async.each(delqueryLoop, function(delivery_id, callback) {
        var price = ''
        if(delivery_id =='1'){
          price=req.body.price11
        }
        if(delivery_id =='2'){
          price=req.body.price12
        }
        if(delivery_id =='3'){
          price=req.body.price13
        }

        var select = "SELECT * FROM configured_plans WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='1' AND delivery_id='"+delivery_id+"'" 
        
        db_connect.query(select, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
            res.send(returndata); 
          }else{
            if(results == ''){
              var query = "INSERT INTO configured_plans(basket_id, subscription_id, plan_id, delivery_id, price, status, created_date, updated_date, user_no) VALUES ('"+basket_id+"','"+subscription_id+"','1','"+delivery_id+"','"+price+"','1','"+date+"','"+date+"','"+user_id+"')"
            }else{
              var query = "UPDATE configured_plans SET price='"+price+"',updated_date='"+date+"',user_no='"+user_id+"' WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='1' AND delivery_id='"+delivery_id+"'"
            }            

            db_connect.query(query, (err1, results1) => {
              if(err1){
                var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
                res.send(returndata); 
              }else{
                var histry_query = "INSERT INTO configured_plans_history(basket_id, subscription_id, plan_id, delivery_id, price, status, created_date, updated_date, user_no) VALUES ('"+basket_id+"','"+subscription_id+"','1','"+delivery_id+"','"+price+"','1','"+date+"','"+date+"','"+user_id+"')"

                db_connect.query(histry_query, (err2, results2) => {
                  if(err1){
                    var returndata = {'CODE':201,'error':err2,'success':'fail','data':''}
                    res.send(returndata); 
                  }
                })
              }
            })
            
          }
        });

        callback();
      }, function(err) {
        console.log(err)
      })    
  }else{
    async.each(delqueryLoop, function(delivery_id, callback) {

        var select = "DELETE FROM configured_plans WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='1' AND delivery_id='"+delivery_id+"'" 
        
        db_connect.query(select, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
            res.send(returndata); 
          }else{

          }

        })
      })
  }

  if(plan2){
    var plan_id = 2
    async.each(delqueryLoop, function(delivery_id, callback) {
        var price = ''
        if(delivery_id =='1'){
          price=req.body.price21
        }
        if(delivery_id =='2'){
          price=req.body.price22
        }
        if(delivery_id =='3'){
          price=req.body.price23
        }

        var select = "SELECT * FROM configured_plans WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='2' AND delivery_id='"+delivery_id+"'" 
        
        db_connect.query(select, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
            res.send(returndata); 
          }else{
            if(results == ''){
              var query = "INSERT INTO configured_plans(basket_id, subscription_id, plan_id, delivery_id, price, status, created_date, updated_date, user_no) VALUES ('"+basket_id+"','"+subscription_id+"','2','"+delivery_id+"','"+price+"','1','"+date+"','"+date+"','"+user_id+"')"
            }else{
              var query = "UPDATE configured_plans SET price='"+price+"',updated_date='"+date+"',user_no='"+user_id+"' WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='2' AND delivery_id='"+delivery_id+"'"
            }            

            db_connect.query(query, (err1, results1) => {
              if(err1){
                var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
                res.send(returndata); 
              }else{
                var histry_query = "INSERT INTO configured_plans_history(basket_id, subscription_id, plan_id, delivery_id, price, status, created_date, updated_date, user_no) VALUES ('"+basket_id+"','"+subscription_id+"','2','"+delivery_id+"','"+price+"','1','"+date+"','"+date+"','"+user_id+"')"

                db_connect.query(histry_query, (err2, results2) => {
                  if(err1){
                    var returndata = {'CODE':201,'error':err2,'success':'fail','data':''}
                    res.send(returndata); 
                  }
                })
              }
            })
            
          }
        });

        callback();
      }, function(err) {
        console.log(err)
      })    
  }else{
    async.each(delqueryLoop, function(delivery_id, callback) {

        var select = "DELETE FROM configured_plans WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='2' AND delivery_id='"+delivery_id+"'" 
        
        db_connect.query(select, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
            res.send(returndata); 
          }else{

          }

        })
      })
  }

  if(plan3){
    var plan_id = 3
    async.each(delqueryLoop, function(delivery_id, callback) {
        var price = ''
        if(delivery_id =='1'){
          price=req.body.price31
        }
        if(delivery_id =='2'){
          price=req.body.price32
        }
        if(delivery_id =='3'){
          price=req.body.price33
        }

        var select = "SELECT * FROM configured_plans WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='3' AND delivery_id='"+delivery_id+"'" 
        
        db_connect.query(select, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
            res.send(returndata); 
          }else{
            if(results == ''){
              var query = "INSERT INTO configured_plans(basket_id, subscription_id, plan_id, delivery_id, price, status, created_date, updated_date, user_no) VALUES ('"+basket_id+"','"+subscription_id+"','3','"+delivery_id+"','"+price+"','1','"+date+"','"+date+"','"+user_id+"')"
            }else{
              var query = "UPDATE configured_plans SET price='"+price+"',updated_date='"+date+"',user_no='"+user_id+"' WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='3' AND delivery_id='"+delivery_id+"'"
            }            

            db_connect.query(query, (err1, results1) => {
              if(err1){
                var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
                res.send(returndata); 
              }else{
                var histry_query = "INSERT INTO configured_plans_history(basket_id, subscription_id, plan_id, delivery_id, price, status, created_date, updated_date, user_no) VALUES ('"+basket_id+"','"+subscription_id+"','3','"+delivery_id+"','"+price+"','1','"+date+"','"+date+"','"+user_id+"')"

                db_connect.query(histry_query, (err2, results2) => {
                  if(err1){
                    var returndata = {'CODE':201,'error':err2,'success':'fail','data':''}
                    res.send(returndata); 
                  }
                })
              }
            })
            
          }
        });

        callback();
      }, function(err) {
        console.log(err)
      })    
  }else{
    async.each(delqueryLoop, function(delivery_id, callback) {

        var select = "DELETE FROM configured_plans WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"' AND plan_id='3' AND delivery_id='"+delivery_id+"'" 
        
        db_connect.query(select, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
            res.send(returndata); 
          }else{

          }

        })
      })
  }

  
  var returndata = {'CODE':200,'error':'','success':'success','data':''}
  res.send(returndata);
});

app.post('/getbasketplanconfiguration', cors(),(req, res) => {
  var basket_id = req.body.basket_id;
  var subscription_id = req.body.subscription_id;

  db_connect.query("SELECT * FROM configured_plans WHERE basket_id='"+basket_id+"' AND subscription_id='"+subscription_id+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
      res.send(returndata);
    }else{
      var returndata = {'CODE':200,'error':'','success':'success','data':results}
      res.send(returndata);
    }   
  });
});

var server = app.listen(9000, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at ", host, port)
})

module.exports = app;