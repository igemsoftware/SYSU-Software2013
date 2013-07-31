$(document).ready(function() {
	console.log(location.href);
	if ("WebSocket" in window) {
		ws = new WebSocket("ws://" + document.domain + ":5000/ws");
		ws.onmessage = function(msg) {
			var message = JSON.parse(msg.data);
			if (message.result === "Password correct!") {
				// redirect to "index.html"
				alert("Welcome back! user: " + $("#username").attr('value'));

				window.location = location.href + "index";
			} else {
				alert(message.result);
			}
		};
	};

	// Bind send button to websocket
	$("#btn-login").live("click", function() {
		var username = $("#username").attr('value');
		var password = $("#password").attr('value');

		//ws.send(JSON.stringify({'request': 'get_part', 'table_name': 'part_list'}));
		ws.send(JSON.stringify({
			'request': 'userLogin',
			'name': username,
			'password': password
		}));
	});

	$("#btn-reset").live("click", function() {
		$("#username").reset();
		$("#password").reset();
	});

	$("#username").change(function() {
		if ($(this).val()) {
			$(this).css({
				"background": "rgba(80, 80, 80, 0.3)"
			});
		} else {
			// $(this).css({
			// 	"background-image": "url(../static/img/user.png)",
			// 	"background-position": "5px 5px",
			// 	"background-repeat": "no-repeat"
			// });
		}
	});

	$("#password").change(function() {
		if ($(this).val()) {
			$(this).css({
				"background": "rgba(80, 80, 80, 0.3)"
			});
		} else {
			// $(this).css({
			// 	"background-image": "url(../static/img/password.png)",
			// 	"background-position": "5px 5px",
			// 	"background-repeat": "no-repeat"
			// });
		}
	});
});