var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var router = express.Router();
var bodyParser = require('body-parser');
var db_connect = require('../../database');
var functions = require('../functions');
var crypto = require('crypto');
var cors = require('cors');
var async = require('async');
const http = require("https");

var config = require('../../config');
const TWILIO_ACCOUNT_SID = config.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = config.TWILIO_AUTH_TOKEN;

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);

var USER_ID = 97;
var returndata = [];

var msg91 = require("msg91-api")("256946AnK6ld9n5c3f0c55");
router.get('/testsms', async (req1, res1) => {  

  var mobile = '8968973133'
  var otp = Math.floor(100000 + Math.random() * 900000); 

  const options = {
    "method": "POST",
    "hostname": "api.msg91.com",
    "port": null,
    "path": "/api/v5/flow/",
    "headers": {
      "authkey": "256946AnK6ld9n5c3f0c55",
      "content-type": "application/JSON"
    }
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write("{\n  \"flow_id\": \"61e6af2ea88f140ddc7bedc2\",\n  \"mobiles\": \"91"+mobile+"\",\n  \"otp\": \""+otp+"\"\n}");
  req.end();


  //var send_result = await send_otp();
})

//function send_otp(mobile,otp){
function send_otp(){
  /*var mobileNo = "8968973133";
  var args = {
    "flow_id": "61e6af2ea88f140ddc7bedc2",
    "mobiles": mobileNo, 
    "otp": "562310"
  };

  msg91.sendSMS(args, function(err, response){
    console.log(err);
    console.log(response);
  });*/

  const options = {
    "method": "POST",
    "hostname": "api.msg91.com",
    "port": null,
    "path": "/api/v5/flow/",
    "headers": {
      "authkey": "256946AnK6ld9n5c3f0c55",
      "content-type": "application/JSON"
    }
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write("{\n  \"flow_id\": \"61e6af2ea88f140ddc7bedc2\",\n  \"mobiles\": \"918968973133\",\n  \"otp\": \"102123\"\n}");
  req.end();
}

async function save_otp(mobile){
  //var otp = Math.floor(100000 + Math.random() * 900000); 
  var otp = 123456; 

  var send_result = await send_otp(mobile,otp);

  var query = "DELETE FROM `otp` WHERE `mobile`='"+mobile+"'"
  var send_result = await executeQuery(query);

  var cdate = new Date();
  var ctime = cdate.getTime();
  var exp_date = new Date(ctime + 5*60000).toString();
  
  var exp_date1 = new Date(exp_date);
  var exp_time = exp_date1.getTime();


  var update = "INSERT INTO `otp`(`mobile`, `code`, `expiry_time`) VALUES ('"+mobile+"','"+otp+"','"+exp_time+"')"
  var send_result = await executeQuery(update);

  return true;
}

router.post('/api/otp_verify', async (req, res) => {  
  var mobile = req.body.mobile
  var code = req.body.code

  var cdate = new Date();
  var ctime = cdate.getTime();

  var query = "SELECT * FROM `otp` WHERE `mobile`='"+mobile+"' AND `code`='"+code+"' AND `expiry_time` >= '"+ctime+"'";
  
  db_connect.query(query, (err, results) => {
    if (err) {
      returndata = {'CODE':202,'error':err,'success':'success','data':''}
      res.send(returndata);
    }else{
      if(results !=''){
        returndata = {'CODE':200,'error':'','success':'success','data':''}
        res.send(returndata);
      }else{
        returndata = {'CODE':201,'error':'Code does not match','success':'','data':''}
        res.send(returndata);
      }
    }
  })
});

router.get('/getcity',(req, res) => {
    //var token = req.body.token
    var query = "SELECT * FROM subscription_cities WHERE city_status='1'"
    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.get('/getrecommendedbaskets', async (req, res) => {
  const query = "SELECT * FROM baskets WHERE status='1' and recommended ='1'";
  db_connect.query(query, (err, results) => {
      if (err) {
        var returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{
          var returndata = {'CODE':200,'error':'','success':'success','data':results}
          res.send(returndata);
      }
  })
});

router.get('/getBestSellerBaskets', async (req, res) => {
  const query = "SELECT * FROM baskets WHERE status='1' and best_seller ='1'";
  db_connect.query(query, (err, results) => {
      if (err) {
        var returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{
        var returndata = {'CODE':200,'error':'','success':'success','data':results}
          res.send(returndata);
      }
  })
});

router.get('/getdiscountbaskets', async (req, res) => {
  var discount = "SELECT * FROM basket_discounts WHERE status = '1' ORDER BY `discount` DESC LIMIT 2";

    db_connect.query(discount, (diserr, disresults) => {
      
      if (diserr) {        
        var returndata = {'CODE':201,'error':err4,'success':'success','maincategory':'','recommended':'','best_seller':'','all_baskets':'','discount_baskets':'','subscription':''}
        res.send(returndata);
      }else{
        let arrayOfArrays = [];

        if(disresults != '') {

          async.eachSeries(disresults,function(data,callback){
            let dis_id = data.discount_id
            var query4 = "SELECT baskets.*,basket_discounts.* FROM `baskets` LEFT JOIN basket_discounts ON basket_discounts.discount_id= baskets.basket_discount WHERE baskets.status='1' AND baskets.basket_discount = '"+dis_id+"'"
          
            db_connect.query(query4, (err4, results4) => {
              if (err4) {        
                var returndata = {'CODE':201,'error':err4,'success':'','data':''}
                res.send(returndata);
              }else{  
                if(results4 != ''){
                  arrayOfArrays.push(results4);
                }
                callback()
              }
            })

          }, function(err, netresults) {
            var returndata = {'CODE':200,'error':'','success':'success','data':arrayOfArrays}
            res.send(returndata);
          });
        }

        
      }
    })
});

router.get('/getsearchbaskets',(req, res) => {
    const limit = 5
    const page = req.query.page
    const search = req.query.search
    const customer_id = req.query.customer_id
    const offset = (page - 1) * limit
  
   // const query = "SELECT * FROM baskets WHERE status='1' and basket_name like'%"+search+"%' limit "+limit+" OFFSET "+offset;

    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' and baskets.basket_name like'%"+search+"%' OR baskets.keywords like'%"+search+"%' limit "+limit+" OFFSET "+offset;

    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })    
})

router.get('/getallsubscription',(req, res) => {
    //var token = req.body.token
    var subscription = "SELECT subscriptions.*,subscription_validity.* FROM `subscriptions` LEFT JOIN subscription_validity ON subscription_validity.validity_id=subscriptions.subscription_validity WHERE subscriptions.subscription_status='1' AND subscription_validity.validity_status='1'"
    
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','subscriptions':results}
            res.send(returndata);
        }
    })
});

router.post('/getcategorytypes',(req, res) => {
    //var token = req.body.token
    var query = "SELECT * FROM types WHERE type_status='1'"
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.get('/getbasketcategories',(req, res) => {
    //var token = req.body.token
    var query = "SELECT * FROM basket_categories WHERE basket_category_status='1' AND parent_id != ''"
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getcategorybaskets',(req, res) => {
    //var token = req.body.token
    var catid = req.body.catid
    var customer_id = req.body.customer_id
    var types = req.body.types

    const limit = 20
    const page = req.body.page
    const offset = (page - 1) * limit

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }

      LIKES = "AND ("+LIKES+")";
    }
    
    var category = "AND baskets.basket_category LIKE '%,"+catid+",%'"+LIKES;

    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' "+category
    
    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/login',(req, res) => {
    var username = req.body.username
    var password = req.body.password

    var mobile = username
    
    var query = "SELECT * FROM customer WHERE username='"+username+"' AND password='"+password+"'"
    db_connect.query(query, async(err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
            if(results !=''){
              var send_result = await save_otp(mobile);

                returndata = {'CODE':200,'error':'','success':'success','data':results}
                res.send(returndata);
            }else{
                returndata = {'CODE':201,'error':'Username and password does not match','success':'','data':''}
                res.send(returndata);
            }
        }
    })
});

