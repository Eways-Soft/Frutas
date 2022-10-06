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

var config = require('../../config');
const TWILIO_ACCOUNT_SID = config.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = config.TWILIO_AUTH_TOKEN;

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);

var USER_ID = 97;
var returndata = [];

function send_otp(mobile,otp){
  return new Promise(function(resolve, reject) {   
    client.messages
      .create({
        from: config.TWILIO_PHONE_NUMBER,
        to: '+91'+mobile,
        body: 'Fruits Basket Code '+otp
      })
      .then(message_res => {
        resolve(true);
      })
      .catch(err => {
        reject(new Error(err));
      });
    });
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

router.post('/otp_verify', async (req, res) => {  
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


router.post('/forgotpassword', async (req, res) => {  
  var mobile = req.body.username


  var query = "SELECT * FROM customer WHERE username='"+mobile+"'";

  console.log(query)
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
                returndata = {'CODE':201,'error':'Username does not match','success':'','data':''}
                res.send(returndata);
            }
        }
    })
})
















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


module.exports = router;