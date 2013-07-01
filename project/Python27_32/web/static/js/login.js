
$(document).ready(function () {
	if ("WebSocket" in window) {
	  	ws = new WebSocket("ws://" + document.domain + ":5000/ws");
	  	ws.onmessage = function (msg) {
		    var message = JSON.parse(msg.data);		    
		    if(message.result === "Password correct!") {
		    	// redirect to "index.html"
				alert("Welcome back! user: "+$("#username").attr('value'));
				window.location = "http://127.0.0.1:5000/index";
		    }else{
				alert(message.result);
			}
		};
    };

    // Bind send button to websocket
    $("#btn-login").live("click", function() {
    	var username = $("#username").attr('value');
    	var password = $("#password").attr('value');

    	//ws.send(JSON.stringify({'request': 'get_part', 'table_name': 'part_list'}));
      	ws.send(JSON.stringify({'request': 'getUserName_PasswordCorrect','name': username, 'password': password}));
    });    
});