router.post('/signup',(req, res) => {
    var fullname = req.body.fullname
    var username = req.body.username
    var city = req.body.city
    var password = req.body.password
    
    var query = "SELECT * FROM customer WHERE username='"+username+"'";
   
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':201,'error':err,'success':'','data':''}
          res.send(returndata);
        }else{
            
            if(results.length > 0){
                returndata = {'CODE':202,'error':'Username alleady exist please try new','success':'success','data':''}
                res.send(returndata);
            }else{
                var query1 = "INSERT INTO customer(customer_name, city, username, password, customer_status) VALUES ('"+fullname+"','"+city+"','"+username+"','"+password+"','1')";
                
                db_connect.query(query1, (err1, results1) => {
                    if (err1) {
                      returndata = {'CODE':203,'error':err1,'success':'','data':''}
                      res.send(returndata);
                    }else{
                        returndata = {'CODE':200,'error':'','success':'success','data':results}
                        res.send(returndata);
                    }
                })  
            }
                
        }
    })
});

router.post('/updategoogleuserdetail',(req, res) => {
    var fullname = req.body.fullname
    var username = req.body.username
    var city = req.body.city
    var email = req.body.email
    
    var query = "SELECT * FROM customer WHERE username='"+username+"'";
                      
    /*db_connect.query(query, (gterr, gtresults) => {
      if (gterr) {
        var returndata = {'CODE':203,'error':gterr,'success':'','data':''}
        res.send(returndata);
      }else{
        var returndata = {'CODE':200,'error':'','success':'success','data':gtresults}
        res.send(returndata);
      }
    })*/
   
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':201,'error':err,'success':'','data':''}
          res.send(returndata);
        }else{
            
            if(results.length > 0){
                returndata = {'CODE':202,'error':'Username alleady exist please try new','success':'success','data':''}
                res.send(returndata);
            }else{
                var query1 = "INSERT INTO customer(customer_name, city, username, `email`,customer_status) VALUES ('"+fullname+"','"+city+"','"+username+"','"+email+"','1')";
                
                db_connect.query(query1, (err1, results1) => {
                    if (err1) {
                      returndata = {'CODE':203,'error':err1,'success':'','data':''}
                      res.send(returndata);
                    }else{
                      db_connect.query(query, (gterr, gtresults) => {
                        if (gterr) {
                          var returndata = {'CODE':203,'error':gterr,'success':'','data':''}
                          res.send(returndata);
                        }else{
                          var returndata = {'CODE':200,'error':'','success':'success','data':gtresults}
                          res.send(returndata);
                        }
                      })
                    }
                })  
            }
                
        }
    })
});

