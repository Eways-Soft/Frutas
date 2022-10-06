var express = require('express');
var fs = require('fs');
const mysql = require('mysql');
var router = express.Router();
var db_connect = require('../../../database');
var cors = require('cors');

var multer  = require('multer');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '1234';

var config = require('../../../config');
const base_url = config.BASE_URL;
const UPLOAD_BASE_URL = config.UPLOAD_BASE_URL;

router.use(cors());

const subscriptionstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/subscriptions/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var subscriptionupload = multer({ storage: subscriptionstorage });

router.get('/getAllPageignationSubscription', function(req, res, next) {
	const Query = "SELECT s.*,case when s.subscription_status > 0 then 'Active' else 'In-Active' end as subscription_status,subscription_cities.city_name FROM subscriptions as s LEFT JOIN subscription_cities ON subscription_cities.city_id=s.subscription_city";

	db_connect.query(Query, function (error, results, fields) {
		if (error){
          	var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
          	res.send(returndata);
        }else{
        	var returndata = {'CODE':200,'error':'','success':'success','products':results}
          	res.send(returndata); 
        }

	})
})

router.post('/addnewsubscription', subscriptionupload.single('image'), cors(),(req, res) => {
  
  var userid = req.body.userid;
  var sku_code = req.body.sku_code;  
  var pduct = req.body.products;

  //var products = JSON.parse(pduct);
  
  var subscription_name = req.body.subscription_name;
  var subscription_city = req.body.subscription_city;
  var subs_validity = req.body.subscription_validity;
  var subscription_description = req.body.subscription_description;  
  var status = req.body.status;
  var image = UPLOAD_BASE_URL+'uploads/subscriptions/'+req.file.filename;
     

  var dateFuntion = new Date();
  var year = dateFuntion.getFullYear();
  var month = dateFuntion.getMonth()+1;
  var day = dateFuntion.getDate();

  var date = year+'-'+month+'-'+day;
  var dateFuntion1 = new Date(subs_validity);
  var year1 = dateFuntion1.getFullYear();
  var month1 = dateFuntion1.getMonth()+1;
  var day1 = dateFuntion1.getDate();

  var subscription_validity = year1+'-'+month1+'-'+day1;

  var query1 = "INSERT INTO `subscriptions`(`subscription_name`, `subscription_city`, `subscription_validity`, `subscription_description`, `subscription_status`, `subscription_image`, `created_date`, `updated_date`, `user_no`) VALUES ('"+subscription_name+"','"+subscription_city+"','"+subscription_validity+"','"+subscription_description+"','"+status+"','"+image+"','"+date+"','"+date+"','"+userid+"')";

  db_connect.query(query1, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
      res.send(returndata); 
    }else{
      /*var subscription_id = results.insertId;
      for (var i = 0; i < products.length; i++) {
        
        var basket_id = products[i].basket_id;

        var query2 = "INSERT INTO `subscription_baskets`(`subscription_id`, `basket_id`, `created_date`, `user_no`) VALUES ('"+subscription_id+"','"+basket_id+"','"+date+"','"+userid+"')";

        db_connect.query(query2, (err2, results2) => {
          if(err2){
            var returndata = {'CODE':201,'success':'fail','data':err2}
            res.send(returndata); 
          }else{
            var query3 = "INSERT INTO `subscription_history`(`subscription_id`, `basket_id`, `subscription_name`, `subscription_city`, `subscription_validity`, `subscription_description`, `subscription_status`, `subscription_image`, `created_date`, `updated_date`, `user_no`) VALUES ('"+subscription_id+"','"+basket_id+"','"+subscription_name+"','"+subscription_city+"','"+subscription_validity+"','"+subscription_description+"','"+status+"','"+image+"','"+date+"','"+date+"','"+userid+"')";

            db_connect.query(query3, (err3, results3) => {
              if(err3){
                var returndata = {'CODE':201,'success':'fail','data':err2}
                res.send(returndata); 
              }
            })
          }
        })        
      }*/

      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 

    }
  });
});

