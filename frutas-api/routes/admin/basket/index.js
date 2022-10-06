var express = require('express');
var fs = require('fs');
const mysql = require('mysql');
var router = express.Router();
var db_connect = require('../../../database');
var cors = require('cors');

var multer  = require('multer');

const bcrypt = require('bcrypt');

var config = require('../../../config');
const base_url = config.BASE_URL;
const UPLOAD_BASE_URL = config.UPLOAD_BASE_URL;

const saltRounds = 10;
const myPlaintextPassword = '1234';



router.use(cors());

const basketstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/baskets/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var basketupload = multer({ storage: basketstorage });

const basketcatstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/basket_category/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var basketcatupload = multer({ storage: basketcatstorage });

router.get('/getAllPageignationBaskets', function(req, res, next) {
	const Query = "SELECT baskets.*,case when baskets.status > 0 then 'Active' else 'In-Active' end as status,basket_categories.*,basket_for.*,types.*,GROUP_CONCAT(DISTINCT  basket_categories.basket_category_name) AS cat_names,GROUP_CONCAT(DISTINCT types.type_name) as type_names,GROUP_CONCAT(DISTINCT  basket_for.basket_for_name) AS baskt_for from baskets RIGHT JOIN basket_categories ON find_in_set(basket_categories.basket_category_id,baskets.basket_category) >0  INNER JOIN basket_for ON find_in_set(basket_for.basket_for_id,baskets.basket_for) > 0 LEFT JOIN types ON find_in_set(types.type_id,baskets.basket_type) > 0 WHERE baskets.basket_id !='' GROUP BY baskets.basket_id order by baskets.basket_id DESC";

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

router.get('/getAllActiveBaskets', function(req, res, next) {
	const Query = "SELECT baskets.*,basket_id as id, basket_sale_price as price,basket_discounts.discount_name, basket_for.basket_for_name FROM baskets LEFT JOIN basket_discounts ON basket_discounts.discount_id = baskets.basket_discount LEFT JOIN basket_for ON basket_for.basket_for_id = baskets.basket_for WHERE baskets.status ='1'";

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

router.get('/getAllActiveBasketsForCongigure', function(req, res, next) {
  const Query = "SELECT baskets.*,baskets.basket_id as basketid, basket_sale_price as price,basket_discounts.discount_name, basket_for.basket_for_name,case when isnull(configured_plans.id) then 'Pending' else 'Configured' end as configured ,configured_plans.basket_id,GROUP_CONCAT(DISTINCT  basket_for.basket_for_name) AS baskt_for FROM baskets LEFT JOIN basket_discounts ON basket_discounts.discount_id = baskets.basket_discount INNER JOIN basket_for ON find_in_set(basket_for.basket_for_id,baskets.basket_for) > 0 LEFT JOIN configured_plans ON configured_plans.basket_id=baskets.basket_id WHERE baskets.status ='1' GROUP BY baskets.basket_id";

  db_connect.query(Query, function (error, results, fields) {
    if (error){
            var returndata = {'CODE':201,'error':error,'success':'fail','data':''}
            res.send(returndata);
        }else{
          var returndata = {'CODE':200,'error':'','success':'success','products':results}
            res.send(returndata); 
        }

  })
})

router.get('/searchAllActiveBaskets', function(req, res, next) {
	const search = req.query.search

	const Query = "SELECT baskets.*,basket_id as id, basket_sale_price as price,basket_discounts.discount_name, basket_for.basket_for_name FROM baskets LEFT JOIN basket_discounts ON basket_discounts.discount_id = baskets.basket_discount LEFT JOIN basket_for ON basket_for.basket_for_id = baskets.basket_for WHERE baskets.status ='1' AND baskets.basket_name LIKE '%"+search+"%'";

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

router.get('/getBasketsIntoSubscription', function(req, res, next) {
  const id = req.query.id

  const prodsQuery = "SELECT baskets.*,configured_plans.*,basket_for.basket_for_name,basket_discounts.discount_name FROM baskets LEFT JOIN configured_plans ON configured_plans.basket_id=baskets.basket_id LEFT JOIN basket_for ON basket_for.basket_for_id = baskets.basket_for LEFT JOIN basket_discounts ON basket_discounts.discount_id = baskets.basket_discount WHERE configured_plans.subscription_id='"+id+"' AND baskets.status ='1' GROUP BY configured_plans.basket_id";

  db_connect.query(prodsQuery, function (error, results, fields) {
    if (error){
            var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
            res.send(returndata);
        }else{
          var returndata = {'CODE':200,'error':'','success':'success','products':results}
            res.send(returndata); 
        }

  })
})


router.post('/addnewbasket', basketupload.single('basket_image'), cors(),(req, res) => {
  var basket_sku_code = req.body.basket_sku_code;
  
  var user_id = req.body.user_id
  var pduct = req.body.products;


  var products = JSON.parse(pduct);

  db_connect.query("SELECT * FROM baskets WHERE basket_sku_code = '"+basket_sku_code+"'", (err0, resultss) => {
    if(err0){
      var returndata = {'CODE':201,'error':err0,'success':'fail','data':''}
      res.send(returndata);
    }else{ 
      if(resultss != ''){   
        var returndata = {'CODE':201,'error':err0,'success':'fail','data':'Duplicate SKU'}
        res.send(returndata);
      }else{  
        var basket_name = req.body.basket_name;
        var basket_categoty = req.body.basket_categoty;
        var basket_company_cost = req.body.basket_company_cost;
        var basket_sale_price = req.body.basket_sale_price;
        var basket_weight = req.body.basket_weight;
        var basket_weight_in_kg = req.body.basket_weight_in_kg;
        var basket_weight_in_gm = req.body.basket_weight_in_gm;
        var basket_for = req.body.basket_for;
        var basket_type = req.body.basket_type;
        var basket_discount = req.body.basket_discount;
        var recommended = req.body.recommended;       
        var best_seller = req.body.best_seller;  
        var basket_description = req.body.basket_description;
        var status = req.body.status;
        var basket_image = UPLOAD_BASE_URL+'uploads/baskets/'+req.file.filename;

        var keywords = req.body.keywords;
        var total_products = req.body.total_products;
        var total_price = req.body.total_price;
        var total_weight = req.body.total_weight;                  
        var total_weight_in_kg = req.body.total_weight_in_kg;                    
        var total_weight_in_gm = req.body.total_weight_in_gm;                     
        var actual_price = req.body.actual_price;                    
        var discount_price = req.body.discount_price;                    

        var dateFuntion = new Date();
        var year = dateFuntion.getFullYear();
        var month = dateFuntion.getMonth()+1;
        var day = dateFuntion.getDate();

        var date = year+'-'+month+'-'+day; 

        var query1 = "INSERT INTO `baskets`(`basket_name`, `basket_category`, `basket_company_cost`, `basket_sale_price`,`actual_price`,`discount_price`, `basket_weight`, `basket_weight_in_kg`, `basket_weight_in_gm`, `basket_sku_code`, `basket_for`, `basket_type`, `basket_discount`, `keywords`,`basket_description`, `status`, `basket_image`, `total_products`, `total_price`, `total_weight`, `total_weight_in_kg`, `total_weight_in_gm`, `recommended`, `best_seller`, `created_date`, `updated_date`,`user_no`) VALUES ('"+basket_name+"','"+basket_categoty+"','"+basket_company_cost+"','"+basket_sale_price+"','"+actual_price+"','"+discount_price+"','"+basket_weight+"','"+basket_weight_in_kg+"','"+basket_weight_in_gm+"','"+basket_sku_code+"','"+basket_for+"','"+basket_type+"','"+basket_discount+"','"+keywords+"','"+basket_description+"','"+status+"','"+basket_image+"','"+total_products+"','"+total_price+"','"+total_weight+"','"+total_weight_in_kg+"','"+total_weight_in_gm+"','"+recommended+"','"+best_seller+"','"+date+"','"+date+"','"+user_id+"')";


        db_connect.query(query1, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':err}
            res.send(returndata); 
          }else{
            var query1 = "INSERT INTO `baskets_history`(`basket_name`, `basket_category`, `basket_company_cost`, `basket_sale_price`,`actual_price`,`discount_price`, `basket_weight`, `basket_weight_in_kg`, `basket_weight_in_gm`, `basket_sku_code`, `basket_for`, `basket_type`, `basket_discount`, `basket_description`, `status`, `basket_image`, `total_products`, `total_price`, `total_weight`, `total_weight_in_kg`, `total_weight_in_gm`, `recommended`, `best_seller`, `created_date`, `updated_date`,`user_no`) VALUES ('"+basket_name+"','"+basket_categoty+"','"+basket_company_cost+"','"+basket_sale_price+"','"+actual_price+"','"+discount_price+"','"+basket_weight+"','"+basket_weight_in_kg+"','"+basket_weight_in_gm+"','"+basket_sku_code+"','"+basket_for+"','"+basket_type+"','"+basket_discount+"','"+basket_description+"','"+status+"','"+basket_image+"','"+total_products+"','"+total_price+"','"+total_weight+"','"+total_weight_in_kg+"','"+total_weight_in_gm+"','"+recommended+"','"+best_seller+"','"+date+"','"+date+"','"+user_id+"')";

            db_connect.query(query1, (errs, resultss) => {
              if(errs){
                var returndata = {'CODE':201,'error':errs,'success':'fail','data':errs}
                res.send(returndata); 
              }else{
                  var basket_id = results.insertId;

                  for (var i = 0; i < products.length; i++) {
                    
                    var product_id = products[i].product_id;
                    var product_name = products[i].product_name;
                    var product_image = products[i].product_image;
                    var product_description = products[i].product_description;
                    var product_weight = products[i].product_weight;
                    var weight_in_kg = products[i].weight_in_kg;
                    var weight_in_gm = products[i].weight_in_gm;
                    var product_price = products[i].product_price;
                    var product_category = products[i].product_category;
                    var product_type = products[i].product_type;
                    var product_price_type = products[i].product_price_type;
                    var quantity = products[i].quantity;
                    var itemTotal = products[i].itemTotal;

                    var query2 = "INSERT INTO `basket_products`(`basket_id`, `basket_product_no`, `product_id`, `product_name`, `product_image`, `product_description`, `product_weight`, `weight_in_kg`, `weight_in_gm`, `product_price`, `product_category`, `product_type`, `product_price_type`, `quantity`, `product_total`,`user_no`) VALUES ('"+basket_id+"','"+basket_id+"','"+product_id+"','"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+weight_in_kg+"','"+weight_in_gm+"','"+product_price+"','"+product_category+"','"+product_type+"','"+product_price_type+"','"+quantity+"','"+itemTotal+"','"+user_id+"')";

                    db_connect.query(query2, (err2, results2) => {
                      if(err2){
                        var returndata = {'CODE':201,'success':'fail','data':err2}
                        res.send(returndata); 
                      }else{
                        var query2 = "INSERT INTO `basket_products_history`(`basket_id`, `basket_product_no`, `product_id`, `product_name`, `product_image`, `product_description`, `product_weight`, `weight_in_kg`, `weight_in_gm`, `product_price`, `product_category`, `product_type`, `product_price_type`, `quantity`, `product_total`,`user_no`) VALUES ('"+basket_id+"','"+basket_id+"','"+product_id+"','"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+weight_in_kg+"','"+weight_in_gm+"','"+product_price+"','"+product_category+"','"+product_type+"','"+product_price_type+"','"+quantity+"','"+itemTotal+"','"+user_id+"')";

                        db_connect.query(query2, (err2, results2) => {
                          if(err2){
                            var returndata = {'CODE':201,'success':'fail','data':err2}
                            res.send(returndata); 
                          }else{

                          }

                        })


                      }
                    })        
                  }

                  var query3 = "UPDATE `baskets` SET `basket_product_id`='"+basket_id+"' WHERE `basket_id`='"+basket_id+"'";

                  db_connect.query(query3, (err3, results3) => {
                    if(err3){
                      var returndata = {'CODE':201,'success':'fail','data':err3}
                      res.send(returndata); 
                    }else{
                      var returndata = {'CODE':200,'success':'success','data':results}
                      res.send(returndata); 
                    }
                  })
                }
              })
            }
          
        });
      }
    }
  })
});


router.post('/updatebasket', basketupload.single('basket_image'), cors(),async(req, res) => {
  var user_id = req.body.user_id
  var basket_id = req.body.basket_id

  var basket_sku_code = req.body.basket_sku_code;
  var pduct = req.body.products;

  var products = JSON.parse(pduct);

  var skucheck = "SELECT * FROM baskets WHERE basket_sku_code = '"+basket_sku_code+"' AND basket_id !='"+basket_id+"'"
  //var checkResult = executeQuery(skucheck);
  
    var checkCdoe = await checkSKUcode(basket_sku_code,basket_id);
    if(checkCdoe != ''){
      var returndata = {'CODE':201,'error':'Duplicate SKU Code','success':'fail','data':''}
      res.send(returndata);
    }else{
      var basket_name = req.body.basket_name;
        var basket_categoty = req.body.basket_categoty;
        var basket_company_cost = req.body.basket_company_cost;
        var basket_sale_price = req.body.basket_sale_price;
        var basket_weight = req.body.basket_weight;
        var basket_weight_in_kg = req.body.basket_weight_in_kg;
        var basket_weight_in_gm = req.body.basket_weight_in_gm;
        var basket_for = req.body.basket_for;
        var basket_type = req.body.basket_type;
        var basket_discount = req.body.basket_discount;
        var recommended = req.body.recommended;       
        var best_seller = req.body.best_seller;  
        var basket_description = req.body.basket_description;
        var status = req.body.status;
        
        var keywords = req.body.keywords;

        var total_products = req.body.total_products;
        var total_price = req.body.total_price;
        var total_weight = req.body.total_weight;  
        var total_weight_in_kg = req.body.total_weight_in_kg;                    
        var total_weight_in_gm = req.body.total_weight_in_gm;  
        var actual_price = req.body.actual_price;                    
        var discount_price = req.body.discount_price;                  

        var dateFuntion = new Date();
        var year = dateFuntion.getFullYear();
        var month = dateFuntion.getMonth()+1;
        var day = dateFuntion.getDate();

        var date = year+'-'+month+'-'+day; 

        if(req.file){
          var basket_image = UPLOAD_BASE_URL+'uploads/baskets/'+req.file.filename;
          var updatequery = "UPDATE `baskets` SET `basket_name`='"+basket_name+"',`basket_category`='"+basket_categoty+"',`basket_company_cost`='"+basket_company_cost+"',`basket_sale_price`='"+basket_sale_price+"',`actual_price`='"+actual_price+"',`discount_price`='"+discount_price+"',`basket_weight`='"+basket_weight+"',`basket_weight_in_kg`='"+basket_weight_in_kg+"',`basket_weight_in_gm`='"+basket_weight_in_gm+"',`basket_for`='"+basket_for+"',`basket_type`='"+basket_type+"',`basket_discount`='"+basket_discount+"',`keywords`='"+keywords+"',`basket_description`='"+basket_description+"',`status`='"+status+"',`basket_image`='"+basket_image+"',`total_products`='"+total_products+"',`total_price`='"+total_price+"',`total_weight`='"+total_weight+"',`total_weight_in_kg`='"+total_weight_in_kg+"',`total_weight_in_gm`='"+total_weight_in_gm+"',`recommended`='"+recommended+"',`best_seller`='"+best_seller+"',`updated_date`='"+date+"' WHERE `basket_id`='"+basket_id+"'";
        }else{
          var updatequery = "UPDATE `baskets` SET `basket_name`='"+basket_name+"',`basket_category`='"+basket_categoty+"',`basket_company_cost`='"+basket_company_cost+"',`basket_sale_price`='"+basket_sale_price+"',`basket_sale_price`='"+basket_sale_price+"',`actual_price`='"+actual_price+"',`discount_price`='"+discount_price+"',`basket_weight`='"+basket_weight+"',`basket_weight_in_kg`='"+basket_weight_in_kg+"',`basket_weight_in_gm`='"+basket_weight_in_gm+"',`basket_for`='"+basket_for+"',`basket_type`='"+basket_type+"',`basket_discount`='"+basket_discount+"',`keywords`='"+keywords+"',`basket_description`='"+basket_description+"',`status`='"+status+"',`total_products`='"+total_products+"',`total_price`='"+total_price+"',`total_weight`='"+total_weight+"',`total_weight_in_kg`='"+total_weight_in_kg+"',`total_weight_in_gm`='"+total_weight_in_gm+"',`recommended`='"+recommended+"',`best_seller`='"+best_seller+"',`updated_date`='"+date+"',`user_no`='"+user_id+"' WHERE `basket_id`='"+basket_id+"'";
        }

      var checkCdoe = await updatebasket(updatequery);

      var historyquery = "INSERT INTO `baskets_history`(`basket_id`,`basket_name`, `basket_category`, `basket_company_cost`, `basket_sale_price`,`actual_price`,`discount_price`, `basket_weight`, `basket_weight_in_kg`, `basket_weight_in_gm`, `basket_sku_code`, `basket_for`, `basket_type`, `basket_discount`, `basket_description`, `status`, `basket_image`, `total_products`, `total_price`, `total_weight`, `total_weight_in_kg`, `total_weight_in_gm`, `recommended`, `best_seller`, `created_date`, `updated_date`,`user_no`) VALUES ('"+basket_id+"','"+basket_name+"','"+basket_categoty+"','"+basket_company_cost+"','"+basket_sale_price+"','"+actual_price+"','"+discount_price+"','"+basket_weight+"','"+basket_weight_in_kg+"','"+basket_weight_in_gm+"','"+basket_sku_code+"','"+basket_for+"','"+basket_type+"','"+basket_discount+"','"+basket_description+"','"+status+"','"+basket_image+"','"+total_products+"','"+total_price+"','"+total_weight+"','"+total_weight_in_kg+"','"+total_weight_in_gm+"','"+recommended+"','"+best_seller+"','"+date+"','"+date+"','"+user_id+"')";

      var history = await insertbaskethistory(historyquery);


      var deleteProdct = "DELETE FROM `basket_products` WHERE `basket_id`='"+basket_id+"'"
      var delProdtRes = await executeQuery(deleteProdct);

      for (var i = 0; i < products.length; i++) {
        var product_id = products[i].product_id;
        var product_name = products[i].product_name;
        var product_image = products[i].product_image;
        var product_description = products[i].product_description;
        var product_weight = products[i].product_weight;
        var weight_in_kg = products[i].weight_in_kg;
        var weight_in_gm = products[i].weight_in_gm;
        var product_price = products[i].product_price;
        var product_category = products[i].product_category;
        var product_type = products[i].product_type;
        var product_price_type = products[i].product_price_type;
        var quantity = products[i].quantity;
        var itemTotal = products[i].itemTotal;

        var query1 = "INSERT INTO `basket_products`(`basket_id`, `basket_product_no`, `product_id`, `product_name`, `product_image`, `product_description`, `product_weight`, `weight_in_kg`, `weight_in_gm`, `product_price`, `product_category`, `product_type`, `product_price_type`, `quantity`, `product_total`,`user_no`) VALUES ('"+basket_id+"','"+basket_id+"','"+product_id+"','"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+weight_in_kg+"','"+weight_in_gm+"','"+product_price+"','"+product_category+"','"+product_type+"','"+product_price_type+"','"+quantity+"','"+itemTotal+"','"+user_id+"')";

        var basProdt = await executeQuery(query1);

        var query2 = "INSERT INTO `basket_products_history`(`basket_id`, `basket_product_no`, `product_id`, `product_name`, `product_image`, `product_description`, `product_weight`, `weight_in_kg`, `weight_in_gm`, `product_price`, `product_category`, `product_type`, `product_price_type`, `quantity`, `product_total`,`user_no`) VALUES ('"+basket_id+"','"+basket_id+"','"+product_id+"','"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+weight_in_kg+"','"+weight_in_gm+"','"+product_price+"','"+product_category+"','"+product_type+"','"+product_price_type+"','"+quantity+"','"+itemTotal+"','"+user_id+"')";

        var basProdtHis = await executeQuery(query2);
      }
      
      var returndata = {'CODE':200,'error':'','success':'success','data':checkCdoe}
      res.send(returndata);

    }
});

function updatebasket(updatequery) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      db_connect.query(updatequery, (err, result) => {
        if(err){
          reject(new Error(err));
        }else{
          resolve(result);
        }
      })
    }, 100);
  }); 
}

