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
$(document).ready(function() {
	if ("WebSocket" in window) {

		ws = new WebSocket("ws://" + document.domain + ":5000/ws");

		ws.onmessage = function(msg) {
			var message = JSON.parse(msg.data);
			if (message.request === "generateRandomsessionKey") {
				console.log(message.result);
				var rsa = new RSAKey();
  				rsa.setPublic(message.result.n,message.result.e);  				
				enstr='password';
				var res = rsa.encrypt(enstr);
				ws.send(JSON.stringify({'request': 'decrypt','crypto':res}));				
			}
			if (message.request === "decrypt") {
				console.log(message.result);
				return;
			}
			if (message.request === "base64Test") {
				console.log(message.result,'message');	
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

	ws.onopen = function() {
		ws.send(JSON.stringify({
			'request': 'generateRandomsessionKey'
		}));
	};
});

if(!window.btoa) {
    window.btoa  = function(text) {
        if (/([^\u0000-\u00ff])/.test(text)) return;
        var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            i = 0,
            cur, prev, byteNum,
            result=[];    

        while(i < text.length){
            cur = text.charCodeAt(i);
            byteNum = (i+1) % 3;

            switch(byteNum){
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

        if (byteNum == 1){
            result.push(table.charAt((prev & 3) << 4));
            result.push("==");
        } else if (byteNum == 2){
            result.push(table.charAt((prev & 0x0f) << 2));
            result.push("=");
        }
        return result.join("");
    }
} 
function myCheckBox() {

}