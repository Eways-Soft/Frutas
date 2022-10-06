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
        cb(null, 'uploads/app_main_slider/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var basketcatupload = multer({ storage: basketcatstorage });

router.post('/addappmainslider', basketcatupload.single('image'), cors(),(req, res) => {

  var selectqry = "SELECT * FROM `app_main_slider`";

  db_connect.query(selectqry, (serr, sresults) => {
    if(serr){
      var returndata = {'CODE':201,'error':serr,'success':'fail','data':''}
      res.send(returndata); 
    }else{

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

      var slider_content = req.body.slider_content  

      if (sresults !='') {
        if(req.file){
          var slider_image = UPLOAD_BASE_URL+'uploads/app_main_slider/'+req.file.filename;

          var querys = "UPDATE app_main_slider SET slider_content='"+slider_content+"',slider_image='"+slider_image+"', update_date='"+current_date+"'"
        }else{
          var querys = "UPDATE app_main_slider SET slider_content='"+slider_content+"', update_date='"+current_date+"'"
        }

        db_connect.query(querys, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
            res.send(returndata); 
          }else{
            var returndata = {'CODE':200,'success':'success','data':results}
            res.send(returndata); 
          }
        });

      }else{

        if(req.file){
          var slider_image = UPLOAD_BASE_URL+'uploads/app_main_slider/'+req.file.filename;


          var querys = "INSERT INTO `app_main_slider`(`slider_content`, `slider_image`, `create_date`, `update_date`) VALUES ('"+slider_content+"','"+slider_image+"','"+current_date+"','"+current_date+"')";

          db_connect.query(querys, (err, results) => {
            if(err){
              var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
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

      }
    }
  })

/*

  
  if(req.file){

    var slider_image = UPLOAD_BASE_URL+'uploads/app_main_slider/'+req.file.filename;

    


    var query = "INSERT INTO `app_main_slider`(`slider_content`, `slider_image`, `create_date`, `update_date`) VALUES ('"+slider_content+"','"+slider_image+"','"+current_date+"','"+current_date+"')";
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
  }  */

})

router.post('/updateappmainslider', basketcatupload.single('image'), cors(),(req, res) => {
  var slider_content = req.body.slider_content  

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
    var querys = "UPDATE app_main_slider SET slider_content='"+slider_content+"',slider_image='"+current_date+"', update_date='"+current_date+"'"
  }else{
    var querys = "UPDATE app_main_slider SET slider_content='"+slider_content+"', update_date='"+current_date+"'"
  }
    var slider_image = UPLOAD_BASE_URL+'uploads/app_main_slider/'+req.file.filename;

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


    var query = "INSERT INTO `app_main_slider`(`slider_content`, `slider_image`, `create_date`, `update_date`) VALUES ('"+slider_content+"','"+slider_image+"','"+current_date+"','"+current_date+"')";
    db_connect.query(query, (err, results) => {
      if(err){
        var returndata = {'CODE':201,'success':'fail','data':err}
        res.send(returndata); 
      }else{
        var returndata = {'CODE':200,'success':'success','data':results}
        res.send(returndata); 
      }
    });
})

router.get('/getmainsliderdata', cors(),(req, res) => {
  var id = req.body.id;

  var query = "SELECT * FROM app_main_slider where id ='1'";

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

module.exports = router;