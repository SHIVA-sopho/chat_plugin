
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

/*************************everyhing related to chat popup********;*******************/

function create_chatbox(chatid){
	console.log('chat id = ' + chatid);
	var elem = '<div class="chatbox" id="chatid">';
	elem += '<div class="header"> <div class="left"> </div> <div class="right"> </div></div>';
	elem += '<div class="content"> <ul></ul> </div>';
	elem += '<div class="footer"><input type="text" placeholder="type here"></div> </div>';
	$('body')[0].innerHTML += elem; 


}
//adds user to the friends list
function add_user(user){
	
	$content.append($('<li id = "'+user+'"> ').text(user));
	
	console.log('frnd_name = '+user);
	$('#'+user).click(function(){
		create_chatbox(user);
	});
}


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
				for(i = 0 ; i < len - 1;  i++)
				{

					add_user(data[i]);
					

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

/* function which listens for the name of the user  */
$('.user_info input').keypress(function(key){
	console.log("keypress works");
	if(key.which===13)
	{
		console.log('its an enter key');
		setup_user();
	}
});
//***********************************************************************************



/**************************lisstens to the incoming events ************************/
socket.on('new_user_connected',function(data){
	console.log('new user connected recieved');
	if(username)
	{
		add_user(data);
	}
});

socket.on('disconnected',function(data){
	console.log(data +' disconnected');
	$('#'+data).remove();
});



});