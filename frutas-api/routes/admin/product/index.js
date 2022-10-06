var express = require('express');
var fs = require('fs');
const mysql = require('mysql');
var router = express.Router();
var cors = require('cors');
const bcrypt = require('bcrypt');
var multer  = require('multer');
const saltRounds = 10;
const myPlaintextPassword = '1234';
var db_connect = require('../../../database');

router.use(cors());

var config = require('../../../config');
const UPLOAD_BASE_URL = config.UPLOAD_BASE_URL;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products/');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+Date.now()+file.originalname);
    }
});

var upload = multer({ storage: storage });

router.post('/addnewproduct', upload.single('product_image'), cors(),(req, res) => {
  
  var user_id = req.body.user_id;

  var product_categoty = req.body.product_categoty;
  var product_name = req.body.product_name;
  var product_weight = req.body.product_weight;
  var weight_in_kg = req.body.weight_in_kg;
  var weight_in_gm = req.body.weight_in_gm;
  var product_price = req.body.product_price;
  var product_price_type = req.body.product_price_type;
  var product_type = req.body.product_type;
  var product_description = req.body.product_description;
  var product_status = req.body.product_status;
  var product_image = UPLOAD_BASE_URL+'uploads/products/'+req.file.filename;

  var dateFuntion = new Date();
  var year = dateFuntion.getFullYear();
  var month = dateFuntion.getMonth()+1;
  var day = dateFuntion.getDate();

  var date = year+'-'+month+'-'+day; 


  var query = "INSERT INTO products (product_name, product_image,  product_description,product_weight,weight_in_kg,weight_in_gm,product_price,product_category,product_type,product_price_type,product_status,user_no, updated_date) VALUES ('"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+weight_in_kg+"','"+weight_in_gm+"','"+product_price+"','"+product_categoty+"','"+product_type+"','"+product_price_type+"','"+product_status+"','"+user_id+"','"+date+"')";
  db_connect.query(query, (err, results) => {
    if(err){
      var returndata = {'CODE':201,'success':'fail','data':err}
      res.send(returndata); 
    }else{

      var query1 = "INSERT INTO products_history (product_name, product_image,  product_description,product_weight,weight_in_kg,weight_in_gm,product_price,product_category,product_type,product_price_type,product_status,user_no, updated_date) VALUES ('"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+weight_in_kg+"','"+weight_in_gm+"','"+product_price+"','"+product_categoty+"','"+product_type+"','"+product_price_type+"','"+product_status+"','"+user_id+"','"+date+"')";

      db_connect.query(query1, (err1, results) => {
        if(err1){
          var returndata = {'CODE':201,'success':'fail','data':err}
          res.send(returndata); 
        }else{
          var returndata = {'CODE':200,'success':'success','data':results}
          res.send(returndata); 
        }
      })
    }
  });
});