router.post('/deletesubscription', cors(),(req, res) => {
  var id = req.body.id;

  var query = "SELECT * FROM subscriptions WHERE subscription_id='"+id+"'";

  db_connect.query(query, (err, results) => {    
    if(err){
      var returndata = {'CODE':201,'success':'fail','error':err,'data':''}
      res.send(returndata);
    }else{

            
      if(results != ''){
        var path = results[0].subscription_image
        try {
         // fs.unlinkSync(path)

          var query2 = "DELETE FROM subscriptions WHERE subscription_id='"+id+"'"

          db_connect.query(query2, (err1, results1) => {    
            if(err1){
              var returndata = {'CODE':201,'success':'fail','error':err1,'data':''}
              res.send(returndata);
            }else{
              var returndata = {'CODE':200,'success':'success','error':'','data':results1}
              res.send(returndata);
            }
          })              
        } catch(error) {
          var returndata = {'CODE':202,'success':'fail','error':error,'data':''}
          res.send(returndata);
        } 
      }else{
        var returndata = {'CODE':203,'success':'fail','data':''}
        res.send(returndata); 
      }
    }   

  });
});

router.post('/getSubscriptionData', cors(),(req, res) => {
  var id = req.body.id;
          
  try {
    var query = "SELECT * FROM subscriptions WHERE subscription_id='"+id+"'";

    db_connect.query(query, (err, results) => {    
      if(err){
        var returndata = {'CODE':201,'success':'fail','error':err,'data':''}
        res.send(returndata);
      }else{
        var query1 = "SELECT subscription_baskets.*,baskets.*,baskets.basket_sale_price as price FROM subscription_baskets LEFT JOIN baskets ON subscription_baskets.basket_id=baskets.basket_id WHERE subscription_baskets.subscription_id='"+id+"'";
        db_connect.query(query1, (err1, results1) => {    
          if(err1){
            var returndata = {'CODE':201,'success':'fail','error':err1,'data':''}
            res.send(returndata);
          }else{ 
            var returndata = {'CODE':200,'success':'success','error':'','data':results,'baskets':results1}
            res.send(returndata);
          }
        }) 
      }
    })              
  } catch(error) {
    var returndata = {'CODE':202,'success':'fail','error':error,'data':''}
    res.send(returndata);
  } 

});

router.post('/updatesubscription', subscriptionupload.single('image'), cors(),(req, res) => {

  var userid = req.body.userid;  
  var subscription_id = req.body.id;  
  var pduct = req.body.products;

  //var products = JSON.parse(pduct); 
      
  var subscription_name = req.body.subscription_name;
  var subscription_city = req.body.subscription_city;
  var subs_validity = req.body.subscription_validity;
  var subscription_description = req.body.subscription_description;  

  var dateFuntion = new Date();
  var year = dateFuntion.getFullYear();
  var month = dateFuntion.getMonth()+1;
  var day = dateFuntion.getDate();

  var date = year+'-'+month+'-'+day;     
  
  var status = req.body.status;

  var dateFuntion1 = new Date(subs_validity);
  var year1 = dateFuntion1.getFullYear();
  var month1 = dateFuntion1.getMonth()+1;
  var day1 = dateFuntion1.getDate();

  var subscription_validity = year1+'-'+month1+'-'+day1;


  if(req.file){
    var image = UPLOAD_BASE_URL+'uploads/subscriptions/'+req.file.filename;
    var query1 = "UPDATE `subscriptions` SET `subscription_name`='"+subscription_name+"',`subscription_city`='"+subscription_city+"',`subscription_validity`='"+subscription_validity+"',`subscription_description`='"+subscription_description+"',`subscription_status`='"+status+"',`subscription_image`='"+image+"',`updated_date`='"+date+"', `user_no`='"+userid+"' WHERE subscription_id='"+subscription_id+"'";

  }else{
    var image = ''
    var query1 = "UPDATE `subscriptions` SET `subscription_name`='"+subscription_name+"',`subscription_city`='"+subscription_city+"',`subscription_validity`='"+subscription_validity+"',`subscription_description`='"+subscription_description+"',`subscription_status`='"+status+"', `updated_date`='"+date+"', `user_no`='"+userid+"' WHERE subscription_id='"+subscription_id+"'";
  }

  db_connect.query(query1, (uperr, upresult) => {
    if(uperr){
      var returndata = {'CODE':201,'error':uperr,'success':'fail','data':''}
      res.send(returndata); 
    }else{

      	var returndata = {'CODE':200,'success':'success','data':'success'}
      	res.send(returndata); 
    }

  })  
});


module.exports = router;