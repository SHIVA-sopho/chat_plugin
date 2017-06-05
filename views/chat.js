$(function(){

var $window = $('window');
var $sidebar = $('.sidebar');	
var $header = $('.header');
var $content = $('.content');
var $user_info = $('.user_info');
var $name_input = $('.user_info input');


var username


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


}

$('.user_info input').keypress(function(key){
	console.log("keypress works");
	if(key.which===13)
	{
		console.log('its an enter key');
		setup_user();
	}
});

});