var game = {
	gameObject: {
		'x':0,
		'y':0,
		'offsetX':0,
		'offsetY':0,
		'inactiveX':-99999999,
		'inactiveY':-99999999,
		'w':0,
		'h':0,
		'texture':'',

		'geneType':'',
		'alive': true,

		'objectParent':null,
		'objectChildren':[],
		'objectType':'',
		'active': false,
	},
	groups: {},
	translateStack: [],
	displayList: [],
	objectList: [],
	isActive: false,
	mouseStartPosition: {},
	mouseEndPosition: {},
	historyStack: {
		'pointer':-1,
		'stack':[],
	},
	hasChangePosition: false,

	sortNumber: function(a, b) {
		return a["start"] - b["start"];
	},

	setPosition: function(c) { 
		var t = {'x':0, 'y':0}; 
		for(var i = this.translateStack.length-1; i >= 0; i--) { 
			t.x += this.translateStack[i].x; 
			t.y += this.translateStack[i].y; 
		} 
		c.x = t.x; c.y = t.y; 
		this.displayList.push(c); 
	},
 
	setComponentAbsolutePosition: function(c) { 
			this.translateStack.push({'x':c.offsetX, 'y':c.offsetY}); 
			this.setPosition(c); 
			for(var i = 0; i < c.objectChildren.length; i++) { 
				this.setComponentAbsolutePosition(c.objectChildren[i]); 
			} 
			this.translateStack.pop(); 
	},
 
	setTexture: function(c, p) { 
		if(c.geneType == "promoter") {
			c.texture = $("#promoter").clone();  
			c.w=64; c.h=36;
			var s = $("#objectName").clone();
			s.text(c.name);
			s.appendTo(c.texture);
		} else if(c.geneType == "RBS") {
			c.texture = $("#rbs").clone();  
			c.w=64; c.h=36;
			var s = $("#objectName").clone();
			s.text(c.name);
			s.appendTo(c.texture);
		} else if(c.geneType == "Coding") {
			c.texture = $("#coding").clone();  
			c.w=64; c.h=36;
			var s = $("#objectName").clone();
			s.appendTo(c.texture);
			s.text(c.name);
		} else if(c.geneType == "Terminator") {
			c.texture = $("#terminator").clone();  
			c.w=64; c.h=36;
			var s = $("#objectName").clone();
			s.appendTo(c.texture);
			s.text(c.name);
		} else if(c.geneType == "" && c.objectType == "group") {
			c.texture = $("#frame").clone(); 
			c.w=64; c.h=36;
		} else if(c.geneType == "left") {
			c.texture = $("#left").clone();  
			c.w=18; c.h=18;
		} else if(c.geneType == "right") {
			c.texture = $("#right").clone();  
			c.w=18; c.h=18;
		} else if(c.geneType == "del") {
			c.texture = $("#del").clone();  
			c.w=18; c.h=18;
		} else if(c.objectType == "groups") {
			c.texture = $("#root");
			c.w=1224; c.h=554;
			c.id = "root";
		}
		c.originalW = c.w;
		c.originalH = c.h;
		if(c.objectType != "groups") {
			c.texture.removeAttr("id");
			var id = Math.round(Math.random()*1000000000).toString();
			c.texture.attr("id", id);
			c.id = id;
			c.texture.appendTo(p.texture);
		}
	}, 

	scaleObject: function(c) {
		if(c.objectType == "group") {
			c.texture.find("rect").attr("width", (c.originalW*c.scaleX).toString());
			c.texture.find("rect").attr("height", (c.originalH*c.scaleY).toString());
		}
	},

	setTransform: function(c) {
		c.texture.attr("transform", "translate(" + c.offsetX + "," + c.offsetY + ")");
	},

	setInactiveTransform: function(c) {
		c.texture.attr("transform", "translate(" + c.inactiveX + "," + c.inactiveY + ")");
	},
 
	setComponentDisplay: function(groups) { 
		groups.w = $("#root").width; groups.h = $("#root").height; 
		groups.offsetX = 0; groups.offsetY = -1016.3622; groups.x = 0; groups.y = 0; 
		groups.inactiveX = -99999999; groups.inactiveY = -99999999;
		this.setTexture(groups, groups); 
		groups.texture.attr("transform", "translate(" + groups.offsetX + "," + groups.offsetY + ")");
		groups.scaleX = 1; groups.scaleY = 1; 
		for(var i = 0; i < groups.objectChildren.length; i++) {  
			var group = groups.objectChildren[i];  
			this.setTexture(group, groups);  
			group.offsetX = 10;  
			group.offsetY = 10 + i * (group.h*2);  
			group.inactiveX = -99999999; group.inactiveY = -99999999;
			group.texture.attr("transform", "translate(" + group.offsetX + "," + group.offsetY + ")");
			for(var j = 0; j < group.objectChildren.length; j++) {  
				var component = group.objectChildren[j];  
				this.setTexture(component, group);  
				var tempLeft = 0;  
				for(var k = 0; k < j; k++) {  
					tempLeft += group.objectChildren[k].w;  
				}  
				component.offsetX = 10 + tempLeft;  
				component.offsetY = 10;  
				component.inactiveX = -99999999; component.inactiveY = -99999999;
				component.texture.attr("transform", "translate(" + component.offsetX + "," + component.offsetY + ")");
		
				for(var k = 0; k < component.objectChildren.length; k++) {  
					var button = component.objectChildren[k];
					this.setTexture(button, component);
					button.offsetX = 3+20 * k;
					button.offsetY = -15;
					button.inactiveX = -999999;
					button.inactiveY = -999999;
					// button.texture.attr("transform", "translate(" + button.offsetX + "," + button.offsetY + ")");   
					button.texture.attr("transform", "translate(" + button.inactiveX + "," + button.inactiveY + ")"); 
				}  
			}  
			var wholeWidth = 0;  
			for(var j = 0; j < group.objectChildren.length; j++)  
				wholeWidth += group.objectChildren[j].w;  
			var factor = {};
			group.scaleY = 1.4; group.scaleX = ((wholeWidth+20)/group.w);    
			this.scaleObject(group);
			// group.texture.attr("transform", "translate(" + group.offsetX + "," + group.offsetY + " scale(" + "1" + "," + "1" + "))");   
			// group.texture.attr("transform", "scale(" + 1 + ") translate(" + group.offsetX + "," + group.offsetY + ")");  
		}  
		// translateStack = [];   
		// displayList = [];   
		// setComponentAbsolutePosition(groups);   
	}, 
 
	setButtons: function(c) { 
		var left = $.extend(true, {}, this.gameObject); 
		left.objectParent = c; 
		left.objectType = 'button'; 
		left.geneType = 'left'; 
		left.active = false;  
		// left.active = true;   
		c.objectChildren.push(left); 

		var del = $.extend(true, {}, this.gameObject); 
		del.objectParent = c; 
		del.objectType = 'button'; 
		del.geneType = 'del'; 
		del.active = false;  
		// del.active = true;   
		c.objectChildren.push(del); 

		var right = $.extend(true, {}, this.gameObject); 
		right.objectParent = c; 
		right.objectType = 'button'; 
		right.geneType = 'right'; 
		right.active = false;  
		// right.active = true;   
		c.objectChildren.push(right); 
	}, 

	setObjectList: function(c) {
		this.objectList.push(c);
		for(var i = 0; i < c.objectChildren.length; i++) {
			this.setObjectList(c.objectChildren[i]);
		}
	},

	initData: function() {
		var step = 0;
		this.groups = $.extend(true, {}, this.gameObject);
		this.groups.objectType = 'groups';
		for(var k = 0; k < raw_datas.length; k++) {
			raw_data = raw_datas[k];
			// var result = []; 
			var result = $.extend(true, {}, this.gameObject);
			result.objectType = 'group';
			for(var i = 0; i < raw_data["DnaComponent"]["annotaions"].length; i++) {
				if(step < parseInt(raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioStart"])) {
					// var temp = {}; 
					var temp = $.extend(true, {}, this.gameObject);
					temp.objectType = 'component';
					temp.start = step;
					temp.end = parseInt(raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioStart"]) - 1;
					temp.word = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].substring(step, temp.end+1);
					temp.name = "None";


					// temp.color = "#DDDDDD"; 
					temp.objectParent = result;
					// result.objectChildren.push(temp); 
					step = temp.end + 1;
				}
				// var temp1 = {}; 
				var temp1 = $.extend(true, {}, this.gameObject);
				temp1.objectType = 'component';
				temp1.start = parseInt(raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioStart"]);
				temp1.end = parseInt(raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioEnd"]);
				temp1.word = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].substring(temp1.start, temp1.end);
				temp1.name = raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["subComponent"]["DnaComponent"]["name"];

				// temp1.offsetX = 20 * i; 
				// temp1.offsetY = 0; 
				// temp1.w = 20; 
				// temp1.h = 20; 
				temp1.geneType = raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["subComponent"]["DnaComponent"]["type"];
				temp1.alive = true;

				// temp1.color = "#FF" + i + i + i + i; 
				// temp1.color = colors[i % colors.length]; 
				step = temp1.end+1;
				temp1.objectParent = result;
				result.objectChildren.push(temp1);

				this.setButtons(temp1);  
			}
			if(step < raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].length) {
				var temp = {};
				temp.start = step;
				temp.end = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].length;
				temp.word = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].substring(step, temp.end+1);
				temp.name = "None";
				temp.color = "#BBBBBB";
				temp.objectParent = result;
				// result.objectChildren.push(temp); 
				step = temp.end + 1;
			}

			result.wordLength = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].length;
			result.words = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"];

			// circle.x = 130; circle.y = 150; circle.r = 100; 

			result.objectParent = this.groups;
			this.groups.objectChildren.push(result);
		}
		// setComponentDisplay(groups); 
		this.setComponentDisplay(this.groups);
		this.setObjectList(this.groups);
	},

	clear: function(ctx) {
		// var canvas = document.getElementById("game"); 
		// ctx.clearRect(0, 0, canvas.width, canvas.height); 
		for(var i = 0; i < this.objectList.length; i++) {
			this.objectList[i].active = false;
			if(this.objectList[i].objectType == "button") {
				this.setInactiveTransform(this.objectList[i]);
			}
		}
	},

	setButtonActive: function(c) {
		for(var i = 0; i < c.objectChildren.length; i++) {
			var button = c.objectChildren[i];
			button.active = true;
			this.setTransform(button);
		}
	},

	getIndex: function(c) {
		var p = c.objectParent;
		for(var i = 0; i < p.objectChildren.length; i++) {
			if(p.objectChildren[i] == c) {
				return i;
			}
		}
		return -1;
	},

	exchangePosition: function(src, tar) {
		var temp = {};
		temp.offsetX = src.offsetX; temp.offsetY = src.offsetY; 
		src.offsetX = tar.offsetX; src.offsetY = tar.offsetY;
		tar.offsetX = temp.offsetX; tar.offsetY = temp.offsetY;
		this.setTransform(tar); this.setTransform(src);
	},

	removeObjectParent: function(c) {
		if(c.objectParent != null) {
			c.objectParent = null;
		}
		for(var i = 0; i < c.objectChildren.length; i++) {
			this.removeObjectParent(c.objectChildren[i]);
		}
	},

	setObjectParent: function(c) {
		for(var i = 0; i < c.objectChildren.length; i++) {
			c.objectChildren[i].objectParent = c;
			this.setObjectParent(c.objectChildren[i]);
		}
	},

	deepClone: function(c) {
		this.removeObjectParent(c);
		var result = $.extend(true, {}, c); 
		this.setObjectParent(c);
		this.setObjectParent(result);
		return result;
	},

	recordCurrentState: function() {
		while(this.historyStack.stack.length-1 != this.historyStack.pointer && this.historyStack.stack.length > 1) {
			this.historyStack.stack.pop();
		}
		// historyStack.stack.push($.extend(true, {}, groups)); 
		// this.deepClone(groups); 
		this.historyStack.stack.push(this.groups); 
		this.groups = this.deepClone(this.groups);
		this.historyStack.pointer = this.historyStack.pointer + 1;
		this.objectList = [];
		this.setObjectList(this.groups);
	},

	getPreHistoryStackState: function() {
		if(this.historyStack.pointer > 0) {
			this.historyStack.pointer -= 1;
			return this.historyStack.stack[this.historyStack.pointer];
		}
	},

	getNextHistoryStackState: function() {
		if(this.historyStack.pointer < this.historyStack.stack.length - 1) {
			this.historyStack.pointer += 1;
			return this.historyStack.stack[this.historyStack.pointer];
		}
	},

	resetComponentDisplay: function(c) {
		if(c.objectType == "button") {
			if(c.active == true) this.setTransform(c);
			else this.setInactiveTransform(c);
		} else {
			this.setTransform(c);
		}
		if(c.objectType == "group") {
			this.scaleObject(c); 
		}
		for(var i = 0; i < c.objectChildren.length; i++) {
			this.resetComponentDisplay(c.objectChildren[i]);
		}
	},

	setCurrentState: function(c) {
		this.groups = this.deepClone(c);
		for(var i = 0; i < this.objectList.length; i++) {
			this.setInactiveTransform(this.objectList[i]);
		}
		this.objectList = [];
		this.setObjectList(this.groups);
		this.resetComponentDisplay(this.groups);
	},

	moveLeft: function(c) {
		var src = c.objectParent;
		var x = this.getIndex(src);
		if(x > 0) {
			console.log(x);
			var tar = src.objectParent.objectChildren[x-1];
			src.objectParent.objectChildren[x-1] = src;
			src.objectParent.objectChildren[x] = tar;
			this.exchangePosition(src, tar);
			this.recordCurrentState();
		}
	},

	moveRight: function(c) {
		var src = c.objectParent;
		var x = this.getIndex(src);
		if(x < src.objectParent.objectChildren.length-1) {
			console.log(x);
			var tar = src.objectParent.objectChildren[x+1];
			src.objectParent.objectChildren[x+1] = src;
			src.objectParent.objectChildren[x] = tar;
			this.exchangePosition(src, tar);
			this.recordCurrentState();
		}
	},

	removeTexture: function(c) {
		c.inactiveX = -9999999;
		c.inactiveY = -9999999;
		this.setInactiveTransform(c);
		for(var i = 0; i < c.objectChildren.length; i++) {
			this.removeTexture(c.objectChildren[i]);
		}
	},

	deleteGroup: function(c) {
		var x = this.getIndex(c);
		this.removeTexture(c);
		c.alive = false;
		for(var i = x; i < c.objectParent.objectChildren-1; i++) {
			c.objectParent.objectChildren[i] = c.objectParent.objectChildren[i+1];
		}
		c.objectParent.objectChildren.pop();
	},

	reduceGroupTexture: function(c) {
		c.scaleX = c.scaleX - 1;
		this.scaleObject(c)
	},

	deleteComponent: function(c) {
		var src =c.objectParent;
		var x = this.getIndex(src);
		if(src.objectParent.objectChildren.length == 1) {
			this.deleteGroup(src.objectParent);
		} else {
			for(var i = x; i < src.objectParent.objectChildren.length-1; i++) {
				this.exchangePosition(src.objectParent.objectChildren[i], src.objectParent.objectChildren[i+1]);
				src.objectParent.objectChildren[i] = src.objectParent.objectChildren[i+1];
			}
			src.objectParent.objectChildren.pop();
			src.alive = false;
			this.reduceGroupTexture(src.objectParent);
			// src.texture.remove(); 
			this.removeTexture(src);
		}
		this.recordCurrentState();
	},

	prepareComponent: function(selectedObject, part) {
			var tempObj = $.extend(true, {}, this.gameObject);
			tempObj.objectType = 'component';
			tempObj.name = part.part_name;
			tempObj.geneType = part.part_type;
			tempObj.objectParent = selectedObject.objectParent;
			selectedObject.objectParent.objectChildren.push(tempObj);
			var x = this.getIndex(selectedObject);
			for(var j = selectedObject.objectParent.objectChildren.length-1; j > x+1; j--) {
				selectedObject.objectParent.objectChildren[j] = selectedObject.objectParent.objectChildren[j-1];
				selectedObject.objectParent.objectChildren[j].offsetX += selectedObject.objectParent.objectChildren[j].w;
				this.setTransform(selectedObject.objectParent.objectChildren[j]);
			}
			selectedObject.objectParent.objectChildren[x+1] = tempObj;
			this.setButtons(tempObj);  

			this.setTexture(tempObj, tempObj.objectParent);
			tempObj.objectParent.scaleX += 1;
			this.scaleObject(tempObj.objectParent);

			var tempLeft = 0;  
			for(var k = 0; k < x+1; k++) {  
				tempLeft += tempObj.objectParent.objectChildren[k].w;  
			}  
			tempObj.offsetX = 10 + tempLeft;  
			tempObj.offsetY = 10;  
			tempObj.inactiveX = -999999;
			tempObj.inactiveY = -999999;
			this.setTransform(tempObj);

			for(var k = 0; k < tempObj.objectChildren.length; k++) {  
				var button = tempObj.objectChildren[k];
				this.setTexture(button, tempObj);
				button.offsetX = 3+20 * k;
				button.offsetY = -15;
				button.inactiveX = -999999;
				button.inactiveY = -999999;
				// button.texture.attr("transform", "translate(" + button.offsetX + "," + button.offsetY + ")");   
				button.texture.attr("transform", "translate(" + button.inactiveX + "," + button.inactiveY + ")"); 
			}  
			return tempObj;
									
	},

	addComponent: function(part) {
		for(var i = 0; i < this.objectList.length; i++) {
			if(this.objectList[i].active && this.objectList[i].objectType == "component") {
				this.prepareComponent(this.objectList[i], part); 
				this.recordCurrentState();
				break;
			}
		}
	},
}