router.post('/googleemailexists',(req, res) => {
    var email = req.body.email
    
    var query = "SELECT * FROM customer WHERE email='"+email+"'";
    console.log(query)
                      
    db_connect.query(query, (gterr, gtresults) => {
      if (gterr) {
        var returndata = {'CODE':203,'error':gterr,'success':'','data':''}
        res.send(returndata);
      }else{
        if(gtresults != ''){
          var returndata = {'CODE':200,'error':'','success':'success','data':gtresults}
          res.send(returndata);
        }else{
          var returndata = {'CODE':203,'error':'','success':'','data':''}
          res.send(returndata);
        }
      }
    })
});

function executeQuery(query) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      db_connect.query(query, (err, result) => {
        if(err){
          reject(new Error(err));
        }else{
          resolve(result);
        }

      })
    }, 100);
  }); 
}

router.post('/getallbasketshome', async (req, res) => {
    //var token = req.body.token
    var CODE = 200;
    var error = '';
    var data = '';
    var maincategory = [];
    var recommended = '';
    var best_seller = '';
    var all_baskets = '';
    var customer_id = req.body.customer_id    

    //var main_slider_qry = "SELECT * FROM `app_main_slider` LIMIT 1"
    var main_slider_qry = "SELECT app_main_slider.*,basket_categories.basket_category_id,basket_categories.basket_category_name FROM `app_main_slider` LEFT JOIN basket_categories ON basket_categories.basket_category_id=app_main_slider.basket_category"
    var main_slider = await executeQuery(main_slider_qry);

    var offer_slider_qry = "SELECT app_offer_slider.*,basket_categories.basket_category_id,basket_categories.basket_category_name FROM `app_offer_slider` LEFT JOIN basket_categories ON basket_categories.basket_category_id=app_offer_slider.basket_category WHERE app_offer_slider.status = '1'"
    var offer_slider = await executeQuery(offer_slider_qry);

    var helth_slider_qry = "SELECT * FROM `app_helth_slider` WHERE status='1'"
    var helth_slider = await executeQuery(helth_slider_qry);

    var basketForQuery = "SELECT * FROM basket_for WHERE basket_for_status='1'";
    var basketFor = await executeQuery(basketForQuery);

    //var recomendedbasketQuery = "SELECT * FROM baskets WHERE status='1' AND recommended = '1'";
    var recomendedbasketQuery = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' AND recommended = '1' LIMIT 5"
    var recomended = await executeQuery(recomendedbasketQuery);

    //var bestSellerQuery = "SELECT * FROM baskets WHERE status='1' AND best_seller = '1'";
    var bestSellerQuery = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' AND best_seller = '1' LIMIT 5"
    var bestSeller = await executeQuery(bestSellerQuery);

    //var all_basketsQuery = "SELECT * FROM `baskets` WHERE baskets.status='1'";
    var all_basketsQuery = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' LIMIT 5"
    var all_baskets = await executeQuery(all_basketsQuery);

    var baskt_category = "SELECT * FROM basket_categories WHERE basket_category_status='1' AND parent_id != ''"
    var basket_category = await executeQuery(baskt_category);

    /*var returndata = {'CODE':200,'error':'','success':'success','maincategory':basketFor,'basket_category':basket_category,'recommended':recomended,'best_seller':bestSeller,'all_baskets':all_baskets,'discount_baskets':'arrayOfArrays','subscription':''}
    res.send(returndata);*/

    var discount = "SELECT * FROM basket_discounts WHERE status = '1' ORDER BY `discount` DESC LIMIT 2";

    var disresults = await executeQuery(discount);   

    try { 

      if(disresults != '') {
        var arrayOfArrays = [];
        async.eachSeries(disresults,function(data,callback){

          let dis_id = data.discount_id;
              //var query4 = "SELECT baskets.*,basket_discounts.* FROM `baskets` LEFT JOIN basket_discounts ON basket_discounts.discount_id= baskets.basket_discount WHERE baskets.status='1' AND baskets.basket_discount = '"+dis_id+"'"
          var query4 = "SELECT baskets.*,basket_discounts.*,wishlist.customer_id as wishlist FROM `baskets`LEFT JOIN basket_discounts ON basket_discounts.discount_id= baskets.basket_discount LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' AND baskets.basket_discount = '"+dis_id+"' LIMIT 5"
            
          db_connect.query(query4, (err4, results4) => {
            if (err4) {        
              var returndata = {'CODE':201,'error':err4,'success':'success','maincategory':'','recommended':'','best_seller':'','all_baskets':'','discount_baskets':'','subscription':''}
              res.send(returndata);
            }else{  
              if(results4 != ''){
                arrayOfArrays.push(results4);
              }
              callback()
            }
          })
        }, function(err, netresults) {
          var returndata = {'CODE':200,'error':'','success':'success','main_slider':main_slider,'offer_slider':offer_slider,'helth_slider':helth_slider,'maincategory':basketFor,'basket_category':basket_category,'recommended':recomended,'best_seller':bestSeller,'all_baskets':all_baskets,'discount_baskets':arrayOfArrays,'subscription':''}
          res.send(returndata);
        });
      }
    }catch(e){

      console.log('Errr : ',e.message)
      var returndata = {'CODE':202,'error':e.message,'success':'success','data':''}
      res.send(returndata);
    }        
});

