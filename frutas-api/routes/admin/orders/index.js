var express = require('express');
var fs = require('fs');
const mysql = require('mysql');
var router = express.Router();
var multer  = require('multer');
var cors = require('cors');
var path = require("path");
const bcrypt = require('bcrypt');

var pdf = require("pdf-creator-node");

var config = require('../../../config');
const base_url = config.BASE_URL;

const saltRounds = 10;
const myPlaintextPassword = '1234';
var db_connect = require('../../../database');

router.use(cors());

router.get('/getallorders',(req, res) => {
    //var token = req.body.token
    var customer_id = req.body.customer_id
    var query = "SELECT order_master.*,order_status_master.*, case when order_master.order_master_status = 2 then 'Completed' when order_master.order_master_status = 3 then 'Processing' when order_master.order_master_status = 4 then 'Delivered' when order_master.order_master_status = 5 then 'Shipped' when order_master.order_master_status = 6 then 'On Hold' else 'Pending' end as order_status FROM `order_master` LEFT JOIN order_status_master on order_status_master.id=order_master.order_master_status order by order_no DESC";
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
          var query1 = "SELECT * FROM `order_status_master`";
          db_connect.query(query1, (err1, results1) => {
            if (err1) {
              returndata = {'CODE':202,'error':err1,'success':'success','data':''}
              res.send(returndata);
            }else{         

              returndata = {'CODE':200,'error':'','success':'success','data':results,'order_status':results1}
              res.send(returndata);
            }
          })
        }
    })
});

router.get('/getorderstatus',(req, res) => {
  //var token = req.body.token
  var customer_id = req.body.customer_id
  var query = "SELECT * FROM `order_status_master`";
  db_connect.query(query, (err, results) => {
    if (err) {
      returndata = {'CODE':202,'error':err,'success':'success','data':''}
      res.send(returndata);
    }else{
      returndata = {'CODE':200,'error':'','success':'success','data':results}
      res.send(returndata);
    }
  })
});

router.post('/updatestatus',(req, res) => {
    //var token = req.body.token
    var user_no = req.body.user_no
    var order_no = req.body.order_no
    var status = req.body.status

    var dateFuntion = new Date();
    var year = dateFuntion.getFullYear();
    var month = dateFuntion.getMonth()+1;
    var day = dateFuntion.getDate();

    var date = year+'-'+month+'-'+day;


    var query = "UPDATE `order_master` SET `order_master_status`= '"+status+"',`user_no`= '"+user_no+"' WHERE `order_no`='"+order_no+"'";
    db_connect.query(query, (err, results) => {
      if (err) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{   
        var history= "INSERT INTO `order_status_history`(`order_no`, `status`, `user_no`, `created_date`) VALUES ('"+order_no+"','"+status+"','"+user_no+"','"+date+"')";

        db_connect.query(history, (err1, results1) => {
          if (err) {
            returndata = {'CODE':202,'error':err,'success':'success','data':''}
            res.send(returndata);
          }else{ 

            returndata = {'CODE':200,'error':'','success':'success','data':results}
            res.send(returndata);     
          }
        })      
      }
    })
});

router.post('/getorderdetails',(req, res) => {
    //var token = req.body.token
    var order_no = req.body.order_no
    var query = "SELECT order_master.*,order_details.*,baskets.* FROM `order_master` LEFT JOIN order_details ON order_details.order_no = order_master.order_no LEFT JOIN baskets ON baskets.basket_id=order_details.item_id WHERE order_master.order_no='"+order_no+"'";
    db_connect.query(query, (err, results) => {
        if (err) {
          returndata = {'CODE':202,'error':err,'success':'success','data':''}
          res.send(returndata);
        }else{
          var query1 = "SELECT * FROM `order_master` WHERE order_no='"+order_no+"'";
          db_connect.query(query1, (err1, results1) => {
            if (err1) {
              returndata = {'CODE':202,'error':err1,'success':'success','data':''}
              res.send(returndata);
            }else{         

              returndata = {'CODE':200,'error':'','success':'success','data':results,'order':results1}
              res.send(returndata);
            }
          })
        }
    })
});

router.post('/addordernote',(req, res) => {
    //var token = req.body.token
    var order_no = req.body.order_no
    var message = req.body.message
    var type = req.body.type
    var query = "INSERT INTO `order_notes`(`order_no`, `type`, `message`) VALUES ('"+order_no+"','"+type+"','"+message+"')";
    db_connect.query(query, (err, results) => {
      if (err) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{   
        returndata = {'CODE':200,'error':'','success':'success','data':results}
        res.send(returndata);           
      }
    })
});

router.post('/getordernote',(req, res) => {
    //var token = req.body.token
    var order_no = req.body.order_no
    var query = "SELECT * FROM `order_notes` WHERE `order_no`='"+order_no+"' ORDER BY `note_id` DESC";
    db_connect.query(query, (err, results) => {
      if (err) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{   
        returndata = {'CODE':200,'error':'','success':'success','data':results}
        res.send(returndata);           
      }
    })
});

router.post('/deleteordernote',(req, res) => {
    //var token = req.body.token
    var note_id = req.body.note_id
    var query = "DELETE FROM `order_notes` WHERE `note_id`='"+note_id+"'";
    db_connect.query(query, (err, results) => {
      if (err) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{   
        returndata = {'CODE':200,'error':'','success':'success','data':''}
        res.send(returndata);           
      }
    })
});

