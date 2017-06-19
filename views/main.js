
$(function(){

var $window = $('window');
var $sidebar = $('.sidebar');	
var $header = $('.header');
var $content = $('.sidebar > .content');
var $user_info = $('.user_info');
var $name_input = $('.user_info input');

var socket = io.connect();

var username;
var max_no_of_chatbox = 0;
var chatbox = [];

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
/*****************utility functions***********************************************/

function is_sndr_prsnt(sid){

	for(var i=0;i<max_no_of_chatbox;i++)
	{
		if(chatbox[i]===sid)
			return true;		
	}

	return false;

}

/*************************everyhing related to chat popup***************************/

function create_chatbox(chatid){
	console.log('create_chatbox called');
	var len = chatbox.length;
	for(i = 0; i < len ; i++)
	{
		if(chatid === chatbox[i])
		{
			chatbox.splice(i,1);
			chatbox.unshift(chatid);
			display_chatbox();
			return;
		}
	}
	
	console.log('chat id = ' + chatid);
	var elem = '<div class="chatbox" id="'+chatid+'">';
	elem += '<div class="header"><div class="left">'+chatid+'</div> <div class="right"><i class="fa fa-times fa-1.5x" aria-hidden="true"></i></div></div>';
	elem += '<div class="content"><ul></ul> </div>';
	elem += '<div class="footer"><input type="text" placeholder="type here"></div> </div>';
	$('body').append(elem); 
    
    // to close the chatbox
	$('#'+chatid + ' i').on('click',function(){
		close_chatbox(chatid);
	});

	activate_input(chatid);
	chatbox.unshift(chatid);
	display_chatbox();

}
function close_chatbox(id){
	
	for(i = 0; i < max_no_of_chatbox; i++)
	{
		if(chatbox[i] === id)
		{
			chatbox.splice(i,1);
			$('#'+id).css('display','none');
			console.log(chatbox);
			break;
		}
	} 
	display_chatbox();
}


function display_chatbox(){
	console.log('display_chatbox called');
	var width = window.innerWidth;
	console.log('width = ' + width);
	if(width < 540)
	{
		max_no_of_chatbox = 0;
	}
	else
	{
		width = width - 210;
		max_no_of_chatbox = width/315;
		max_no_of_chatbox = Math.floor(max_no_of_chatbox);
	}
	console.log(max_no_of_chatbox);
	var right = 210;
	for(i = 0 ; i < max_no_of_chatbox ; i++)
	{
		if(chatbox[i] == undefined)
			break;

		var elem = $('#'+chatbox[i]);
		elem.css('right',right+'px');
		elem.css('display','block');

		right  = right + 315;
	}
	if(chatbox[max_no_of_chatbox] != undefined)
		$('#'+chatbox[i]).css('display','none');

}

// enables the input of chat box to listen for enter key
function activate_input(chatid){

	var elemid ='#'+chatid +' input'; 
	var msg_box = $('#'+chatid +' > .content > ul');

	$(elemid).keypress(function(key){

		console.log('key pressed');
		if(key.which === 13)
		{
			var $elem = $(this);
			var msg = $elem.val();
			var id = $elem.parents('.chatbox').attr('id');
			var li = '<li class="sent_message"> you:'+ msg +'</li> ';
			msg_box.append(li); //pushing in your message in own side
			$elem.val(''); 
			socket.emit('private_message',msg,id); 
			
		}
	});
}

/**************************************setup of user ****************************************************/
//adds user to the friends list
function add_user(user){
	
	var elem = '<li  id = "'+user+'Id">'+user+'</li>';
	$('.sidebar >.content > ul').append(elem);
	
	/*console.log('frnd_name = '+user);
	$('#'+user+'Id').click(function(){
		create_chatbox(user);
	});*/

	$('#'+user+'Id').on('click',function(){
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
	$('#'+data+'Id').remove();
});


socket.on('private_message',function(msg,sid){
	console.log(sid + ': ' +msg);
	
	if(is_sndr_prsnt(sid) === false)
	{
		create_chatbox(sid);
    }	

	var msg_box = $('#'+sid +' > .content > ul');

	var elem = '<li class = "recived_message">'+sid +':'+ msg +'</li> ';
	msg_box.append(elem);
	

});
});