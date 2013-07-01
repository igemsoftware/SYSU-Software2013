var configbar = {
	createInput: function(attr, defaultValue) {
		var div = document.createElement("div");
		div.className = "input-prepend";
		var label = document.createElement("label");
		label.className = "add-on"
		label.innerText = attr + ":";
		var input = document.createElement("input");
		input.type = "text";
		input.id = attr + "-input";
		input.name = attr + "-input";
		input.value = defaultValue;
		div.appendChild(label);
		div.appendChild(input);

		return div;
	},

	saveData: function(id, JSONdata) {
		storage.setItem(id, JSON.stringify(JSONdata));
		ws.onopen = function() {
			dataToSend=JSON.stringify({'request': 'saveUserData','data':JSON.stringify(JSONdata)});
			ws.send(dataToSend);
			console.log(dataToSend);
		}				
		//storage.clear();
	},

	setAttributes: function(id) {
		// 生成config bar并添加标题 
		var configBar = document.getElementById("optionpanel");
		configBar.innerHTML = "";
		var h3 = document.createElement("h3");
		h3.innerText = "Config Bar";
		configBar.appendChild(h3);

		// add input for id
		//var defaultValue = storage.getItem(id) === null ? "" : storage.getItem(id);
		var idInput = this.createInput("id", "");
		configBar.appendChild(idInput);

		// add input for seq
		var seqInput = this.createInput("seq", "");
		configBar.appendChild(seqInput);

		// add button 
		var btn_save = document.createElement("button");
		btn_save.id = "btn-save";
		btn_save.innerText = "save";
		var thisObj = this;
		btn_save.onclick = function() {
			var inputList = document.getElementsByTagName("input");
			var elem = {};
			var key = inputList[0].value;
			for (var i = 0; i < inputList.length; i++) {
				elem[inputList[i].id] = inputList[i].value;
			};
			
			thisObj.saveData(id, elem);

			//alert("saved. ^_^! ");
		};
		configBar.appendChild(btn_save);
	},

	showAttributes: function(JSONdata) {
		//example
		//console.log(JSONdata);
		var id = JSONdata["rsbpml"]["part_list"]["part"]["part_id"];
		var seq = JSONdata["rsbpml"]["part_list"]["part"]["sequences"]["seq_data"];
		var attrs = [{
				attrName: "id",
				attrValue: id
			}, {
				attrName: "seq",
				attrValue: seq
			}
		];
		// 生成config bar并添加标题 
		var configBar = document.getElementById("optionpanel");
		configBar.innerHTML = "";
		var h3 = document.createElement("h3");
		h3.innerText = "Config Bar";
		configBar.appendChild(h3);

		// 添加属性
		for (var i = 0; i < attrs.length; i++) {
			var p = document.createElement("p");
			p.innerText = attrs[i].attrName + ": " + attrs[i].attrValue;
			configBar.appendChild(p);
		}
	}
};