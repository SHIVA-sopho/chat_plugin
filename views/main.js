$(function(){

var $window = $('window');
var $sidebar = $('.sidebar');	
var $header = $('.header');
var $content = $('.content');
var $user_info = $('.user_info');
var $name_input = $('.user_info input');

var socket = io.connect();

var username;


//********************************************
var clicked = false;
console.log("js running");
$('.header').click(function(){
	console.log("clicked");
	clicked = !clicked;
	if(clicked)
	{
		if(username)
			$content.css('display','none');
		else
			$user_info.css('display','none');
	}
	else
	{
		if (username) 
		{
			$content.css('display','unset');
		}
		else
		{
			$user_info.css('display','block');
		}
		
	}

});
//***********************************************
function setup_user()
{
	console.log('setup_user called');
	username = $name_input.val();

	if(username)
	{
		console.log('username technically correct');
		socket.emit('new_user_connected',username,function(data){

			if(data)
			{
				console.log(data);
				$user_info.fadeOut();
				$content.show();
				$name_input.off('click');

				var len = data.length;
				for(i = 0 ; i < len;  i++)
				{
					console.log('i = '+ i);
					if(data[i]===username)
						continue;
					$content.append($('<li id = "'+data[i]+'"> ').text(data[i]));
					console.log(data[i]);
				}
			}
			else
			{
				console.log('user already exist');
			}
		});
	}
	else
	{
		console.log(' please enter a username ');
	}	

}

$('.user_info input').keypress(function(key){
	console.log("keypress works");
	if(key.which===13)
	{
		console.log('its an enter key');
		setup_user();
	}
});








/**************************lisstens to the incoming events ************************/
socket.on('new_user_connected',function(data){
	console.log('new user connected recieved');
	if(username)
	{
		$content.append($('<li id = "'+data+'"> ').text(data));
	}
});

});