/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var app = express();
app.use('/', express.static('./'));
app.listen(8080);
console.log("Server is Running Press Ctrl-C to Exit");