/*
router.post('/getallbasketshome', async (req, res) => {
    //var token = req.body.token
    var CODE = 200;
    var error = '';
    var data = '';
    var maincategory = [];
    var recommended = '';
    var best_seller = '';
    var all_baskets = '';
    var customer_id = req.body.customer_id
    

    var basketForQuery = "SELECT * FROM basket_for WHERE basket_for_status='1'";
    var basketFor = await executeQuery(basketForQuery);

    var recomendedbasketQuery = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' AND recommended = '1'"
    var recomended = await executeQuery(recomendedbasketQuery);


    //var bestSellerQuery = "SELECT * FROM baskets WHERE status='1' AND best_seller = '1'";
    var bestSellerQuery = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' AND best_seller = '1'"
    var bestSeller = await executeQuery(bestSellerQuery);

    var baskt_category = "SELECT * FROM basket_categories WHERE basket_category_status='1' AND parent_id != ''"
    var basket_category = await executeQuery(baskt_category);

    var discounted_qry = "SELECT baskets.*,basket_discounts.*,wishlist.customer_id as wishlist FROM `baskets`LEFT JOIN basket_discounts ON basket_discounts.discount_id= baskets.basket_discount LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' AND basket_discounts.status = '1' ORDER BY basket_discounts.discount DESC LIMIT 5";

    var discounted = await executeQuery(discounted_qry);

    var returndata = {'CODE':200,'error':'','success':'success','maincategory':basketFor,'basket_category':basket_category,'recommended':recomended,'best_seller':bestSeller,'all_baskets':'','discount_baskets':discounted,'subscription':''}
    res.send(returndata);
        
});*/

router.post('/getbasketproducts',(req, res) => {
  var id = req.body.id
  var token = req.body.token
  
  var query = "SELECT * FROM `basket_products` WHERE `basket_id`='"+id+"' "
  db_connect.query(query, (err, results) => {
    if (err) {
      var returndata = {'CODE':202,'error':err,'success':'success','data':''}
      res.send(returndata);
    }else{
         var returndata = {'CODE':200,'error':'','success':'success','data':results}
        res.send(returndata);
    }
  })
});