router.post('/updateproduct', upload.single('product_image'), cors(),(req, res) => {
  
  var user_id = req.body.user_id;
  var product_id = req.body.product_id;
  var product_categoty = req.body.product_categoty;
  var product_name = req.body.product_name;
  var product_weight = req.body.product_weight;
  var weight_in_kg = req.body.weight_in_kg;
  var weight_in_gm = req.body.weight_in_gm;
  var product_per_piece = req.body.product_per_piece;
  var product_price = req.body.product_price;
  var product_price_type = req.body.product_price_type;
  var product_type = req.body.product_type;
  var product_description = req.body.product_description;
  var product_status = req.body.product_status;

  try{

    if (req.file) {
      var product_image = UPLOAD_BASE_URL+'uploads/products/'+req.file.filename;
      var query = "UPDATE products SET product_name='"+product_name+"',product_image='"+product_image+"',product_description='"+product_description+"',product_weight='"+product_weight+"',weight_in_kg='"+weight_in_kg+"',weight_in_gm='"+weight_in_gm+"',product_price='"+product_price+"',product_category='"+product_categoty+"',product_type='"+product_type+"',product_price_type='"+product_price_type+"',product_status='"+product_status+"',user_no='"+user_id+"' WHERE product_id='"+product_id+"'";

      var query1 = "INSERT INTO products_history (product_name, product_image,  product_description,product_weight,weight_in_kg,weight_in_gm,product_price,product_category,product_type,product_price_type,product_status,user_no) VALUES ('"+product_name+"','"+product_image+"','"+product_description+"','"+product_weight+"','"+weight_in_kg+"','"+weight_in_gm+"','"+product_price+"','"+product_categoty+"','"+product_type+"','"+product_price_type+"','"+product_status+"','"+user_id+"')";

    }else{
      var query = "UPDATE products SET product_name='"+product_name+"',product_description='"+product_description+"',product_weight='"+product_weight+"',weight_in_kg='"+weight_in_kg+"',weight_in_gm='"+weight_in_gm+"',product_price='"+product_price+"',product_category='"+product_categoty+"',product_type='"+product_type+"',product_price_type='"+product_price_type+"',product_status='"+product_status+"',user_no='"+user_id+"' WHERE product_id='"+product_id+"'";

      var query1 = "INSERT INTO products_history (product_name, product_description,product_weight,weight_in_kg,weight_in_gm,product_price,product_category,product_type,product_price_type,product_status,user_no) VALUES ('"+product_name+"','"+product_description+"','"+product_weight+"','"+weight_in_kg+"','"+weight_in_gm+"','"+product_price+"','"+product_categoty+"','"+product_type+"','"+product_price_type+"','"+product_status+"','"+user_id+"')";
    }

    db_connect.query(query, (err, results) => {
      if(err){
        var returndata = {'CODE':201,'error':err,'success':'fail','data':err}
        res.send(returndata); 
      }else{     

        db_connect.query(query1, (err1, results) => {
          if(err1){
            var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
            res.send(returndata); 
          }else{
            var returndata = {'CODE':200,'success':'success','data':results}
            res.send(returndata); 
          }
        })
      }
    });
  }catch(e){
    console.log(e)
    var returndata = {'CODE':201,'error':e,'success':'fail','data':''}
    res.send(returndata);
  }
});

router.get('/getallproducts', function(req, res, next) {
	const prodsQuery = "SELECT products.*,case when products.product_status > 0 then 'Active' else 'In-Active' end as product_status,product_categories.*,types.*,product_price_type.*,products.product_id as id ,products.product_price as price,pc1.product_category_name as parent_cat,GROUP_CONCAT(types.type_name) as types_names,products.product_price as price  FROM products LEFT JOIN product_categories ON product_categories.id=products.product_category INNER JOIN types ON find_in_set(types.type_id,products.product_type) > 0 LEFT JOIN product_price_type ON product_price_type.price_type_id=products.product_price_type LEFT JOIN product_categories as pc1 ON pc1.id=product_categories.parent_id GROUP BY products.product_id";

	db_connect.query(prodsQuery, function (error, results, fields) {
		if (error){
          	var returndata = {'CODE':201,'error':error,'success':'fail','data':''}
          	res.send(returndata);
        }else{
        	var returndata = {'CODE':200,'error':'','success':'success','products':results}
          	res.send(returndata); 
        }

	})
})

