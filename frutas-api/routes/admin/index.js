var express = require('express');
var fs = require('fs');
var crypto = require('crypto');
var cors = require('cors');
var bodyParser = require('body-parser');


var router = express.Router();
var db_connect = require('../../database');
var functions = require('../functions');

const mysql = require('mysql');

var multer  = require('multer');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '1234';

const base_url = 'http://localhost:9000/';

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use('/uploads', express.static('uploads'));


router.use(cors());

var USER_ID = 97;

/* GET home page. */
router.get('/', function(req, res, next) {
  /*var pswrd = 'EW225#7@9&0abDeJ12AA567YGH9)(#~@';
  var iv = '12ab567def225ewy';
  var text = 'Ankit';

  var cipher = crypto.createCipheriv('aes-256-ctr', pswrd, iv)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  var enc = crypted;
  console.log("==========ecrypte data========")
  console.log('enc',enc)

  enc = 'dc6428bae6';
  console.log("==========decrypte data========")
  var decipher = crypto.createDecipheriv('aes-256-ctr', pswrd, iv)
  var dec = decipher.update(enc,'hex','utf8')
  dec += decipher.final('utf8');
  var decc = dec
  console.log('dec',decc)*/

  res.render('index', { title: 'Express' });

});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var upload = multer({ storage: storage });

const basketstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/baskets/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var basketupload = multer({ storage: basketstorage });

const discountstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/discounts/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var discountupload = multer({ storage: discountstorage });


const subscriptionstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/subscriptions/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var subscriptionupload = multer({ storage: subscriptionstorage });



var pool  = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  user: "ewayswork_fruitsbasket",
  password: "ewayswork_fruitsbasket",
  database: "ewayswork_fruitsbasket",
  multipleStatements: true
});

router.get('/getAllPageignationProducts', cors(), getAllProducts);

function getAllProducts(req, res){
  const limit = 25
  const page = req.query.page
  const offset = (page - 1) * limit
  const prodsQuery = "SELECT products.*,product_categories.*,types.*,product_price_type.*,products.product_id as id ,products.product_price as price FROM products LEFT JOIN product_categories ON product_categories.id=products.product_category LEFT JOIN types ON types.type_id=products.product_type LEFT JOIN product_price_type ON product_price_type.price_type_id=products.product_price_type limit "+limit+" OFFSET "+offset;

  //const prodsQuery = "select *,product_id as id ,product_price as price from products WHERE product_status='1' limit "+limit+" OFFSET "+offset
  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      if (error){
        var errors = error;
        var data = '';
      }else{
        var errors = error;
        var data = results;
      } 

      var jsonResult = {
        'products_page_count':results.length,
        'page_number':page,
        'products':data,
        'error':errors
      }

      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Products for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })
}

router.get('/getAllActiveProducts', cors(), getAllActiveProducts);

function getAllActiveProducts(req, res){
  const limit = 25
  const page = req.query.page
  const offset = (page - 1) * limit
  const prodsQuery = "SELECT products.*,product_categories.*,types.*,product_price_type.*,products.product_id as id ,products.product_price as price FROM products LEFT JOIN product_categories ON product_categories.id=products.product_category LEFT JOIN types ON types.type_id=products.product_type LEFT JOIN product_price_type ON product_price_type.price_type_id=products.product_price_type WHERE products.product_status ='1' limit "+limit+" OFFSET "+offset;

  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      if (error){
        var errors = error;
        var data = '';
      }else{
        var errors = error;
        var data = results;
      } 

      var jsonResult = {
        'products_page_count':results.length,
        'page_number':page,
        'products':data,
        'error':errors
      }

      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Products for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })
}

router.get('/getAllSearchProducts', cors(), getAllSearchProducts);

function getAllSearchProducts(req, res){
  const limit = 25
  const page = req.query.page
  const search = req.query.search
  const offset = (page - 1) * limit

  const prodsQuery = "SELECT products.*,product_categories.*,types.*,product_price_type.*,products.product_id as id,products.product_price as price FROM products LEFT JOIN product_categories ON product_categories.id=products.product_category LEFT JOIN types ON types.type_id=products.product_type LEFT JOIN product_price_type ON product_price_type.price_type_id=products.product_price_type WHERE products.product_status AND products.product_name LIKE '%"+search+"%' limit "+limit+" OFFSET "+offset;
  console.log(prodsQuery)

  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      if (error){
        var errors = error;
        var data = '';
      }else{
        var errors = error;
        var data = results;
      } 

      var jsonResult = {
        'products_page_count':results.length,
        'page_number':page,
        'products':data,
        'error':errors
      }

      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Products for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })
}

