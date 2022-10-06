var express = require('express');
var app = express();
var cors = require('cors');
const multer  = require('multer');
var db_connect = require('./server');
var bodyParser = require('body-parser')

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/login', cors(),(req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  db_connect.query("SELECT * FROM users WHERE username='"+username+"' AND password='"+password+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'success','err':err}
        res.send(returndata); 
    }else{
      if(results != ''){
        var role_id = results[0].role_id;
        var query1 = "SELECT * from role_master WHERE role_master_id='"+role_id+"'";
        db_connect.query(query1, (err1, result) => {
          if(err1){
            var returndata = {'CODE':202,'success':'success','err':err1}
            res.send(returndata);
          }else{
            if(result != ''){
              var query = "SELECT * from role_menu";
              db_connect.query(query, (err2, roles_menu) => {
                if(err2){
                  var returndata = {'CODE':205,'success':'success','err':err2}
                  res.send(returndata);
                }else{
                  if(roles_menu != ''){
                    var query1 = "SELECT * from role_settings";
                    db_connect.query(query1, (err3, role_settings) => {
                      if (err3) {
                        var returndata = {'CODE':206,'success':'success','err':err3}
                        res.send(returndata);
                      }else{
                        var returndata = {'CODE':200,'success':'success','data':results,'role_master':result,'roles_menu':roles_menu,'role_settings':role_settings}
                        res.send(returndata);
                      }                      
                    });                        
                  }else{
                    var returndata = {'CODE':200,'success':'success','data':results,'role_master':result}
                    res.send(returndata);
                  }
                }
              })
                     
            }else{
              var returndata = {'CODE':200,'success':'fail','data':results}
              res.send(returndata); 
            }   
          }                  
        });
      }else{
        var returndata = {'CODE':201,'success':'fail','data':''}
        res.send(returndata); 
      } 
    }     
  });
    
});


app.get('/getusers', cors(),(req, res) => {
  db_connect.query("SELECT * FROM users ORDER BY `id` DESC", (err, results) => {
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

app.get('/getrolemaster', cors(),(req, res) => {
  var query = "SELECT * from role_master";
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

app.post('/adduser', cors(),(req, res) => {
  var role_id = req.body.role_id;
  var username = req.body.username;
  var password = req.body.password;

  var query = "INSERT INTO users (role_id, username, password) VALUES ('"+role_id+"','"+username+"','"+password+"')";
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


app.get('/getrolebothsettings', cors(),(req, res) => {
  var query = "SELECT * from role_menu";
  db_connect.query(query, (err, roles_menu) => {
  if(err) throw err;
    if(roles_menu != ''){
      var query1 = "SELECT * from role_settings";
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

app.get('/getrolemaster', cors(),(req, res) => {
  db_connect.query("SELECT * FROM role_master", (err, results) => {
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

app.post('/addnewrole', cors(),(req, res) => {
  var role_name = req.body.role_name;
  var roles_menu = req.body.roles_menu;
  var roles_setting = req.body.roles_settings;  

  var roles_menus = roles_menu.toString()
  var roles_settings = roles_setting.toString()

  var query = "INSERT INTO role_master (role_menu_name, role_setting_ids, role_menu_ids) VALUES ('"+role_name+"','"+roles_settings+"','"+roles_menus+"')";
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


app.get('/getproductcategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM product_categories", (err, results) => {
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

app.get('/getproducttypes', cors(),(req, res) => {
  db_connect.query("SELECT * FROM product_type", (err, results) => {
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


app.post('/addnewproductcategory', cors(),(req, res) => {
  var parent_category = req.body.parent_category;
  var product_category_name = req.body.product_category_name;

  var query = "INSERT INTO product_categories (parent_id, product_category_name,  product_category_status) VALUES ('"+parent_category+"','"+product_category_name+"','1')";
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

app.get('/getproducts', cors(),(req, res) => {
  db_connect.query("SELECT * FROM products", (err, results) => {
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

app.post('/addnewproduct',upload.single('image'),(req, res) => {


  


  var product_categoty = req.body.product_categoty;
  var product_name = req.body.product_name;
  var product_per_piece = req.body.product_per_piece;
  var product_price = req.body.product_price;
  var product_price_type = req.body.product_price_type;
  var product_type = req.body.product_type;
  var product_description = req.body.product_description;
  var product_image = req.body.product_image;

  /*var returndata = {'CODE':200,'success':'success','data':''}
      res.send(returndata);*/ 

  var query = "INSERT INTO products (product_name, product_image,  product_description,product_price,product_category,product_type,product_price_type,product_per_piece,product_status) VALUES ('"+product_name+"','"+product_name+"','"+product_description+"','"+product_price+"','"+product_categoty+"','"+product_type+"','"+product_price_type+"','"+product_per_piece+"','1')";
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



// Image Upload start
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });
// Image Upload end




var server = app.listen(9000, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at ", host, port)
})

module.exports = app;