router.post('/getbasketforcategory',(req, res) => {
    //var token = req.body.token
    var for_id = req.body.id
    if(for_id != ''){
      var FIND_IN_SET = ''
      var FIND_IN_SET_DISCNT = ''
      for (var i = 0; i < for_id.length; i++) {
        if(i == '0'){
          FIND_IN_SET = "AND FIND_IN_SET('"+for_id[i]+"', basket_for)"
        }else{
          FIND_IN_SET = FIND_IN_SET+" OR FIND_IN_SET('"+for_id[i]+"', basket_for)"
        }
      }

      for (var i = 0; i < for_id.length; i++) {
        if(i == '0'){
          FIND_IN_SET_DISCNT = "AND FIND_IN_SET('"+for_id[i]+"', baskets.basket_for)"
        }else{
          FIND_IN_SET_DISCNT = FIND_IN_SET_DISCNT+" OR FIND_IN_SET('"+for_id[i]+"', baskets.basket_for)"
        }
      }
          
    }

    var CODE = 200;
    var error = '';
    var data = '';
    var maincategory = [];
    var recommended = '';
    var best_seller = '';
    var all_baskets = '';
    
    var query1 = "SELECT * FROM baskets WHERE in_active='1' AND recommended = '1' "+FIND_IN_SET+""
    

    db_connect.query(query1, (err1, results1) => {
      if (err1) {            
        var returndata = {'CODE':201,'error':err1,'success':'success','maincategory':'','recommended':'','best_seller':'','all_baskets':'','discount_baskets':'','subscription':''}
        res.send(returndata);
      }else{
        var query2 = "SELECT * FROM baskets WHERE in_active='1' AND best_seller = '1' "+FIND_IN_SET+""
        db_connect.query(query2, (err2, results2) => {
          if (err2) {          
            var returndata = {'CODE':201,'error':err2,'success':'success','maincategory':'','recommended':'','best_seller':'','all_baskets':'','discount_baskets':'','subscription':''}
            res.send(returndata);
          }else{
            var query3 = "SELECT * FROM baskets WHERE in_active='1' "+FIND_IN_SET+""
            db_connect.query(query3, (err3, results3) => {
              if (err3) {        
                var returndata = {'CODE':201,'error':err3,'success':'success','maincategory':'','recommended':'','best_seller':'','all_baskets':'','discount_baskets':'','subscription':''}
                res.send(returndata);
              }else{  

                var query4 = "SELECT * FROM `baskets` WHERE in_active='1' "+FIND_IN_SET+""
               

                /*db_connect.query(discount, (diserr, disresults) => {
                  if (diserr) {        
                    var returndata = {'CODE':201,'error':err4,'success':'success','maincategory':'','recommended':'','best_seller':'','all_baskets':'','discount_baskets':'','subscription':''}
                    res.send(returndata);
                  }else{
                    let arrayOfArrays = [];

                    if(disresults != '') {

                      async.eachSeries(disresults,function(data,callback){
                       
                        let dis_id = data.discount_id

                        var query4 = "SELECT baskets.*,basket_discounts.* FROM `baskets` LEFT JOIN basket_discounts ON basket_discounts.discount_id= baskets.basket_discount WHERE baskets.in_active='1' AND baskets.basket_discount = '"+dis_id+"'"
                      
                        db_connect.query(query4, (err4, results4) => {
                          if (err4) {        
                            var returndata = {'CODE':201,'error':err4,'success':'success','maincategory':'','recommended':'','best_seller':'','all_baskets':'','discount_baskets':'','subscription':''}
                            res.send(returndata);
                          }else{  
                            if(results4 != ''){
                              arrayOfArrays.push(results4);
                            }
                            callback()
                          }
                        })
                      }, function(err, netresults) {
                        var returndata = {'CODE':200,'error':'','success':'success','recommended':results1,'best_seller':results2,'all_baskets':results3,'discount_baskets':arrayOfArrays}
                        res.send(returndata);
                      });
                    }                    
                  }
                })*/
                  
              }
            })           
          }
        })            
      }
    })
});

router.post('/getmainsinglecategorybaskets',(req, res) => {
    //var token = req.body.token
    var maincatid = req.body.maincatid
    var customer_id = req.body.customer_id
    var types = req.body.types

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }

      LIKES = "AND ("+LIKES+")";
    }
    
    var category = "AND basket_for='"+maincatid+"'"+LIKES;


    //var query = "SELECT * FROM baskets WHERE status='1' "+category
    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='1' WHERE status='1' "+category
    
    
    db_connect.query(query, (err, results) => {
      if (err) {
        var returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{
           var returndata = {'CODE':200,'error':'','success':'success','data':results}
          res.send(returndata);
      }
    })
});

