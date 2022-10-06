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

router.use(cors());

router.get('/gettypes', cors(),(req, res) => {
  var query = "SELECT *,case when type_status > 0 then 'Active' else 'In-Active' end as type_status FROM types order by type_id DESC"
  db_connect.query(query, (err, results) => {
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

router.get('/getactivetypes', cors(),(req, res) => {
  db_connect.query("SELECT * FROM types WHERE type_status ='1'", (err, results) => {
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

router.post('/addnewtype', cors(),(req, res) => {
  var type_name = req.body.type_name;
  var type_status = req.body.type_status;

  var query = "INSERT INTO types (type_name,type_status) VALUES ('"+type_name+"','"+type_status+"')";
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

router.post('/gettypedata', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM types WHERE type_id = '"+id+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/updatetype', cors(),(req, res) => {
  var id = req.body.id;
  var type_name = req.body.type_name;
  var type_status = req.body.type_status;

  var query = "UPDATE types SET type_name='"+type_name+"',type_status='"+type_status+"' WHERE type_id='"+id+"'";

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