var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));

var no_of_users = 0;
var users = {};
io.on('connection',function(socket){
	console.log('a socket is conected');

	

});

http.listen(3000,function(){
	console.log('listening on port 3000');
});
