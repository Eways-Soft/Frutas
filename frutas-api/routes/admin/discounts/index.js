var express = require('express');
var fs = require('fs');
const mysql = require('mysql');
var router = express.Router();
var multer  = require('multer');
var cors = require('cors');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '1234';
var db_connect = require('../../../database');


var config = require('../../../config');
const base_url = config.BASE_URL;
const UPLOAD_BASE_URL = config.UPLOAD_BASE_URL;

router.use(cors());

const discountstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/discounts/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var discountupload = multer({ storage: discountstorage });

router.get('/getAllDiscounts', cors(),(req, res) => {
  db_connect.query("SELECT *,case when status > 0 then 'Active' else 'In-Active' end as status FROM basket_discounts", (err, results) => {
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

router.post('/addnewdiscount', discountupload.single('image'), cors(),(req, res) => {
  
  var discount_name = req.body.name;
  var discount = req.body.discount;
  var status = req.body.status;
  var image = UPLOAD_BASE_URL+'uploads/discounts/'+req.file.filename;

  var query = "INSERT INTO `basket_discounts`(`discount_name`, `discount`, `image`, `status`) VALUES ('"+discount_name+"','"+discount+"','"+image+"','"+status+"')";
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

router.post('/getdiscount', cors(),(req, res) => {
  var discount_id = req.body.id;
  db_connect.query("SELECT * FROM basket_discounts WHERE discount_id='"+discount_id+"'", (err, results) => {
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

router.post('/updatediscount', discountupload.single('image'), cors(),(req, res) => {
  var discount_id = req.body.id;
  var discount_name = req.body.name;
  var discount = req.body.discount;
  var status = req.body.status;

  if (req.file) {
    var image = UPLOAD_BASE_URL+'uploads/discounts/'+req.file.filename;

    var query = "UPDATE basket_discounts SET discount_name='"+discount_name+"',discount='"+discount+"',image='"+image+"',status='"+status+"' WHERE discount_id='"+discount_id+"'";
  }else{
    var query = "UPDATE basket_discounts SET discount_name='"+discount_name+"',discount='"+discount+"',status='"+status+"' WHERE discount_id='"+discount_id+"'";
  }
  
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

router.post('/deletediscount', cors(),(req, res) => {
  var id = req.body.id;
  var query = "DELETE FROM basket_discounts WHERE discount_id='"+id+"'";

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

router.get('/getAllBasketActiveDiscount', cors(),(req, res) => {
  db_connect.query("SELECT * FROM basket_discounts WHERE status='1'", (err, results) => {
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


module.exports = router;