router.get('/getAllPageignationBaskets', cors(), getAllBaskets);

function getAllBaskets(req, res){
  const limit = 25
  const page = req.query.page
  const offset = (page - 1) * limit
  const prodsQuery = "SELECT baskets.*,basket_categories.*,basket_for.*,types.* from baskets LEFT JOIN basket_categories ON basket_categories.basket_category_id=baskets.basket_category LEFT JOIN basket_for ON basket_for.basket_for_id=baskets.basket_for LEFT JOIN types ON types.type_id=baskets.basket_type limit "+limit+" OFFSET "+offset;

  //const prodsQuery = "select *,product_id as id ,product_price as price from products WHERE product_status='1' limit "+limit+" OFFSET "+offset
  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      if (error){
        var errors = error;
        var data = '';
      }else{
        var errors = error;
        var data = results;
      } 

      var jsonResult = {
        'products_page_count':results.length,
        'page_number':page,
        'products':data,
        'error':errors
      }

      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Products for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })
}

router.get('/getAllActiveSubscriptions', cors(), getAllActiveSubscriptions);

function getAllActiveSubscriptions(req, res){
  const limit = 25
  const page = req.query.page
  const offset = (page - 1) * limit
  const prodsQuery = "SELECT baskets.*,basket_id as id, basket_sale_price as price,basket_discounts.discount_name, basket_for.basket_for_name FROM baskets LEFT JOIN basket_discounts ON basket_discounts.discount_id = baskets.basket_discount LEFT JOIN basket_for ON basket_for.basket_for_id = baskets.basket_for WHERE in_active ='1' limit "+limit+" OFFSET "+offset;

  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      if (error){
        var errors = error;
        var data = '';
      }else{
        var errors = error;
        var data = results;
      } 

      var jsonResult = {
        'products_page_count':results.length,
        'page_number':page,
        'products':data,
        'error':errors
      }

      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Products for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })
}

router.get('/searchAllActiveSubscriptions', cors(), searchAllActiveSubscriptions);

function searchAllActiveSubscriptions(req, res){
  const limit = 25
  const page = req.query.page
  const search = req.query.search
  const offset = (page - 1) * limit

  const prodsQuery = "SELECT baskets.*,basket_id as id, basket_sale_price as price,basket_discounts.discount_name, basket_for.basket_for_name FROM baskets LEFT JOIN basket_discounts ON basket_discounts.discount_id = baskets.basket_discount LEFT JOIN basket_for ON basket_for.basket_for_id = baskets.basket_for WHERE in_active ='1' AND baskets.basket_name LIKE '%"+search+"%' limit "+limit+" OFFSET "+offset;
  console.log(prodsQuery)

  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      if (error){
        var errors = error;
        var data = '';
      }else{
        var errors = error;
        var data = results;
      } 

      var jsonResult = {
        'products_page_count':results.length,
        'page_number':page,
        'products':data,
        'error':errors
      }

      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Products for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })
}

router.get('/getAllPageignationSubscription', cors(), getAllPageignationSubscription);

function getAllPageignationSubscription(req, res){
  const limit = 25
  const page = req.query.page
  const offset = (page - 1) * limit
  const prodsQuery = "SELECT s.*,subscription_cities.city_name,subscription_validity.validity_name FROM subscriptions as s LEFT JOIN subscription_cities ON subscription_cities.city_id=s.subscription_city LEFT JOIN subscription_validity ON subscription_validity.validity_id = s.subscription_validity limit "+limit+" OFFSET "+offset;

  //const prodsQuery = "select *,product_id as id ,product_price as price from products WHERE product_status='1' limit "+limit+" OFFSET "+offset
  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      if (error){
        var errors = error;
        var data = '';
      }else{
        var errors = error;
        var data = results;
      } 

      var jsonResult = {
        'products_page_count':results.length,
        'page_number':page,
        'products':data,
        'error':errors
      }

      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Products for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })
}

router.post('/login', cors(),(req, res) => {
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
});