router.get('/getAllActiveProducts', function(req, res, next) {
	const prodsQuery = "SELECT products.*,product_categories.*,types.*,product_price_type.*,products.product_id as id ,products.product_price as price FROM products LEFT JOIN product_categories ON product_categories.id=products.product_category LEFT JOIN types ON types.type_id=products.product_type LEFT JOIN product_price_type ON product_price_type.price_type_id=products.product_price_type WHERE products.product_status ='1'";

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

router.get('/getAllSearchProducts', function(req, res, next) {
  	const search = req.query.search

	const prodsQuery = "SELECT products.*,product_categories.*,types.*,product_price_type.*,products.product_id as id,products.product_price as price FROM products LEFT JOIN product_categories ON product_categories.id=products.product_category LEFT JOIN types ON types.type_id=products.product_type LEFT JOIN product_price_type ON product_price_type.price_type_id=products.product_price_type WHERE products.product_status AND products.product_name LIKE '%"+search+"%'"

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

router.post('/getproductdata', cors(),(req, res) => {
  var product_id = req.body.product_id;
  db_connect.query("SELECT * FROM products where product_id ='"+product_id+"'", (err, results) => {
    if(err){
      var returndata = {'CODE':201,'error':err,'success':'fail','data':''}
      res.send(returndata); 
    }else{
      var resptype = [];
      if(results != ''){
        var product_type = results[0].product_type;
        resptype = product_type.split(",");
      
        var pdata = "SELECT * FROM `types` WHERE `type_id` IN("+resptype+") AND type_status='1'"
        db_connect.query(pdata, (err1, results1) => {
          if(err1){
            var returndata = {'CODE':201,'error':err1,'success':'fail','data':''}
            res.send(returndata); 
          }else{
            var returndata = {'CODE':200,'success':'success','data':results,'selected':results1}
            res.send(returndata);
          }
             
        })
      }else{
        var returndata = {'CODE':200,'success':'success','data':results,'selected':''}
        res.send(returndata);
      }
      
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


router.get('/getAllPageignationProducts', cors(), getAllProductsp);

function getAllProductsp(req, res){
  const limit = 100
  const page = req.query.page
  const offset = (page - 1) * limit
  const prodsQuery = "SELECT products.*,product_categories.*,types.*,product_price_type.*,products.product_id as id ,products.product_price as price,pc1.product_category_name as parent_cat,GROUP_CONCAT(types.type_name) as types_names,products.product_price as price  FROM products LEFT JOIN product_categories ON product_categories.id=products.product_category INNER JOIN types ON find_in_set(types.type_id,products.product_type) > 0 LEFT JOIN product_price_type ON product_price_type.price_type_id=products.product_price_type LEFT JOIN product_categories as pc1 ON pc1.id=product_categories.parent_id GROUP BY products.product_id limit "+limit+" OFFSET "+offset;

  //const prodsQuery = "select *,product_id as id ,product_price as price from products WHERE product_status='1' limit "+limit+" OFFSET "+offset
  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      var pcatedata = "SELECT * FROM product_categories WHERE `parent_id`=''"
      connection.query(pcatedata, function (error1, results1, fields1) {
        var lengths = 0;
        if (error){
          var errors = error;
          var data = '';
        }else{
          var errors = error;
          var data = results;
          if(results != ''){
            lengths = results.length
          }
        }

        var jsonResult = {
          'products_page_count':lengths,
          'page_number':page,
          'products':data,
          'category':results1,
          'error':errors
        }

        var myJsonString = JSON.parse(JSON.stringify(jsonResult));
        res.statusMessage = "Products for page "+page;
        res.statusCode = 200;
        res.json(myJsonString);
        res.end();
      })
    })
  })
}


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
  var query = "SELECT pc3.id ,pc3.product_category_name,case when pc3.product_category_status > 0 then 'Active' else 'In-Active' end as product_category_status, '' as parentcat  FROM `product_categories` as pc3  where pc3.parent_id = '' UNION ALL SELECT pc1.id ,pc1.product_category_name,case when pc1.product_category_status > 0 then 'Active' else 'In-Active' end as product_category_status,pc2.product_category_name as parentcat FROM `product_categories` AS pc1 left join `product_categories` AS pc2 on pc1.parent_id = pc2.id where pc1.parent_id <> '' order BY id DESC"

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

router.get('/getproductactivecategories', cors(),(req, res) => {
  var query = "SELECT * FROM (SELECT pc3.id ,pc3.product_category_name,pc3.product_category_status, '' as parentcat  FROM `product_categories` as pc3  where pc3.parent_id = '' and pc3.product_category_status ='1' UNION ALL SELECT pc1.id ,pc1.product_category_name,pc1.product_category_status,pc2.product_category_name as parentcat FROM `product_categories` AS pc1 left join `product_categories` AS pc2 on pc1.parent_id = pc2.id where pc1.parent_id <> '' and pc2.`product_category_status`='1' and pc1.`product_category_status`='1' order BY id ASC) as xx WHERE parentcat!=''"

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

router.post('/getproductcategydata', cors(),(req, res) => {
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
  var status = req.body.status;

  var query = "UPDATE product_categories SET parent_id='"+parent_category+"',product_category_name='"+product_category_name+"', product_category_status='"+status+"' WHERE id='"+id+"'";

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

router.get('/getactiveproductcategydata', cors(),(req, res) => {
  var id = req.body.id;
  var query = "SELECT * FROM (SELECT pc3.id ,pc3.product_category_name,pc3.product_category_status, '' as parentcat  FROM `product_categories` as pc3  where pc3.parent_id = '' and pc3.product_category_status ='1' UNION ALL SELECT pc1.id ,pc1.product_category_name,pc1.product_category_status,pc2.product_category_name as parentcat FROM `product_categories` AS pc1 left join `product_categories` AS pc2 on pc1.parent_id = pc2.id where pc1.parent_id <> '' and pc2.`product_category_status`='1' and pc1.`product_category_status`='1' order BY id ASC) as xx WHERE parentcat!=''"
  
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


module.exports = router;