$(document).ready(function() {
	if ("WebSocket" in window) {

		ws = new WebSocket("ws://" + document.domain + ":5000/ws");

		ws.onmessage = function(msg) {
			var message = JSON.parse(msg.data);
			if (message.request === "generateRandomsessionKey") {
				console.log(message.result);
				return;
			}
			if (message.request === "userLogin"){
				if(message.result === "Password correct!") {
					window.location = location.href + "index";
				} else {
					alert(message.result);
				}
			}
		};
	};
	// Bind send button to websocket
	$("#btn-login").live("click", function() {
		var username = $("#username").attr('value');
		var password = $("#password").attr('value');

		if (!username || !password) {

		} else {
			ws.send(JSON.stringify({
				'request': 'userLogin',
				'name': username,
				'password': password
			}));
		}
	});

	/*ws.onopen = function() {
		ws.send(JSON.stringify({
			'request': 'generateRandomsessionKey'
		}));
	};*/
});


function myCheckBox() {

}