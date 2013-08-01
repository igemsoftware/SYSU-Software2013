$(document).ready(function() {
	console.log(location.href);
	if ("WebSocket" in window) {
		ws = new WebSocket("ws://" + document.domain + ":5000/ws");
		ws.onmessage = function(msg) {
			var message = JSON.parse(msg.data);
			if (message.result === "Password correct!") {
				$("#login-info").html("<strong>Welcome back!</strong>  User: " + $("#username").attr('value'));
				$("#login-info").removeClass("alert-error");
				$("#login-info").addClass("alert-success");
				$("#login-info").css("visibility", "visible");

				setTimeout(function(){
					window.location = location.href + "index";
				}, 1000);
				
			} else {
				console.log(message.result);
				$("#login-info").html("<strong>Warning!</strong> " + message.result);
				$("#login-info").addClass("alert-error");
				$("#login-info").css("visibility", "visible");
			}
		};
	};

	// Bind send button to websocket
	$("#btn-login").live("click", function() {
		var username = $("#username").attr('value');
		var password = $("#password").attr('value');

		if (!username || !password) {
			$("#login-info").html("<strong>Warning!</strong> Username or password can't be empty!");
			$("#login-info").addClass("alert-error");
			$("#login-info").css("visibility", "visible");
		} else {
			ws.send(JSON.stringify({
				'request': 'userLogin',
				'name': username,
				'password': password
			}));
		}
	});

	$("#btn-reset").live("click", function() {
		$("#username").reset();
		$("#password").reset();
	});
});