var db_connect = require('./database');

function add(x, y) {
	
	db_connect.query("SELECT * FROM users", (err, results) => {
	    if(err){
	      	var returndata = {'CODE':201,'success':'success','err':err}
	    	return err; 
	    }else{
	    	return results;
	    }
  		
	});
}

function subtract(x, y) {
  return x - y;
}

module.exports = { add };