router.get('/getusers', cors(),(req, res) => {
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

router.get('/getrolemaster', cors(),(req, res) => {
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
    //console.log(select)
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

          var query = "UPDATE users SET role_id='"+role_id+"',username='"+username+"',password='"+hash+"',status='"+status+"' WHERE id='"+userid+"'";
          console.log(query)
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

router.get('/getrolebothsettings', cors(),(req, res) => {
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

router.get('/getrolemaster', cors(),(req, res) => {
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

router.post('/addnewrole', cors(),(req, res) => {
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

router.get('/getparentproductcategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM product_categories WHERE parent_id = ''", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.get('/getproductcategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM product_categories", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/getparentproductcategydata', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM product_categories WHERE id = '"+id+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/updategetproductcategory', cors(),(req, res) => {
  var id = req.body.id;
  var parent_category = req.body.parent_category;
  var product_category_name = req.body.product_category_name;

  var query = "UPDATE product_categories SET parent_id='"+parent_category+"',product_category_name='"+product_category_name+"' WHERE id='"+id+"'";

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

router.get('/getproducttypes', cors(),(req, res) => {
  db_connect.query("SELECT * FROM types", (err, results) => {
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

router.get('/getpricetypes', cors(),(req, res) => {
  db_connect.query("SELECT * FROM product_price_type", (err, results) => {
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

router.post('/addnewproductcategory', cors(),(req, res) => {
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

router.get('/getproducts', cors(),(req, res) => {
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

router.post('/addnewproduct', upload.single('product_image'), cors(),(req, res) => {
  
  var product_categoty = req.body.product_categoty;
  var product_name = req.body.product_name;
  var product_weight = req.body.product_weight;
  var product_price = req.body.product_price;
  var product_price_type = req.body.product_price_type;
  var product_type = req.body.product_type;
  var product_description = req.body.product_description;
  var product_status = req.body.product_status;
  var product_image = base_url+'uploads/products/'+req.file.filename;


  var query = "INSERT INTO products (product_name, product_image,  product_description,product_weight,product_price,product_category,product_type,product_price_type,product_status) VALUES ('"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+product_price+"','"+product_categoty+"','"+product_type+"','"+product_price_type+"','"+product_status+"')";
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

router.post('/updateproduct', upload.single('product_image'), cors(),(req, res) => {
  //console.log(req.body);return false;
  var product_id = req.body.product_id;
  var product_categoty = req.body.product_categoty;
  var product_name = req.body.product_name;
  var product_weight = req.body.product_weight;
  var product_per_piece = req.body.product_per_piece;
  var product_price = req.body.product_price;
  var product_price_type = req.body.product_price_type;
  var product_type = req.body.product_type;
  var product_description = req.body.product_description;
  var product_status = req.body.product_status;

  if (req.file) {
    var product_image = base_url+'uploads/products/'+req.file.filename;
    var query = "UPDATE products SET product_name='"+product_name+"',product_image='"+product_image+"',product_description='"+product_description+"',product_weight='"+product_weight+"',product_price='"+product_price+"',product_category='"+product_categoty+"',product_type='"+product_type+"',product_price_type='"+product_price_type+"',product_status='"+product_status+"' WHERE product_id='"+product_id+"'";
  }else{
    var query = "UPDATE products SET product_name='"+product_name+"',product_description='"+product_description+"',product_weight='"+product_weight+"',product_price='"+product_price+"',product_category='"+product_categoty+"',product_type='"+product_type+"',product_price_type='"+product_price_type+"',product_status='"+product_status+"' WHERE product_id='"+product_id+"'";
  }

  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'error':err,'success':'fail','data':err}
      res.send(returndata); 
    }else{
      var returndata = {'CODE':200,'error':err,'success':'success','data':results}
      res.send(returndata); 
    }
  });
});

router.post('/getproductdata', cors(),(req, res) => {
  var product_id = req.body.product_id;
  db_connect.query("SELECT * FROM products where product_id ='"+product_id+"'", (err, results) => {
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

router.post('/deleteproductimage', cors(),(req, res) => {
  var product_id = req.body.product_id;
  var image = req.body.image;

  var query = "SELECT * FROM products WHERE product_id='"+product_id+"'";

  db_connect.query(query, (err, results) => {
    
  if(err){
    var returndata = {'CODE':201,'success':'fail','error':err,'data':''}
    res.send(returndata);
  }else{
    if(results != ''){
      const path = './uploads/products/'+image;
      try {
        fs.unlinkSync(path)
        var returndata = {'CODE':200,'success':'success','error':'','data':''}
        res.send(returndata);
      } catch(error) {
        var returndata = {'CODE':202,'success':'fail','error':error,'data':''}
        res.send(returndata);
      } 
    }else{
      var returndata = {'CODE':203,'success':'fail','data':''}
      res.send(returndata); 
    }
  }   

  });
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

router.post('/deletproductcategory', cors(),(req, res) => {
  var id = req.body.id;
  var query = "DELETE FROM product_categories WHERE id='"+id+"'";

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

router.post('/deletproduct', cors(),(req, res) => {
  var id = req.body.id;
  var query = "DELETE FROM products WHERE product_id='"+id+"'";

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

router.get('/gettypes', cors(),(req, res) => {
  db_connect.query("SELECT * FROM types", (err, results) => {
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

router.get('/getallbasketcategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM basket_categories", (err, results) => {
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

router.post('/addnewbasketcategory', cors(),(req, res) => {
  var parent_category = req.body.parent_category;
  var basket_category_name = req.body.basket_category_name;
  var basket_category_status = req.body.basket_category_status;

  var query = "INSERT INTO basket_categories (parent_id, basket_category_name,  basket_category_status) VALUES ('"+parent_category+"','"+basket_category_name+"','"+basket_category_status+"')";
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

router.post('/updatebasketcategory', cors(),(req, res) => {
  var id = req.body.id;
  var parent_category = req.body.parent_category;
  var basket_category_name = req.body.basket_category_name;
  var basket_category_status = req.body.basket_category_status;

  var query = "UPDATE basket_categories SET parent_id='"+parent_category+"',basket_category_name='"+basket_category_name+"',basket_category_status='"+basket_category_status+"' WHERE basket_category_id='"+id+"'";

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

router.get('/getallbasketfor', cors(),(req, res) => {
  db_connect.query("SELECT * FROM basket_for WHERE basket_for_status='1'", (err, results) => {
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

router.post('/addnewbasket', basketupload.single('basket_image'), cors(),(req, res) => {
  var basket_sku_code = req.body.basket_sku_code;
  
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
        var basket_categoty = req.body.basket_categoty;
        var basket_type = req.body.basket_type;
        var basket_name = req.body.basket_name;
        var basket_company_cost = req.body.basket_company_cost;
        var basket_sale_price = req.body.basket_sale_price;
        var basket_weight = req.body.basket_weight;
        
        var basket_for = req.body.basket_for;
        var basket_discount = req.body.basket_discount;
        var basket_price = req.body.basket_price;
        var basket_description = req.body.basket_description;
        var in_active = req.body.status;

        /*if(req.file){
          console.log(req.file)
        }*/
        var basket_image = base_url+'uploads/baskets/'+req.file.filename;
        var total_products = req.body.total_products;
        var total_price = req.body.total_price;
        var total_weight = req.body.total_weight;       

        var dateFuntion = new Date();
        var year = dateFuntion.getFullYear();
        var month = dateFuntion.getMonth()+1;
        var day = dateFuntion.getDate();

        var date = year+'-'+month+'-'+day; 

        var query1 = "INSERT INTO `baskets`(`basket_name`, `basket_category`, `basket_company_cost`, `basket_sale_price`, `basket_type`, `basket_weight`, `basket_sku_code`, `basket_for`, `basket_discount`, `basket_calculate_price`, `in_active`, `basket_image`, `total_products`, `total_price`, `total_weight`, `created_date`, `updated_date`) VALUES ('"+basket_name+"','"+basket_categoty+"','"+basket_company_cost+"','"+basket_sale_price+"','"+basket_type+"','"+basket_weight+"','"+basket_sku_code+"','"+basket_for+"','"+basket_discount+"','"+basket_price+"','"+in_active+"','"+basket_image+"','"+total_products+"','"+total_price+"','"+total_weight+"','"+date+"','"+date+"')";

        db_connect.query(query1, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':'Duplicate SKU'}
            res.send(returndata); 
          }else{
            var basket_id = results.insertId;

            for (var i = 0; i < products.length; i++) {
              
              var product_id = products[i].product_id;
              var product_name = products[i].product_name;
              var product_image = products[i].product_image;
              var product_description = products[i].product_description;
              var product_weight = products[i].product_weight;
              var product_price = products[i].product_price;
              var product_category = products[i].product_category;
              var product_type = products[i].product_type;
              var product_price_type = products[i].product_price_type;
              var quantity = products[i].quantity;
              var itemTotal = products[i].itemTotal;

              var query2 = "INSERT INTO `basket_products`(`basket_id`, `basket_product_no`, `product_id`, `product_name`, `product_image`, `product_description`, `product_weight`, `product_price`, `product_category`, `product_type`, `product_price_type`, `quantity`, `product_total`) VALUES ('"+basket_id+"','"+basket_id+"','"+product_id+"','"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+product_price+"','"+product_category+"','"+product_type+"','"+product_price_type+"','"+quantity+"','"+itemTotal+"')";

              db_connect.query(query2, (err2, results2) => {
                if(err2){
                  var returndata = {'CODE':201,'success':'fail','data':err2}
                  res.send(returndata); 
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
        });
      }
    }
  })
});

router.get('/getAllDiscounts', cors(),(req, res) => {
  db_connect.query("SELECT * FROM basket_discounts", (err, results) => {
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
  var image = base_url+'uploads/discounts/'+req.file.filename;

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
    var image = base_url+'uploads/discounts/'+req.file.filename;

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

router.get('/getAllSubscriptionCategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM subscription_categories", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.get('/getparentsubscriptioncategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM subscription_categories WHERE parent_id = '0'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/addnewsubscriptioncategory', cors(),(req, res) => {
  var parent_category = req.body.parent_category;
  var name = req.body.name;
  var status = req.body.status;

  if(parent_category != ''){
    var query = "INSERT INTO subscription_categories (parent_id, subscription_category_name,  subscription_category_status) VALUES ('"+parent_category+"','"+name+"','"+status+"')";
  }else{
    var query = "INSERT INTO subscription_categories (subscription_category_name,  subscription_category_status) VALUES ('"+name+"','"+status+"')";
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

router.post('/getparentsubscriptioncategory', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM subscription_categories WHERE subscription_category_id='"+id+"'", (err, results) => {
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

router.post('/updatesubscriptioncategory', cors(),(req, res) => {
  var id = req.body.id;
  var parent_category = req.body.parent_category;
  var name = req.body.name;
  var status = req.body.status;

  var query = "UPDATE subscription_categories SET parent_id='"+parent_category+"',subscription_category_name='"+name+"',subscription_category_status='"+status+"' WHERE subscription_category_id='"+id+"'";

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

router.get('/getActiveSubscriptionCategories', cors(),(req, res) => {
  db_connect.query("SELECT * FROM subscription_categories WHERE subscription_category_status = '1'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/getStatesByCountryID', cors(),(req, res) => {
  var id = req.body.id;

  db_connect.query("SELECT * FROM states WHERE country_id = '"+id+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/getCitiesByStateID', cors(),(req, res) => {
  var id = req.body.id;

  db_connect.query("SELECT * FROM cities WHERE state_id = '"+id+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.get('/getAllSubscriptionCities', cors(),(req, res) => {
  db_connect.query("SELECT *,case when city_status > 0 then 'Active' else 'In-Active' end as city_status FROM subscription_cities", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.get('/getAllActiveSubscriptionCities', cors(),(req, res) => {
  db_connect.query("SELECT *,case when city_status > 0 then 'Active' else 'In-Active' end as city_status FROM subscription_cities WHERE city_status = '1'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/addsubscriptioncity', cors(),(req, res) => {
  var name = req.body.name;

  var selectq = "SELECT * FROM subscription_cities WHERE city_name='"+name+"'";
   db_connect.query(selectq, (serr, sresults) => {
    if(serr){
      var returndata = {'CODE':201,'success':'fail','error':serr}
      res.send(returndata);
    }else{ 
      if(sresults!='')   {
        var returndata = {'CODE':201,'success':'fail','error':'City name allready exist. Please try another'}
        res.send(returndata);
      } else {
        var query = "INSERT INTO subscription_cities(city_name, city_status) VALUES ('"+name+"','1')";
       
        db_connect.query(query, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'success':'fail','data':''}
            res.send(returndata);
          }else{      
            var returndata = {'CODE':200,'success':'success','data':results}
            res.send(returndata); 
              
          }  
        });
      }
        
    }  
  });
        
});

router.get('/subscriptionActiveCities', cors(),(req, res) => {
  var query = "SELECT * FROM subscription_cities WHERE city_status='1'";
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

router.get('/subscriptionvalidity', cors(),(req, res) => {
  var query = "SELECT * FROM subscription_validity WHERE validity_status='1'";
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


router.post('/addnewsubscription', subscriptionupload.single('image'), cors(),(req, res) => {
  var sku_code = req.body.sku_code;  
  var pduct = req.body.products;

  var products = JSON.parse(pduct);

  db_connect.query("SELECT * FROM subscriptions WHERE subscription_sku_code = '"+sku_code+"'", (err0, resultss) => {
    if(err0){
      var returndata = {'CODE':201,'error':err0,'success':'fail','data':''}
      res.send(returndata);
    }else{ 
      if(resultss == ''){  
        var subscription_name = req.body.subscription_name;
        var type = req.body.type;
        var subscription_price = req.body.subscription_price;
        var sku_code = req.body.sku_code;
        var subscription_city = req.body.subscription_city;
        var subscription_validity = req.body.subscription_validity;
        var subscription_description = req.body.subscription_description;
        
        var status = req.body.status;

        /*if(req.file){
          console.log(req.file)
        }*/
        var image = base_url+'uploads/subscriptions/'+req.file.filename;
        var no_of_baskets = req.body.total_products;
        var total_price = req.body.total_price;
        var total_weight = req.body.total_weight;       

        var dateFuntion = new Date();
        var year = dateFuntion.getFullYear();
        var month = dateFuntion.getMonth()+1;
        var day = dateFuntion.getDate();

        var date = year+'-'+month+'-'+day; 

        var query1 = "INSERT INTO subscriptions(subscription_name, subscription_types, subscription_price, subscription_sku_code, subscription_city, subscription_validity, subscription_description, subscription_status, subscription_image, no_of_baskets, total_price, total_weight, created_date, updated_date) VALUES ('"+subscription_name+"','"+type+"','"+subscription_price+"','"+sku_code+"','"+subscription_city+"','"+subscription_validity+"','"+subscription_description+"','"+status+"','"+image+"','"+no_of_baskets+"','"+total_price+"','"+total_weight+"','"+date+"','"+date+"')";

        db_connect.query(query1, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
            res.send(returndata); 
          }else{
            var subscription_id = results.insertId;
            for (var i = 0; i < products.length; i++) {
              
              var basket_id = products[i].basket_id;
              var basket_product_id = products[i].basket_product_id;
              var basket_name = products[i].basket_name;
              var basket_category = products[i].basket_category;
              var basket_company_cost = products[i].basket_company_cost;
              var basket_sale_price = products[i].basket_sale_price;
              var basket_type = products[i].basket_type;
              var basket_weight = products[i].basket_weight;
              var basket_sku_code = products[i].basket_sku_code;
              var basket_for = products[i].basket_for;
              var basket_discount = products[i].basket_discount;
              var basket_calculate_price = products[i].basket_calculate_price;
              var in_active = products[i].in_active;
              var basket_image = products[i].basket_image;
              var total_products = products[i].total_products;
              var total_price = products[i].total_price;
              var total_weight = products[i].total_weight;
              var created_date = products[i].created_date;
              var updated_date = products[i].updated_date;
              var quantity = products[i].quantity;
              var itemTotal = products[i].itemTotal;

              var query2 = "INSERT INTO `subscription_baskets`(`subscription_id`,`basket_id`,`basket_name`, `basket_category`, `basket_company_cost`, `basket_sale_price`, `basket_type`, `basket_weight`, `basket_sku_code`, `basket_for`, `basket_discount`, `basket_calculate_price`, `in_active`, `basket_image`, `total_products`, `total_price`, `total_weight`, `created_date`, `updated_date`,`quantity`,`item_totals`) VALUES ('"+subscription_id+"','"+basket_id+"','"+basket_name+"','"+basket_category+"','"+basket_company_cost+"','"+basket_sale_price+"','"+basket_type+"','"+basket_weight+"','"+basket_sku_code+"','"+basket_for+"','"+basket_discount+"','"+basket_calculate_price+"','"+in_active+"','"+basket_image+"','"+total_products+"','"+total_price+"','"+total_weight+"','"+created_date+"','"+updated_date+"','"+quantity+"','"+itemTotal+"')";

              db_connect.query(query2, (err2, results2) => {
                if(err2){
                  var returndata = {'CODE':201,'success':'fail','data':err2}
                  res.send(returndata); 
                }
              })        
            }

            var returndata = {'CODE':200,'success':'success','data':results}
            res.send(returndata); 

          }
        });
      }else{
        var returndata = {'CODE':201,'error':err0,'success':'fail','data':'Duplicate SKU'}
        res.send(returndata);

      }
    }
  })
});

router.post('/deletesubscription', cors(),(req, res) => {
  var id = req.body.id;

  var query = "SELECT * FROM subscriptions WHERE subscription_id='"+id+"'";

  db_connect.query(query, (err, results) => {    
    if(err){
      var returndata = {'CODE':201,'success':'fail','error':err,'data':''}
      res.send(returndata);
    }else{

            
      if(results != ''){
        var path = results[0].subscription_image
        try {
         // fs.unlinkSync(path)

          var query2 = "DELETE FROM subscriptions WHERE subscription_id='"+id+"'"

          db_connect.query(query2, (err1, results1) => {    
            if(err1){
              var returndata = {'CODE':201,'success':'fail','error':err1,'data':''}
              res.send(returndata);
            }else{
              var returndata = {'CODE':200,'success':'success','error':'','data':results1}
              res.send(returndata);
            }
          })              
        } catch(error) {
          var returndata = {'CODE':202,'success':'fail','error':error,'data':''}
          res.send(returndata);
        } 
      }else{
        var returndata = {'CODE':203,'success':'fail','data':''}
        res.send(returndata); 
      }
    }   

  });
});

router.post('/getSubscriptionData', cors(),(req, res) => {
  var id = req.body.id;
          
  try {
    var query = "SELECT * FROM subscriptions WHERE subscription_id='"+id+"'";

    db_connect.query(query, (err, results) => {    
      if(err){
        var returndata = {'CODE':201,'success':'fail','error':err,'data':''}
        res.send(returndata);
      }else{
        var query1 = "SELECT *,basket_sale_price as price FROM subscription_baskets WHERE subscription_id='"+id+"'";
        db_connect.query(query1, (err1, results1) => {    
          if(err1){
            var returndata = {'CODE':201,'success':'fail','error':err1,'data':''}
            res.send(returndata);
          }else{ 
            var returndata = {'CODE':200,'success':'success','error':'','data':results,'baskets':results1}
            res.send(returndata);
          }
        }) 
      }
    })              
  } catch(error) {
    var returndata = {'CODE':202,'success':'fail','error':error,'data':''}
    res.send(returndata);
  } 

});

router.post('/updatesubscription', subscriptionupload.single('image'), cors(),(req, res) => {
  var subscription_id = req.body.id;  
  var sku_code = req.body.sku_code;  
  var pduct = req.body.products;

  var products = JSON.parse(pduct);

  db_connect.query("SELECT * FROM subscriptions WHERE subscription_sku_code = '"+sku_code+"' AND subscription_id != '"+subscription_id+"'", (err0, resultss) => {
    if(err0){
      var returndata = {'CODE':201,'error':err0,'success':'fail','data':''}
      res.send(returndata);
    }else{ 
      if(resultss == ''){  
        var subscription_name = req.body.subscription_name;
        var type = req.body.type;
        var subscription_price = req.body.subscription_price;
        var sku_code = req.body.sku_code;
        var subscription_city = req.body.subscription_city;
        var subscription_validity = req.body.subscription_validity;
        var subscription_description = req.body.subscription_description;

        var no_of_baskets = req.body.total_products;
        var total_price = req.body.total_price;
        var total_weight = req.body.total_weight;       

        var dateFuntion = new Date();
        var year = dateFuntion.getFullYear();
        var month = dateFuntion.getMonth()+1;
        var day = dateFuntion.getDate();

        var date = year+'-'+month+'-'+day;     
        
        var status = req.body.status;

        if(req.file){
          var image = base_url+'uploads/subscriptions/'+req.file.filename;
          var query1 = "UPDATE subscriptions SET subscription_name='"+subscription_name+"',subscription_types='"+type+"',subscription_price='"+subscription_price+"',subscription_sku_code='"+sku_code+"',subscription_city='"+subscription_city+"',subscription_validity='"+subscription_validity+"',subscription_description='"+subscription_description+"',subscription_status='"+status+"',subscription_image='"+image+"',no_of_baskets='"+no_of_baskets+"',total_price='"+total_price+"',total_weight='"+total_weight+"',created_date='"+date+"',updated_date='"+date+"' WHERE subscription_id='"+subscription_id+"'";
        }else{
          var query1 = "UPDATE subscriptions SET subscription_name='"+subscription_name+"',subscription_types='"+type+"',subscription_price='"+subscription_price+"',subscription_sku_code='"+sku_code+"',subscription_city='"+subscription_city+"',subscription_validity='"+subscription_validity+"',subscription_description='"+subscription_description+"',subscription_status='"+status+"',no_of_baskets='"+no_of_baskets+"',total_price='"+total_price+"',total_weight='"+total_weight+"',created_date='"+date+"',updated_date='"+date+"' WHERE subscription_id='"+subscription_id+"'";
        }

        db_connect.query(query1, (uperr, upresult) => {
          if(uperr){
            var returndata = {'CODE':201,'error':uperr,'success':'fail','data':''}
            res.send(returndata); 
          }else{

            var delquery = "DELETE FROM subscription_baskets WHERE subscription_id='"+subscription_id+"'";

            db_connect.query(delquery, (delerr, delresults) => {
              if(delerr){
                var returndata = {'CODE':201,'error':delerr,'success':'fail','data':''}
                res.send(returndata); 
              }else{         

                db_connect.query(query1, (err, results) => {
                  if(err){
                    var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
                    res.send(returndata); 
                  }else{
                    for (var i = 0; i < products.length; i++) {
                      
                      var basket_id = products[i].basket_id;
                      var basket_product_id = products[i].basket_product_id;
                      var basket_name = products[i].basket_name;
                      var basket_category = products[i].basket_category;
                      var basket_company_cost = products[i].basket_company_cost;
                      var basket_sale_price = products[i].basket_sale_price;
                      var basket_type = products[i].basket_type;
                      var basket_weight = products[i].basket_weight;
                      var basket_sku_code = products[i].basket_sku_code;
                      var basket_for = products[i].basket_for;
                      var basket_discount = products[i].basket_discount;
                      var basket_calculate_price = products[i].basket_calculate_price;
                      var in_active = products[i].in_active;
                      var basket_image = products[i].basket_image;
                      var total_products = products[i].total_products;
                      var total_price = products[i].total_price;
                      var total_weight = products[i].total_weight;
                      var created_date = products[i].created_date;
                      var updated_date = products[i].updated_date;
                      var quantity = products[i].quantity;
                      var itemTotal = products[i].itemTotal;

                      var query2 = "INSERT INTO `subscription_baskets`(`subscription_id`,`basket_id`,`basket_name`, `basket_category`, `basket_company_cost`, `basket_sale_price`, `basket_type`, `basket_weight`, `basket_sku_code`, `basket_for`, `basket_discount`, `basket_calculate_price`, `in_active`, `basket_image`, `total_products`, `total_price`, `total_weight`, `created_date`, `updated_date`,`quantity`,`item_totals`) VALUES ('"+subscription_id+"','"+basket_id+"','"+basket_name+"','"+basket_category+"','"+basket_company_cost+"','"+basket_sale_price+"','"+basket_type+"','"+basket_weight+"','"+basket_sku_code+"','"+basket_for+"','"+basket_discount+"','"+basket_calculate_price+"','"+in_active+"','"+basket_image+"','"+total_products+"','"+total_price+"','"+total_weight+"','"+created_date+"','"+updated_date+"','"+quantity+"','"+itemTotal+"')";

                      db_connect.query(query2, (err2, results2) => {
                        if(err2){
                          var returndata = {'CODE':201,'success':'fail','data':err2}
                          res.send(returndata); 
                        }
                      })        
                    }

                    var returndata = {'CODE':200,'success':'success','data':results}
                    res.send(returndata); 

                  }
                });
              }
            }) 
          }
        })      
        
      }else{
        var returndata = {'CODE':201,'error':err0,'success':'fail','data':'Duplicate SKU'}
        res.send(returndata);

      }
    }
  })
});

router.post('/getcitydata', cors(),(req, res) => {
  var id = req.body.id;
  db_connect.query("SELECT * FROM subscription_cities WHERE city_id = '"+id+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':''}
      res.send(returndata);
    }else{      
      var returndata = {'CODE':200,'success':'success','data':results}
      res.send(returndata); 
        
    }  
  });
});

router.post('/updatesubscriptioncity', cors(),(req, res) => {
  var id = req.body.id;
  var name = req.body.name;
  var status = req.body.status;

  var selectq = "SELECT * FROM subscription_cities WHERE city_name='"+name+"' AND city_id != '"+id+"'";

  db_connect.query(selectq, (serr, sresults) => {
    if(serr){
      var returndata = {'CODE':201,'success':'fail','error':serr}
      res.send(returndata);
    }else{ 

      if(sresults!='')   {
        var returndata = {'CODE':201,'success':'fail','error':'City name allready exist. Please try another'}
        res.send(returndata);
      } else {
        var query = "UPDATE `subscription_cities` SET `city_name`='"+name+"',`city_status`='"+status+"' WHERE `city_id`='"+id+"'"
        
        db_connect.query(query, (err, results) => {
          if(err){
            var returndata = {'CODE':201,'success':'fail','data':''}
            res.send(returndata);

          }else{
            var returndata = {'CODE':200,'success':'success','data':''}
            res.send(returndata);
          }
        })
      }
    }
  })
})



module.exports = router;
