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

router.get('/getrolemaster', cors(),(req, res) => {
  var query = "SELECT *,case when role_status > 0 then 'Active' else 'In-Active' end as role_status from role_master order by role_master_id DESC";
  db_connect.query(query, (err, result) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','error':err}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':200,'success':'success','data':result}
      res.send(returndata); 
    }  
  });
})

router.get('/getactiverolemaster', cors(),(req, res) => {
  var query = "SELECT * from role_master where role_status ='1'";
  db_connect.query(query, (err, result) => {
    if(err) throw err;
    if(result != ''){
      var returndata = {'CODE':200,'success':'success','data':result}
        res.send(returndata); 
    }else{
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata); 
    }         
  });
})


router.get('/getrolebothsettings', cors(),(req, res) => {
  var query = "SELECT * from role_menu";
  db_connect.query(query, (err, roles_menu) => {
  if(err) throw err;
    if(roles_menu != ''){
      var query1 = "SELECT role_settings.*,role_menu.* FROM `role_settings` LEFT JOIN role_menu ON role_menu.role_menu_id=role_settings.menu_id";
      db_connect.query(query1, (err, role_settings) => {
      if(err) throw err;
        if(role_settings != ''){
          var returndata = {'CODE':200,'success':'success','roles_menu':roles_menu,'role_settings':role_settings}
          res.send(returndata); 
        } 
      });
    }   
  });
});

router.post('/addnewrole', cors(),(req, res) => {
  var role_name = req.body.role_name;
  var roles_menu = req.body.roles_menu;
  var roles_setting = req.body.roles_settings;  

  var roles_menus = roles_menu.toString()
  var roles_settings = roles_setting.toString()

  var selectq = "SELECT * FROM role_master WHERE role_menu_name='"+role_name+"'";
   db_connect.query(selectq, (serr, sresults) => {
    if(serr){
      var returndata = {'CODE':201,'success':'fail','error':serr}
      res.send(returndata);
    }else{ 
      if(sresults!='')   {
        var returndata = {'CODE':201,'success':'fail','error':'Role name allready exist. Please try another'}
        res.send(returndata);
      } else {
        var query = "INSERT INTO role_master (role_menu_name, role_setting_ids, role_menu_ids,role_status) VALUES ('"+role_name+"','"+roles_settings+"','"+roles_menus+"','1')";
        db_connect.query(query, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'success':'fail','data':err}
            res.send(returndata); 
          }else{
            var returndata = {'CODE':200,'success':'success','data':results}
            res.send(returndata); 
          }
        });
      }
    }
  })
});


router.post('/getroledata', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM role_master where role_master_id ='"+id+"'", (err, results) => {
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

router.post('/updaterole', cors(),(req, res) => {
  var id = req.body.id;
  var role_name = req.body.role_name;
  var roles_menu = req.body.roles_menu;
  var roles_setting = req.body.roles_settings;  

  var roles_menus = roles_menu.toString()
  var roles_settings = roles_setting.toString()

  var selectq = "SELECT * FROM role_master WHERE role_menu_name='"+role_name+"' AND role_master_id !='"+id+"'";
   db_connect.query(selectq, (serr, sresults) => {
    if(serr){
      var returndata = {'CODE':201,'success':'fail','error':serr}
      res.send(returndata);
    }else{ 
      if(sresults!='')   {
        var returndata = {'CODE':201,'success':'fail','error':'Role name allready exist. Please try another'}
        res.send(returndata);
      } else {
          var query = "UPDATE role_master SET role_menu_name='"+role_name+"',role_setting_ids='"+roles_settings+"',role_menu_ids='"+roles_menus+"' WHERE role_master_id='"+id+"'";

          db_connect.query(query, (err, results) => {
            if(err){
              var returndata = {'CODE':201,'success':'fail','data':err}
              res.send(returndata); 
            }else{
              var returndata = {'CODE':200,'success':'success','data':results}
              res.send(returndata); 
            }
          });
        }
      }
    })
});

router.post('/deleterole', cors(),(req, res) => {
  var id = req.body.id;
  var query = "DELETE FROM role_master WHERE role_master_id='"+id+"'";

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