$(function(){
	$(".component").live("mousedown", function(e) {   
		var targetC = $(this);  
		for(var i = 0; i < game.objectList.length; i++) {       
			if(game.objectList[i].id == targetC.parent().attr("id")) {   
				var selectedObject = game.objectList[i];  
				if(selectedObject.objectType == "group") {  
					game.clear();   
					selectedObject.active = true;			  
					game.isActive = true;  
					game.mouseStartPosition.x = e.pageX;  
					game.mouseStartPosition.y = e.pageY;  
				} else if(selectedObject.objectType == "groups") {  
					game.clear();  
				}  
			}        
		}       
	});   
  
	$(".component").live("click", function(e) {  
		var targetC = $(this);  
		for(var i = 0; i < game.objectList.length; i++) {       
			if(game.objectList[i].id == targetC.parent().attr("id")) {   
				var selectedObject = game.objectList[i];  
				if(selectedObject.objectType == "component") {  
					game.clear();  
					selectedObject.active = true;
					game.setButtonActive(selectedObject);  
				} else if(selectedObject.objectType == "button") {  
					if(selectedObject.geneType == "left") {  
						game.moveLeft(selectedObject);  
						break;
					} else if(selectedObject.geneType == "right") {  
						game.moveRight(selectedObject);  
						break;
					} else if(selectedObject.geneType == "del") {  
						game.deleteComponent(selectedObject);  
						break;
					}  
				}  
			}        
		}       
	});  
  
	$("#root").live("mousemove", function(e) {  
		if(game.isActive) {  
			for(var i = 0; i < game.objectList.length; i++) {  
				if(game.objectList[i].active && game.objectList[i].objectType == "group") {  
					game.mouseEndPosition.x = e.pageX;  
					game.mouseEndPosition.y = e.pageY;  
					var dx = game.mouseEndPosition.x - game.mouseStartPosition.x;  
					var dy = game.mouseEndPosition.y - game.mouseStartPosition.y;  
					game.objectList[i].offsetX = game.objectList[i].offsetX + dx;  
					game.objectList[i].offsetY = game.objectList[i].offsetY + dy;  
					game.setTransform(game.objectList[i]);		  
					game.mouseStartPosition.x = e.pageX;  
					game.mouseStartPosition.y = e.pageY;  
					game.hasChangePosition = true;  
				}  
			}  
		}  
	});  
  
	$("#root").live("mouseup", function(e) {  
		if(game.isActive) {  
			for(var i = 0; i < game.objectList.length; i++) {  
				if(game.objectList[i].active && game.objectList[i].objectType == "group") {  
					game.objectList[i].active = false;  
					game.isActive = false;  
					if(game.hasChangePosition) {  
						game.recordCurrentState();  
						game.hasChangePosition = false;  
					}  
				}  
			}  
		  
		}  
	});  
  
	$("#backwardI").live("click", function(e) {  
		// if(historyStack)   
		if(game.historyStack.pointer > 0) {  
			game.setCurrentState(game.getPreHistoryStackState());  
		}  
	});  
  
	$("#forwardI").live("click", function(e) {  
		if(game.historyStack.pointer < game.historyStack.stack.length-1) {  
			game.setCurrentState(game.getNextHistoryStackState());  
		}	  
	});  
	  






	game.initData(); 
	game.recordCurrentState();
});
