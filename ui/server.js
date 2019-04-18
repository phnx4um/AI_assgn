console.log("server is starting")

var express = require('express');
var app = express();

var server = app.listen(3000, function(){
	console.log("server is listening");
});


app.use(express.static("website"));