router.post('/getfilteredtypesbaskets',(req, res) => {
    //var token = req.body.token
    var maincatid = req.body.maincatid
    var ids = req.body.ids
    if(ids != ''){
      var FIND_IN_SET = ''
      var FIND_IN_SET_DISCNT = ''
      for (var i = 0; i < ids.length; i++) {
        if(i == '0'){
          FIND_IN_SET = "AND FIND_IN_SET('"+ids[i]+"', basket_type)"
        }else{
          FIND_IN_SET = FIND_IN_SET+" OR FIND_IN_SET('"+ids[i]+"', basket_type)"
        }
      }
    }

    var category = "AND FIND_IN_SET('"+maincatid+"',basket_for)"

    var query = "SELECT * FROM baskets WHERE in_active='1' "+FIND_IN_SET+" "+category+""
    db_connect.query(query, (err, results) => {
      if (err) {
        var returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{
           var returndata = {'CODE':200,'error':'','success':'success','data':results}
          res.send(returndata);
      }
    })
});

router.post('/getcustomeraddresses',(req, res) => {
    //var token = req.body.token
    var customer_id = req.body.customer_id
    var query = "SELECT * FROM customers_address WHERE customer_id='"+customer_id+"'"
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/orderplace',async (req, res) => {

  await db_connect.beginTransaction();
  var newOrederNo = '';
  try{
      
    /*var returndata = {'CODE':200,'error':'','success':'success','data':'1'}
    res.send(returndata);*/
    
    //var token = req.body.token
    var customer_id = req.body.customer_id
    var payment_method = req.body.payment_method
    var total_amount_paid = req.body.total_amount_paid
    var delivery_address = req.body.delivery_address
    var delivery_name = req.body.delivery_name
    var delivery_mobile = req.body.delivery_mobile
    var delivery_city = req.body.delivery_city
    var delivery_pincode = req.body.delivery_pincode
    var sub_total = req.body.sub_total
    var delivery_fee = req.body.delivery_fee

    var items = req.body.items
    var total_item = req.body.total_item
    
    var dateFuntion = new Date();
    var year = dateFuntion.getFullYear();
    var month = dateFuntion.getMonth()+1;
    var day = dateFuntion.getDate();

    if(month < 10){
      month = '0'+month;
    }

    if(day < 10){
      day = '0'+day;
    }

    var date = year+'-'+month+'-'+day;

    var order1 = "INSERT INTO `order_master`(`customer_id`, `payment_method`, `sub_total`, `total_amount_paid`, `total_items`, `delivery_chages`, `delivery_address`, `delivery_name`, `delivery_mobile_no`, `delivery_city`, `delivery_pincode`, `create_date`, `order_master_status`) VALUES ('"+customer_id+"','"+payment_method+"','"+sub_total+"','"+total_amount_paid+"','"+total_item+"','"+delivery_fee+"','"+delivery_address+"','"+delivery_name+"','"+delivery_mobile+"','"+delivery_city+"','"+delivery_pincode+"','"+date+"','1')";
    

    db_connect.query(order1, async (err, results) => {
      if (err) {
        //db_connect.rollback();
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{
        var order_no = results.insertId;
        newOrederNo = order_no;
        
        await insert_order_details(order_no,items);

        var returndata = {'CODE':200,'error':'','success':'success','data':newOrederNo}
        res.send(returndata);

      }
    })

    await db_connect.commit();

  }catch(e){
    db_connect.rollback();
    returndata = {'CODE':202,'error':err.message,'success':'success','data':''}
    res.send(returndata);
  }
});

async function insert_order_details(order_no,data) {
  for (let i=0; i<data.length; i++){

    var basket_id = data[i].basket_id;
    var quantity = data[i].quantity;
    var order2 = "INSERT INTO `order_details`(`order_no`, `item_id`, `quantity`, `order_detail_status`) VALUES ('"+order_no+"','"+basket_id+"','"+quantity+"','0')";
    await executeNewQuery(order2);

    var baskt_q = "SELECT * FROM `baskets` WHERE `basket_id`='"+basket_id+"'";
    var basdata = await executeNewQuery(baskt_q);

    // Insert basket detail of order no.  
    var insertBasktData = "INSERT INTO `order_baskets`(`order_no`, `basket_id`, `basket_product_id`, `basket_name`, `basket_category`, `basket_company_cost`, `basket_sale_price`, `actual_price`, `discount_price`, `basket_weight`, `basket_weight_in_kg`, `basket_weight_in_gm`, `basket_sku_code`, `basket_for`, `basket_type`, `basket_discount`, `basket_description`, `status`, `basket_image`, `total_products`, `total_price`, `total_weight`, `recommended`, `best_seller`) VALUES ('"+order_no+"','"+basdata[0].basket_id+"','"+basdata[0].basket_product_id+"','"+basdata[0].basket_name+"','"+basdata[0].basket_category+"','"+basdata[0].basket_company_cost+"','"+basdata[0].basket_sale_price+"','"+basdata[0].actual_price+"','"+basdata[0].discount_price+"','"+basdata[0].basket_weight+"','"+basdata[0].basket_weight_in_kg+"','"+basdata[0].basket_weight_in_gm+"','"+basdata[0].basket_sku_code+"','"+basdata[0].basket_for+"','"+basdata[0].basket_type+"','"+basdata[0].basket_discount+"','"+basdata[0].basket_description+"','"+basdata[0].status+"','"+basdata[0].basket_image+"','"+basdata[0].total_products+"','"+basdata[0].total_price+"','"+basdata[0].total_weight+"','"+basdata[0].recommended+"','"+basdata[0].best_seller+"')";

    var basktdetdata = await executeNewQuery(insertBasktData);

    var baskt_prodcts = "SELECT * FROM `basket_products` WHERE `basket_id`='"+basket_id+"'";
    var pdata = await executeNewQuery(baskt_prodcts);

    

    for (let j=0; j<pdata.length; j++){
      var order3 = "INSERT INTO `order_products_detail`(`order_no`, `basket_id`, `product_id`, `product_name`, `product_image`, `product_description`, `product_weight`, `product_price`, `product_category`, `product_type`, `product_price_type`) VALUES ('"+order_no+"','"+pdata[j].basket_id+"','"+pdata[j].product_id+"','"+pdata[j].product_name+"','"+pdata[j].product_image+"','"+pdata[j].product_description+"','"+pdata[j].product_weight+"','"+pdata[j].product_price+"','"+pdata[j].product_category+"','"+pdata[j].product_type+"','"+pdata[j].product_price_type+"')";
      await executeNewQuery(order3);

    }
  }
}


function executeNewQuery(query) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      db_connect.query(query, (err, result) => {
        if(err){
          reject(new Error(err));
          db_connect.rollback();
          var returndata = {'CODE':202,'error':err,'success':'success','data':''}
          return returndata;

        }else{
          resolve(result);
        }

      })
    }, 100);
  }); 
}