function insertbaskethistory(query) {
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

function checkSKUcode(code,basket_id) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      db_connect.query("SELECT * FROM baskets WHERE basket_sku_code = '"+code+"' AND basket_id !='"+basket_id+"'", (err, result) => {
        if(err){
          reject(new Error(err));
        }else{
          resolve(result);
        }

      })
    }, 100);
  }); 
}

router.get('/getbaskets', cors(),(req, res) => {
  db_connect.query("SELECT * FROM baskets", (err, results) => {
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

router.post('/deletbasket', cors(),(req, res) => {
  var id = req.body.id;
  var query = "DELETE FROM baskets WHERE basket_id='"+id+"'";

  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':err}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
    }
  });
});

router.post('/getbasketdata', cors(),(req, res) => {
  var id = req.body.id

  var query = "SELECT baskets.*,basket_categories.*,basket_for.*,types.*,basket_discounts.*,baskets.status as baskets_status  FROM `baskets` LEFT JOIN basket_categories ON basket_categories.basket_category_id=baskets.basket_category LEFT JOIN basket_for ON basket_for.basket_for_id=baskets.basket_for LEFT JOIN types ON types.type_id=baskets.basket_type LEFT JOIN basket_discounts ON basket_discounts.discount_id=baskets.basket_discount WHERE `basket_id`='"+id+"'"
  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
      res.send(returndata);
    } else {
      if (results.length > 0) {
        var basket_category = results[0].basket_category;
        var product_type = results[0].basket_type;
        var respcat = basket_category.split(",");
        resptype = product_type.split(",");
        //resptype = bas.split(",");

        var bas_for = results[0].basket_for;
        var baskt_for = bas_for.split(",");

        var pdata = "SELECT * FROM `types` WHERE `type_id` IN(" + resptype + ") AND type_status='1'"
        db_connect.query(pdata, (err1, results1) => {
          if (err1) {
            var returndata = { 'CODE': 201, 'error': err1, 'success': 'fail', 'data': '' }
            res.send(returndata);
          } else {
            var pdata = "SELECT * FROM `basket_categories` WHERE `basket_category_id` IN(" + respcat + ") AND basket_category_status='1'"
            db_connect.query(pdata, (err2, results2) => {
              if (err2) {
                var returndata = { 'CODE': 201, 'error': err2, 'success': 'fail', 'data': '' }
                res.send(returndata);
              } else {
                var baspdata = "SELECT *,product_price as price FROM `basket_products` WHERE `basket_id`='" + id + "'"
                db_connect.query(baspdata, (err3, results3) => {
                  if (err3) {
                    var returndata = { 'CODE': 201, 'error': err3, 'success': 'fail', 'data': '' }
                    res.send(returndata);
                  } else {

                    var basforquery = "SELECT * FROM `basket_for` WHERE `basket_for_id` IN(" + baskt_for + ") AND `basket_for_status`='1'";
                    db_connect.query(basforquery, (err3, forresults) => {
                      if (err3) {
                        var returndata = { 'CODE': 201, 'error': err3, 'success': 'fail', 'data': '' }
                        res.send(returndata);
                      } else {

                        var returndata = { 'CODE': 200, 'success': 'success', 'data': results, 'selected_type': results1, 'selected_category': results2, 'selected_for': forresults, 'basket_products': results3 }
                        res.send(returndata);
                      }
                    })
                  }
                })
              }

            })

          }
             
        })
      }
               
    }      
  });
});

