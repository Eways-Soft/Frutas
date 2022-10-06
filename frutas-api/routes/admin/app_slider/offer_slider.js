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

const basketcatstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/app_offer_slider/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var offersliderupload = multer({ storage: basketcatstorage });


router.get('/getallofferslider', cors(),(req, res) => {

  var query = "SELECT app_offer_slider.*,basket_categories.*, case when app_offer_slider.status = 1 then 'Active' else 'In-Active' end as get_status FROM `app_offer_slider` LEFT JOIN basket_categories on basket_categories.basket_category_id=app_offer_slider.basket_category order by app_offer_slider.id DESC";


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


router.get('/getactivebasketcategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM basket_categories WHERE parent_id != '' AND basket_category_status='1'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});


router.post('/addappofferslider', offersliderupload.single('image'), cors(),(req, res) => {

  var basket_category = req.body.basket_category  
  var status = req.body.status  
  if(req.file){

    var slider_image = UPLOAD_BASE_URL+'uploads/app_offer_slider/'+req.file.filename;

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

    var query = "INSERT INTO `app_offer_slider`(`basket_category`, `slider_image`, `status`, `create_date`, `update_date`) VALUES ('"+basket_category+"','"+slider_image+"','"+status+"','"+current_date+"','"+current_date+"')";
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

})


router.post('/getoffersliderdata', cors(),(req, res) => {
  var id = req.body.id;

  var query = "SELECT * FROM app_offer_slider where id ='"+id+"'";

  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':err}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
    }
  })
});

router.post('/updateofferslider', offersliderupload.single('image'), cors(),(req, res) => {
  var id = req.body.id  
  var basket_category = req.body.basket_category  
  var basket_category = req.body.basket_category  
  var status = req.body.status 

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

  if(req.file){
    var image = UPLOAD_BASE_URL+'uploads/app_offer_slider/'+req.file.filename;

    var query = "UPDATE app_offer_slider SET basket_category='"+basket_category+"',slider_image='"+image+"',status='"+status+"',update_date='"+current_date+"' WHERE id='"+id+"'";
  }else{
    var query = "UPDATE app_offer_slider SET basket_category='"+basket_category+"',status='"+status+"',update_date='"+current_date+"' WHERE id='"+id+"'";
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


module.exports = router;