router.post('/getcustomerrunningorders',(req, res) => {
    //var token = req.body.token
    var customer_id = req.body.customer_id
    var query = "SELECT order_master.*,order_status_master.name FROM order_master LEFT JOIN order_status_master on order_status_master.id=order_master.order_master_status WHERE order_master.customer_id='"+customer_id+"' AND order_master.order_master_status !='2' order by order_master.order_no DESC"
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getcustomercompletedorders',(req, res) => {
    //var token = req.body.token
    var customer_id = req.body.customer_id
    var query = "SELECT * FROM order_master WHERE customer_id='"+customer_id+"' AND order_master_status='2' order by order_master.order_no DESC"
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getcustomerorderdetail',(req, res) => {
    //var token = req.body.token
    var customer_id = req.body.customer_id
    var order_no = req.body.order_no
    
    //var query = "SELECT order_master.*,order_details.*,order_baskets.* FROM order_master LEFT JOIN order_details ON order_details.order_no = order_master.order_no LEFT JOIN order_baskets on order_baskets.basket_id=order_details.item_id WHERE order_master.order_no='"+order_no+"' AND order_master.customer_id='"+customer_id+"'"
    
    var query = "SELECT order_master.*,order_details.*,order_baskets.* FROM `order_master` LEFT JOIN order_details on order_details.order_no=order_master.order_no INNER JOIN order_baskets ON order_baskets.basket_id=order_details.item_id AND  order_baskets.order_no='"+order_no+"' WHERE order_master.order_no='"+order_no+"' AND order_master.customer_id='"+customer_id+"'"
    
    
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
            returndata = {'CODE':200,'error':'','success':'success','data':results,'order_no':results[0].order_no,'total_items':results[0].total_items,'total_amount_paid':results[0].total_amount_paid}
            res.send(returndata);
        }
    })
});

router.post('/savecustomeraddressfororder',(req, res) => {
    //var token = req.body.token
    var customer_id = req.body.customer_id
    var full_name = req.body. full_name
    var mobile_no = req.body.mobile_no
    var city = req.body.city
    var address = req.body.address 
    var pincode = req.body.pincode
    var query = "INSERT INTO `customers_address`(`customer_id`, `full_name`, `mobile_no`, `city`, `address`, `pincode`, `default_address`) VALUES ('"+customer_id+"','"+full_name+"','"+mobile_no+"','"+city+"','"+address+"','"+pincode+"','0')"
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getbasketdetails',(req, res) => {
    //var token = req.body.token
    var customer_id = req.body.customer_id
    var basket_id = req.body.basket_id
    var query = "SELECT baskets.*,wishlist.customer_id as wishlist,basket_discounts.discount FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' LEFT JOIN basket_discounts on basket_discounts.discount_id=baskets.basket_discount WHERE baskets.basket_id='"+basket_id+"'";

    db_connect.query(query, (err, baskets) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
          var query1 = "SELECT * FROM `basket_products` WHERE basket_id='"+basket_id+"'";
          db_connect.query(query1, (err1, products) => {
            if (err1) {
              returndata = {'CODE':202,'error':err1,'success':'success','data':''}
              res.send(returndata);
            }else{         

              returndata = {'CODE':200,'error':'','success':'success','baskets':baskets,'products':products}
              res.send(returndata);
            }
          })
        }
    })
});

router.post('/addintowishlist',(req, res) => {
    //var token = req.body.token
    var basket_id = req.body.basket_id
    var customer_id = req.body.customer_id

    var dateFuntion = new Date();
    var year = dateFuntion.getFullYear();
    var month = dateFuntion.getMonth()+1;
    var day = dateFuntion.getDate();

    var date = year+'-'+month+'-'+day;

    var selectQ = "SELECT * FROM `wishlist` WHERE `basket_id`='"+basket_id+"' AND `customer_id`='"+customer_id+"'";
    db_connect.query(selectQ, (erro, resbas) => {
      if (erro) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{ 
        if (resbas != '') {
          returndata = {'CODE':200,'error':'','success':'success'}
          res.send(returndata);
        }else{
          var query = "INSERT INTO `wishlist`(`basket_id`, `customer_id`, `create_date`) VALUES ('"+basket_id+"','"+customer_id+"','"+date+"')";
          db_connect.query(query, (err, baskets) => {
              if (err) {
                returndata = {'CODE':202,'error':err,'success':'success','data':''}
                res.send(returndata);
              }else{     

                returndata = {'CODE':200,'error':'','success':'success'}
                res.send(returndata);

              }
          })
        }          
      }
    })
});

router.post('/removefromwishlist',(req, res) => {
    //var token = req.body.token
    var basket_id = req.body.basket_id
    var customer_id = req.body.customer_id


    var selectQ = "DELETE FROM `wishlist` WHERE `basket_id`='"+basket_id+"' AND `customer_id`='"+customer_id+"'";
    
    db_connect.query(selectQ, (erro, resbas) => {
      if (erro) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{ 
          returndata = {'CODE':200,'error':'','success':'success'}
          res.send(returndata);
                
      }
    })
});

