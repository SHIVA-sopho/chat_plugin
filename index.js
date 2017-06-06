var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));

var no_of_users = 0;
var users = {};
io.on('connection',function(socket){
	console.log('a socket is conected');
	socket.on('disconnect',function(){
		console.log(socket.username + ' disconnected');
		socket.broadcast.emit('disconnected',socket.username);
		no_of_users--;
		delete users[socket.username];
	});


	socket.on('new_user_connected',function(username,callback){
		console.log('new user connected');
		if(username in users)
		{
			callback(false);
		}
		else
		{
			socket.username = username;
			users[username] = socket; // saving socket for future references
			no_of_users++;
			socket.broadcast.emit('new_user_connected',username);
			callback(Object.keys(users));

		}
		
	});

});

http.listen(3000,function(){
	console.log('listening on port 3000');
});
