var express = require('express');
var fs = require('fs');
var router = express.Router();
var crypto = require('crypto');
var mysql = require('mysql');
var db_connect = require('../database');

var pswrd = 'EW225#7@9&0abDeJ12AA567YGH9)(#~@';
var iv = '12ab567def225ewy';

function decript(code){
  var decipher = crypto.createDecipheriv('aes-256-ctr', pswrd, iv)
  var dec = decipher.update(code,'hex','utf8')
  dec += decipher.final('utf8');
  var decc = dec
  return decc
}

function insertUserdata(userDetails) {
  var sql = 'INSERT INTO node_user SET ?'; 
  db_connect.query(sql, userDetails,function (err, data) {
      if (err) throw err;
          console.log("User data is inserted successfully ");
  });
}

function getuserdata() {
  var getsql = 'SELECT * FROM node_user'; 
  db_connect.query(getsql, function (err, data) {
    if (err) throw err;
    // console.log(data);
    return data;
  });
}

module.exports = {decript, insertUserdata, getuserdata};