router.post('/getwishlistbaskets',(req, res) => {
    //var token = req.body.token
    var customer_id = req.body.customer_id

    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' AND wishlist.customer_id='"+customer_id+"'"
    
    db_connect.query(query, (erro, resbas) => {
      if (erro) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{ 
          returndata = {'CODE':200,'error':'','success':'success','data':resbas}
          res.send(returndata);
                
      }
    })
});

router.post('/gettopseller',(req, res) => {
    //var token = req.body.token
    var catid = req.body.catid
    var customer_id = req.body.customer_id
    var types = req.body.types

    const limit = 500
    const page = req.body.page
    const offset = (page - 1) * limit

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }

      LIKES = "AND ("+LIKES+")";
    }
    
    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' and baskets.recommended='1'"+LIKES
    
    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getalldiscountbasket',(req, res) => {
    //var token = req.body.token
    var catid = req.body.catid
    var customer_id = req.body.customer_id
    var types = req.body.types

    const limit = 500
    const page = req.body.page
    const offset = (page - 1) * limit

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }

      LIKES = "AND ("+LIKES+")";
    }

    var discounted_qry = "SELECT baskets.*,basket_discounts.*,wishlist.customer_id as wishlist FROM `baskets`LEFT JOIN basket_discounts ON basket_discounts.discount_id= baskets.basket_discount LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' AND basket_discounts.status = '1' "+LIKES+" ORDER BY basket_discounts.discount DESC";
    
    db_connect.query(discounted_qry, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getallactivetypes',(req, res) => {
    //var token = req.body.token
    var query = "SELECT * FROM types WHERE type_status='1'"
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getallrecommended',(req, res) => {
    //var token = req.body.token
    var catid = req.body.catid
    var customer_id = req.body.customer_id
    var types = req.body.types

    const limit = 500
    const page = req.body.page
    const offset = (page - 1) * limit

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }

      LIKES = "AND ("+LIKES+")";
    }
    
    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' and baskets.recommended='1'"+LIKES
    
    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getallbestseller',(req, res) => {
    //var token = req.body.token
    var catid = req.body.catid
    var customer_id = req.body.customer_id
    var types = req.body.types

    const limit = 500
    const page = req.body.page
    const offset = (page - 1) * limit

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }

      LIKES = "AND ("+LIKES+")";
    }
    
    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' and baskets.best_seller='1'"+LIKES
    
    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/gettopseller',(req, res) => {
    //var token = req.body.token
    var catid = req.body.catid
    var customer_id = req.body.customer_id
    var types = req.body.types

    const limit = 500
    const page = req.body.page
    const offset = (page - 1) * limit

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }

      LIKES = "AND ("+LIKES+")";
    }
    
    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' and baskets.recommended='1'"+LIKES
    
    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getallsingleboxes',(req, res) => {
    //var token = req.body.token
    var catid = req.body.catid
    var customer_id = req.body.customer_id
    var types = req.body.types

    const limit = 500
    const page = req.body.page
    const offset = (page - 1) * limit

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }

      LIKES = "AND ("+LIKES+")";
    }
    
    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.status='1' "+LIKES
    
    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});

router.post('/getdiscntbaskets',(req, res) => {
    //var token = req.body.token
    var catid = req.body.catid
    var discount_id = req.body.discount_id
    var customer_id = req.body.customer_id
    var types = req.body.types

    const limit = 500
    const page = req.body.page
    const offset = (page - 1) * limit

    var LIKES = ''
    if(types != ''){
      for (var i = 0; i < types.length; i++) {
        if(i == '0'){
          LIKES = "baskets.basket_type LIKE '%,"+types[i]+",%'"
        }else{
          LIKES = LIKES+" OR baskets.basket_type LIKE '%,"+types[i]+",%'"
        }
      }
      LIKES = "AND ("+LIKES+")";
    }
    
    var query = "SELECT baskets.*,wishlist.customer_id as wishlist FROM `baskets` LEFT JOIN wishlist ON wishlist.basket_id=baskets.basket_id AND wishlist.customer_id='"+customer_id+"' WHERE baskets.basket_discount="+discount_id+" AND baskets.status='1' "+LIKES
    
    db_connect.query(query, (err, results) => {
        if (err) {
           returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
             returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);
        }
    })
});
/*
router.get('/getallappsliders',(req, res) => {
    //var token = req.body.token
    var mainsliderqry = "SELECT * FROM `app_main_slider` LIMIT 1";

    db_connect.query(mainsliderqry, (err, results) => {
      if (err) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{
        var offersliderqry = "SELECT * FROM `app_offer_slider`";
        db_connect.query(offersliderqry, (err1, results1) => {
          if (err) {
            returndata = {'CODE':202,'error':err,'success':'success','data':''}
            res.send(returndata);
          }else{       

            returndata = {'CODE':200,'error':'','success':'success','main_slider':results,'offer_slider':results1}
            res.send(returndata);
          }
        })
      }
    })
});*/


module.exports = router;