function stringToHex(str){
　　　　var val="";
　　　　for(var i = 0; i < str.length; i++){
　　　　　　if(val == "")
　　　　　　　　val = str.charCodeAt(i).toString(16);
　　　　　　else
　　　　　　　　val +=str.charCodeAt(i).toString(16);
　　　　}
　　　　return val;
　　}

function inputCheck() {
	var username = $("#username").val(),
		password = $("#password").val();

	if (username.trim() == "") {
		$("#username").focus();
	} else if (password.trim() == "") {
		$("#password").focus();
	} else {
		$("#btn-login").click();
	}
}

$(document).ready(function() {
	if ("WebSocket" in window) {

		ws = new WebSocket("ws://" + document.domain + ":5000/ws");

		ws.onmessage = function(msg) {
			var message = JSON.parse(msg.data);
			if (message.request === "generateRandomsessionKey") {
				sessionStorage.n = message.result.n;
				sessionStorage.e = message.result.e;
			}
			if (message.request === "userLogin") {
				if (message.result === "Password correct!") {
					if ($('#remember').attr('checked') === true) {
						ws.send(JSON.stringify({
							'request': 'getRememberMeTicket'
						}));
					} else {
						self.location = 'index';
					}
				} else {
					$("#username").focus();
					$(".login-warning").fadeIn();
					setTimeout(function() {
						$(".login-warning").fadeOut();
					}, 3000);
				}
			} else if (message.request === "registAUser") {
				console.log(message.result);
				if (message.result == 'registAUser success') {
					alert('Regist A User success!')
					self.location = 'login';
				} else {
					alert('regist fail.')
				}
			} else if (message.request === "getRememberMeTicket") {
				localStorage.userName = $("#username").attr('value');
				localStorage.rememberTicket = message.result;
				//window.location = location.href + "index";
				self.location = 'index';
			} else if (message.request === "userLoginByTicket") {
				if (message.result != 'Ticket error!') {
					localStorage.rememberTicket = message.result;
					self.location = 'index';
				} else {
					alert('Login by remember me ticket error!');
					localStorage.removeItem("rememberTicket");
					localStorage.removeItem("userName");
				}
			}
		};
	};

	$("#mycheckbox").click(function() {
		var checked = $("#remember").attr("checked");

		if (checked == undefined) {
			$("#remember").attr('checked', 'checked');
			$(".checkbox-mask").text("●");
			localStorage.rememberme = 'true';
		} else {
			localStorage.removeItem("rememberTicket");
			localStorage.removeItem("userName");
			localStorage.rememberme = 'false';
			$("#remember").attr('checked', false);
			$(".checkbox-mask").text("");
		}


		console.log(checked);
	});


	// Bind send button to websocket
	$("#btn-login").live("click", function() {
		var username = $("#username").attr('value');
		var password = $("#password").attr('value');

		if (!username) {
			$("#username").focus();

			$("#username").fadeOut().fadeIn();
		} else if(!password) {
			$("#password").focus();

			$("#password").fadeOut().fadeIn();
		} else {
			password = hex_sha1(password);
			sendstr = JSON.stringify({
				'name': username,
				'password': password
			});
			var rsa = new RSAKey();
			rsa.setPublic(sessionStorage.n, sessionStorage.e);
			enstr = sendstr;
			var res = rsa.encrypt(sendstr);
			ws.send(JSON.stringify({
				'request': 'userLogin',
				'data': res
			}));
		}
	});



	//注册页面
	$("#reset").click(function() {
		$('input[name=username]').val("");
		$('input[name=password]').val("");
		$('input[name=email]').val("");
		$('input[name=question]').val("");
		$('input[name=answer]').val("");
		$('input[name=gender]').val("");
	});

	$("#register").click(function() {
		var username = $("input[name=username]").val(),
			pw = $("input[name=password]").val(),
			email = $("input[name=email]").val(),
			gender = $("select[name=gender]").val().toLowerCase(),
			question = $("input[name=question]").val(),
			answer = $("input[name=answer]").val();

		console.log(gender);

		ws.send(JSON.stringify({
			'request': 'registAUser',
			'group_name': 'guest',
			'name': username,
			'password': pw,
			'email': email,
			'gender': gender == "male" ? "1" : "0",
			'question': question,
			'answer': answer
		}));
	});

	ws.onopen = function() {
		ws.send(JSON.stringify({
			'request': 'generateRandomsessionKey'
		}));
	};
});

$(document).keyup(function(evt) {
	if (evt.keyCode == 13) {
		inputCheck();
	}
});

if (!window.btoa) {
	window.btoa = function(text) {
		if (/([^\u0000-\u00ff])/.test(text)) return;
		var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
			i = 0,
			cur, prev, byteNum,
			result = [];

		while (i < text.length) {
			cur = text.charCodeAt(i);
			byteNum = (i + 1) % 3;

			switch (byteNum) {
				case 1: //first byte
					result.push(table.charAt(cur >> 2));
					break;

				case 2: //second byte
					result.push(table.charAt((prev & 3) << 4 | (cur >> 4)));
					break;

				case 0: //third byte
					result.push(table.charAt((prev & 0x0f) << 2 | (cur >> 6)));
					result.push(table.charAt(cur & 0x3f));
					break;
			}

			prev = cur;
			i++;
		}

		if (byteNum == 1) {
			result.push(table.charAt((prev & 3) << 4));
			result.push("==");
		} else if (byteNum == 2) {
			result.push(table.charAt((prev & 0x0f) << 2));
			result.push("=");
		}
		return result.join("");
	}
}