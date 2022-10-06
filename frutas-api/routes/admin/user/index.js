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

router.post('/login', function(req, res, next) {
	var username = req.body.username;
  var password = req.body.password;
  db_connect.query("SELECT * FROM users WHERE username='"+username+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'success','err':err}
        res.send(returndata); 
    }else{
      if(results != ''){
        var hash = results[0].password;
        var checkhash = bcrypt.compareSync(password, hash);
        if(checkhash == true){
          var role_id = results[0].role_id;
          var query1 = "SELECT * from role_master WHERE role_master_id='"+role_id+"'";
          db_connect.query(query1, (err1, result) => {
            if(err1){
              var returndata = {'CODE':202,'error':err1,'success':'success','err':err1}
              res.send(returndata);
            }else{
              if(result != ''){
                var query = "SELECT * from role_menu";
                db_connect.query(query, (err2, roles_menu) => {
                  if(err2){
                    var returndata = {'CODE':205,'error':err2,'success':'success','err':err2}
                    res.send(returndata);
                  }else{
                    if(roles_menu != ''){
                      var query1 = "SELECT * from role_settings";
                      db_connect.query(query1, (err3, role_settings) => {
                        if (err3) {
                          var returndata = {'CODE':206,'error':'','success':'success','err':err3}
                          res.send(returndata);
                        }else{
                          var returndata = {'CODE':200,'error':'','success':'success','data':results,'role_master':result,'roles_menu':roles_menu,'role_settings':role_settings}
                          res.send(returndata);
                        }                      
                      });                        
                    }else{
                      var returndata = {'CODE':200,'error':'','success':'success','data':results,'role_master':result}
                      res.send(returndata);
                    }
                  }
                })
                       
              }else{
                var returndata = {'CODE':200,'error':'','success':'fail','data':results}
                res.send(returndata); 
              }   
            }                  
          });
        }else{
          var returndata = {'CODE':401,'error':'password does not match','success':'fail','data':results}
                res.send(returndata); 
        }
      }else{
        var returndata = {'CODE':201,'error':'','success':'fail','data':''}
        res.send(returndata); 
      } 
    }     
  });
})


router.get('/getusers', function(req, res, next) {
  var query = "SELECT users.*,case when users.status > 0 then 'Active' else 'In-Active' end as status,role_master.role_menu_name FROM `users` LEFT JOIN role_master on role_master.role_master_id=users.role_id ORDER BY users.id DESC"
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
})

router.post('/getuser', cors(),(req, res) => {
  var id = req.body.userid;
  db_connect.query("SELECT * FROM users WHERE id ='"+id+"' ", (err, results) => {
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

router.post('/adduser', cors(),(req, res) => {
  
  var role_id = req.body.role_id;
  var username = req.body.username;
  var password = req.body.password;

  var hash = bcrypt.hashSync(password, saltRounds);

  var checkhash = bcrypt.compareSync(password, hash);

      var query = "INSERT INTO users (role_id, username, password) VALUES ('"+role_id+"','"+username+"','"+hash+"')";
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

router.post('/userupdate',  cors(),(req, res) => {  
  var userid = req.body.userid;
  var role_id = req.body.role_id;
  var username = req.body.username;
  var password = req.body.password;
  var status = req.body.status;
  try {
    var select = "SELECT * FROM users WHERE id !='"+userid+"' AND username='"+username+"'";    
    db_connect.query(select, (err, results) => {      
      if(err){
        var returndata = {'CODE':201,'success':'fail','error':err}
        res.send(returndata); 
      }else{
        if(results != ''){        
          var returndata = {'CODE':200,'error':'username already exist','success':'username already exist'}
          res.send(returndata); 
        }else{
          const hash = bcrypt.hashSync(password, saltRounds);
          if(password != ''){
            var query = "UPDATE users SET role_id='"+role_id+"',username='"+username+"',password='"+hash+"',status='"+status+"' WHERE id='"+userid+"'";
          }else{
            var query = "UPDATE users SET role_id='"+role_id+"',username='"+username+"',status='"+status+"' WHERE id='"+userid+"'";
          }          
          db_connect.query(query, (err1, results1) => {
            if(err1){
              var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
              res.send(returndata); 
            }else{
              var returndata = {'CODE':200,'error':'','success':'success','data':results1}
              res.send(returndata); 
            }
          });
        }          
      }
    })
  } catch (err) {
    var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
    res.send(returndata); 
  }
});

router.post('/deletuser', cors(),(req, res) => {
  var id = req.body.id;
  var query = "DELETE FROM users WHERE id='"+id+"'";
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