router.post('/getbasket', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM baskets WHERE basket_id ='"+id+"' ", (err, results) => {
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

router.get('/getsubscriptionbaskets', cors(),(req, res) => {
  var id = req.body.id;

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
  var current_date = year+'-'+month+'-'+day;


  db_connect.query("SELECT subscription_baskets.*,subscriptions.* FROM `subscription_baskets` LEFT JOIN subscriptions ON subscriptions.subscription_id=subscription_baskets.subscription_id WHERE subscriptions.subscription_status = '1' GROUP BY subscription_baskets.subscription_id", (err, results) => {
  if(err) throw err;
    if(results != ''){
      var query = "SELECT * FROM `subscriptions` WHERE `subscription_status`='1' AND subscription_validity > '"+current_date+"'"

      db_connect.query(query, (err1, results1) => {
        var returndata = {'CODE':200,'success':'success','data':results,'subscription':results1}
        res.send(returndata); 
      })
      
    }else{
      var query = "SELECT * FROM `subscriptions` WHERE `subscription_status`='1' AND subscription_validity > '"+current_date+"'"

      db_connect.query(query, (err1, results1) => {
        var returndata = {'CODE':200,'success':'No data found','data':'','subscription':results1}
        res.send(returndata); 
      })
      
    }      
  });
});

router.get('/getallbasketcategories', cors(),(req, res) => {

  var query = "SELECT c3.`basket_category_id`,c3.`basket_category_name`,c3.`basket_category_image`,  (case when c3.basket_category_status > 0 then 'Active' else 'In-Active' end ) as basket_category_status, '' as parent_cat FROM basket_categories as c3 WHERE `parent_id`=''  UNION ALL     SELECT c1.`basket_category_id`,c1.`basket_category_name`,c1.`basket_category_image`,(case when c1.basket_category_status > 0 then 'Active' else 'In-Active' end ) as basket_category_status,c2.basket_category_name FROM basket_categories as c1 LEFT JOIN basket_categories as c2 ON c1.parent_id=c2.basket_category_id WHERE c1.`parent_id` <> '' ORDER BY basket_category_id ASC";
  
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

router.get('/getallactivebasketcategories', cors(),(req, res) => {

  var query = "SELECT * FROM (SELECT c1.basket_category_id,c1.parent_id,c1.basket_category_name,c1.basket_category_status,'' as parent_cat FROM basket_categories as c1 WHERE c1.parent_id ='' and c1.basket_category_status='1' UNION ALL SELECT c2.basket_category_id,c2.parent_id,c2.basket_category_name,c2.basket_category_status,c3.`basket_category_name` as parent_cat FROM basket_categories as c2 LEFT JOIN basket_categories as c3 ON c2.parent_id=c3.basket_category_id WHERE c2.parent_id <> '' and c2.basket_category_status='1' and c3.basket_category_status='1') as xc WHERE parent_cat!=''"
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

router.get('/getparentbasketcategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM basket_categories WHERE parent_id = ''", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/addnewbasketcategory', basketcatupload.single('image'), cors(),(req, res) => {
  var user_id = req.body.user_id
  var parent_category = req.body.parent_category;
  var basket_category_name = req.body.basket_category_name;
  var basket_category_status = req.body.basket_category_status;

  if(req.file){
    var image = UPLOAD_BASE_URL+'uploads/basket_category/'+req.file.filename;


    var query = "INSERT INTO basket_categories (parent_id, basket_category_name,basket_category_image,  basket_category_status) VALUES ('"+parent_category+"','"+basket_category_name+"','"+image+"','"+basket_category_status+"')";
    db_connect.query(query, (err, results) => {
      if(err){
        var returndata = {'CODE':201,'success':'fail','data':err}
        res.send(returndata); 
      }else{
        var returndata = {'CODE':200,'success':'success','data':results}
        res.send(returndata); 
      }
    });
  }else{
    var returndata = {'CODE':201,'error':'Select image','success':'fail','data':''}
    res.send(returndata);
  }
});

router.post('/getbasketcategorydata', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM basket_categories where basket_category_id ='"+id+"'", (err, results) => {
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

router.post('/updatebasketcategory', basketcatupload.single('image'), cors(),(req, res) => {
  var id = req.body.id;
  var parent_category = req.body.parent_category;
  var basket_category_name = req.body.basket_category_name;
  var basket_category_status = req.body.basket_category_status;



  if(req.file){
    var image = UPLOAD_BASE_URL+'uploads/basket_category/'+req.file.filename;
    var query = "UPDATE basket_categories SET parent_id='"+parent_category+"',basket_category_name='"+basket_category_name+"',basket_category_image='"+image+"',basket_category_status='"+basket_category_status+"' WHERE basket_category_id='"+id+"'";
  }else{
    var query = "UPDATE basket_categories SET parent_id='"+parent_category+"',basket_category_name='"+basket_category_name+"',basket_category_status='"+basket_category_status+"' WHERE basket_category_id='"+id+"'";
  }

    

  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':err}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
    }
  });
});

router.post('/deletebasketcategory', cors(),(req, res) => {
  var id = req.body.id;
  var query = "DELETE FROM basket_categories WHERE basket_category_id='"+id+"'";

  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':err}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
    }
  });
});

router.post('/getbasketproducts', cors(),(req, res) => {
  var id = req.body.id

  var baspdata = "SELECT basket_id,GROUP_CONCAT(product_id) as product_id FROM basket_products WHERE basket_id='"+id+"' ORDER BY `product_id` ASC"
  db_connect.query(baspdata, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
      res.send(returndata); 
    }else{
      var pids = results[0].product_id
      var baspdata1 = "SELECT *,product_id as id,product_price as price FROM products WHERE product_id IN("+pids+") ORDER BY `product_id` ASC"

      db_connect.query(baspdata1, (err1, results1) => {
        if(err1){
          var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
          res.send(returndata); 
        }else{

          var returndata = {'CODE':200,'success':'success','data':results1}
          res.send(returndata);
        }

      })
    }
  })
});

router.post('/getbasketsaveproducts', cors(),(req, res) => {
  var id = req.body.id

  var baspdata = "SELECT *,product_id as id,product_price as price FROM basket_products WHERE basket_id ='"+id+"' ORDER BY `product_id` ASC"
  db_connect.query(baspdata, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata);
        
    }
  })
});


module.exports = router;