router.post('/updateorder',(req, res) => {
    //var token = req.body.token
    var user_no = req.body.user_no
    var order_no = req.body.order_no
    var status = req.body.status
    var tracking_code = req.body.tracking_code
    var carrier_name = req.body.carrier_name
    var pickup_date = req.body.pickup_date

    var dateFuntion = new Date(pickup_date);
    var year = dateFuntion.getFullYear();
    var month = dateFuntion.getMonth()+1;
    var day = dateFuntion.getDate();

    var date = year+'-'+month+'-'+day;

    var newdateFuntion = new Date();
    var year = newdateFuntion.getFullYear();
    var month = newdateFuntion.getMonth()+1;
    var day = newdateFuntion.getDate();

    var current_date = year+'-'+month+'-'+day; 

    var query = "UPDATE `order_master` SET `tracking_code`='"+tracking_code+"',`carrier_name`='"+carrier_name+"',`pickup_date`='"+date+"',`order_master_status`='"+status+"' WHERE `order_no`='"+order_no+"'";
    db_connect.query(query, (err, results) => {
      if (err) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{   

        var orderdata = "SELECT * FROM `order_master` WHERE `order_no`='"+order_no+"'"
        db_connect.query(orderdata, (er1, reslt1) => {
          if (er1) {
            returndata = {'CODE':202,'error':er1,'success':'success','data':''}
            res.send(returndata);
          }else{ 
            if(reslt1[0].order_master_status === status){
              returndata = {'CODE':200,'error':'','success':'success','data':''}
              res.send(returndata);   
            }else{
              var history= "INSERT INTO `order_status_history`(`order_no`, `status`, `user_no`, `created_date`) VALUES ('"+order_no+"','"+status+"','"+user_no+"','"+current_date+"')";

              db_connect.query(history, (err1, results1) => {
                if (err) {
                  returndata = {'CODE':202,'error':err,'success':'success','data':''}
                  res.send(returndata);
                }else{ 

                  returndata = {'CODE':200,'error':'','success':'success','data':results}
                  res.send(returndata);     
                }
              }) 
            }
          }
        })
                  
      }
    })
});

router.post('/createinvoice',async (req, res) => {
  //var token = req.body.token
  var order_no = req.body.order_no

  var pdfFileName = order_no;
  pdfFileName = pdfFileName+'.pdf';

  //var html = fs.readFileSync("./invoice.html", "utf8");
  var html = fs.readFileSync(path.join(__dirname, "./invoice.html"), "utf8");

  var options = {
    printBackground: true,
    border: "10mm",
    format: 'A3',
    base: 'file://' + path.resolve('./public') + '/'
  };

  var query = "SELECT order_master.*,order_details.*,baskets.* FROM `order_master` LEFT JOIN order_details ON order_details.order_no = order_master.order_no LEFT JOIN baskets ON baskets.basket_id=order_details.item_id WHERE order_master.order_no='"+order_no+"'";
  var order_baskets = await executeQuery(query);

  var query1 = "SELECT * FROM `order_master` WHERE order_no='"+order_no+"'";
  var order_detail = await executeQuery(query1);

  var invoicenumberupdate = await invoice_number_update();

  var dateFuntion = new Date();
  var year = dateFuntion.getFullYear();
  var month = dateFuntion.getMonth()+1;
  var day = dateFuntion.getDate();
  if(month < 10){
    month = '0'+month
  }
  if(day < 10){
    day = '0'+day
  }

  var current_date = day+'-'+month+'-'+year;


  let imgSrc = 'file://' + path.resolve('./public') + '/logo.jpg';  
  imgSrc = path.normalize(imgSrc);  

  var document = {
    html: html,
    imgSrc: imgSrc,
    data: {
      current_date: current_date,
      order_baskets: order_baskets,
      order_detail: order_detail[0],
    },
    path: "./order_invoice/"+pdfFileName,
    type: "defaults to pdf", // "stream" || "buffer" || "" ("" defaults to pdf)
  };

  pdf.create(document, options)
  .then( async(resp) => {

    var get_no = "SELECT * FROM `invoice_no`";
    var get_no_data = await executeQuery(get_no);

    if(get_no_data != ''){
      var order_query = "UPDATE `order_master` SET `invoiced`='1',`invoice_no`='"+get_no_data[0].number+"' WHERE `order_no`='"+order_no+"'";
    }else{
      var order_query = "UPDATE `order_master` SET `invoiced`='1',`invoice_no`='1' WHERE `order_no`='"+order_no+"'";
    }

    db_connect.query(order_query, (err, results) => {
      if (err) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{   
        returndata = {'CODE':200,'error':'','success':'success','data':''}
        res.send(returndata);           
      }
    })

  })
  .catch((error) => {
    console.log(error);
    returndata = {'CODE':202,'error':error,'success':'success','data':''}
    res.send(returndata);
  });

});

router.post('/deleteinvoice',async (req, res) => {
  //var token = req.body.token
  var order_no = req.body.order_no

  var pdfFileName = order_no;
  pdfFileName = './order_invoice/'+pdfFileName+'.pdf';

  try {
    await fs.unlinkSync(pdfFileName);

    var query = "UPDATE `order_master` SET `invoiced`='0' WHERE `order_no`='"+order_no+"'";
    db_connect.query(query, (err, results) => {
      if (err) {
        returndata = {'CODE':202,'error':err,'success':'success','data':''}
        res.send(returndata);
      }else{   
        returndata = {'CODE':200,'error':'','success':'success','data':''}
        res.send(returndata);           
      }
    })

  } catch (error) {
    returndata = {'CODE':202,'error':error,'success':'success','data':''}
    res.send(returndata);
  }

});


function invoice_number_update(){
  var query = "UPDATE `invoice_no` SET `number`= `number`+1";
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