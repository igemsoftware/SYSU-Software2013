		// alert("asdf");  
var game = { 
	gameObject: { 
		// 'x':0,   
		// 'y':0,   
		// 'offsetX':0,   
		// 'offsetY':0,   
		// 'inactiveX':-99999999,   
		// 'inactiveY':-99999999,   
		// 'w':0,   
		// 'h':0,   
		// 'texture':'',   
		textureInfo: {  
			offsetX: 0,  
			offsetY: 0,  
			scaleX: 1,  
			scaleY: 1,  
			w: 0,  
			h: 0,  
			texture: null,  
			setTexture: function(c) {  
				if(c.specificType == '')  
				var cTexture = c.textureInfo;  
				if(c.specificType == "promoter") {  
					c.textureInfo.texture = $("#promoter").clone();    
				} else if(c.specificType == "RBS") {  
					c.textureInfo.texture = $("#rbs").clone();    
				} else if(c.specificType == "Coding") {  
					c.textureInfo.texture = $("#coding").clone();    
				} else if(c.specificType == "Terminator") {  
					c.textureInfo.texture = $("#terminator").clone();    
				} else if(c.specificType == "" && c.gradeType == "group") {  
					c.textureInfo.texture = $("#frame").clone();   
					c.textureInfo.w=64; c.textureInfo.h=36;  
				} else if(c.specificType == "left") {  
					c.textureInfo.texture = $("#left").clone();    
					c.textureInfo.w=18; c.textureInfo.h=18;  
				} else if(c.specificType == "right") {  
					c.textureInfo.texture = $("#right").clone();    
					c.textureInfo.w=18; c.textureInfo.h=18;  
				} else if(c.specificType == "del") {  
					c.textureInfo.texture = $("#del").clone();    
					c.textureInfo.w=18; c.textureInfo.h=18;  
				} else if(c.gradeType == "groups") {  
					c.textureInfo.texture = $("#root");  
					c.textureInfo.w=1224; c.textureInfo.h=554;  
					c.textureInfo.id = "root";  
				}  
  
				if(c.specificType == "promoter" || c.specificType == "RBS" || c.specificType == "Coding" || c.specificType == "Terminator") {  
					c.textureInfo.w=64; c.textureInfo.h=36;  
					var s = $("#objectName").clone();  
					s.text(c.specificInfo.name);  
					s.appendTo(c.textureInfo.texture);  
				}  
				// c.textureInfo.originalW = c.w;   
				// c.textureInfo.originalH = c.h;   
				if(c.gradeType != "groups") {  
					c.textureInfo.texture.removeAttr("id");  
					var id = Math.round(Math.random()*1000000000).toString();  
					c.textureInfo.texture.attr("id", id);  
					c.textureInfo.id = id;  
					c.textureInfo.texture.appendTo(c.objectParent.textureInfo.texture);  
				}  
			},  
			getSize: function(c) {  
				if(c.textureInfo.texture == null)				   
					c.textureInfo.setTexture(c);  
				var result = {};  
				result.w = c.textureInfo.w;  
				result.h = c.textureInfo.h;  
				return result;  
			},  
			setSize: function(c) {  
				if(c.textureInfo.texture == null)				   
					c.textureInfo.setTexture(c);  
				if(c.gradeType == "group") {  
					var l0 = 20;  
					var l1 = 0;  
					for(var i = 0; i < c.objectChildren.length; i++) {  
						if(c.objectChildren[i].active) {  
							l0 += c.objectChildren[i].textureInfo.getSize(c.objectChildren[i]).w;  
							l1 = c.objectChildren[i].textureInfo.getSize(c.objectChildren[i]).h;  
						}  
					}  
					l1 += 20;
					c.textureInfo.w = l0;  
					c.textureInfo.h = l1;  
					c.textureInfo.texture.find("rect").attr("width", (l0).toString());  
					c.textureInfo.texture.find("rect").attr("height", (l1).toString());  
				} else if(c.gradeType == "component") {  
				}  
			},  
			getOffset: function(c) {  
			},  
			setOffset: function(c) {  
				if(c.textureInfo.texture == null)				   
					c.textureInfo.setTexture(c);  
				if(c.active == false) {  
					if(c.gradeType == "group") {
					}
					c.textureInfo.texture.attr("transform", "translate(-99999999,-99999999)");   
				} else {  
					if(c.gradeType == "group") {  
						if(arguments.length == 1 && c.textureInfo.offsetX == 0 && c.textureInfo.offsetY == 0) {
							var p = c.objectParent;
							var tempOffsetX = 100;
							var tempOffsetY = 20;
							for(var i = 0; i < p.objectChildren.length; i++) {
								if(p.objectChildren[i].active) {
									tempOffsetY += p.objectChildren[i].textureInfo.getSize(p.objectChildren[i]).h * 2;
									if(p.objectChildren[i] == c) break;  
								}
							}
							c.textureInfo.offsetX = tempOffsetX;
							c.textureInfo.offsetY = tempOffsetY;
							c.textureInfo.texture.attr("transform", "translate(" + tempOffsetX.toString() + "," + tempOffsetY.toString() + ")");   
						} else if(arguments.length == 3) {
							c.textureInfo.offsetX += arguments[1];
							c.textureInfo.offsetY += arguments[2];
							c.textureInfo.texture.attr("transform", "translate(" + c.textureInfo.offsetX.toString() + "," + c.textureInfo.offsetY.toString() + ")");   
						} else if(arguments.length == 1) {
							c.textureInfo.texture.attr("transform", "translate(" + c.textureInfo.offsetX.toString() + "," + c.textureInfo.offsetY.toString() + ")");   
						}
					} else if(c.gradeType == "component") {  
						var p = c.objectParent;  
						var tempOffsetX = 10;  
						var tempOffsetY = 10;  
						for(var i = 0; i < p.objectChildren.length; i++) {  
							if(p.objectChildren[i].active) {  
								if(p.objectChildren[i] == c) break;  
								tempOffsetX += p.objectChildren[i].textureInfo.getSize(p.objectChildren[i]).w;  
							}  
						}  
						c.textureInfo.offsetX = tempOffsetX;  
						c.textureInfo.offsetY = tempOffsetY;  
						c.textureInfo.texture.attr("transform", "translate(" + tempOffsetX.toString() + "," + tempOffsetY.toString() + ")");   
					} else if(c.gradeType == "button") {  
						var p = c.objectParent;  
						c.textureInfo.offsetY = -15;  
						if(c.specificType == "left") {  
							c.textureInfo.offsetX = 3;  
						} else if(c.specificType == "del") {  
							c.textureInfo.offsetX = 23;  
						} else if(c.specificType == "right") {  
							c.textureInfo.offsetX = 43;  
						}  
						c.textureInfo.texture.attr("transform", "translate(" + c.textureInfo.offsetX.toString() + "," + c.textureInfo.offsetY.toString() + ")");   
					}  
				}  
			},  
			refresh: function(c) {  
				c.textureInfo.setSize(c);		   
				c.textureInfo.setOffset(c);  
			},  
		},  
  
		specificType:'',  
		specificInfo:{},  
  
		objectParent:null,  
		objectChildren:[],  
		gradeType:'',  
  
		alive: true,  
		active: true,  
		// setActive: function(c, b) { 
			// c.active = b.; 
		// } 
	}, 
	size: { 
		w: 1,			 
		h: 1, 
	}, 
	currentObjects: {}, 
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
	groups: { 
	}, 

	sortNumber: function(a, b) { 
		return a["start"] - b["start"]; 
	}, 

	setButtons: function(c) {  
		var left = $.extend(true, {}, this.gameObject);  
		left.objectParent = c;  
		left.gradeType = 'button';  
		left.specificType = 'left';  
		left.active = false;   
		// left.active = true;     
		c.objectChildren.push(left);  
 
		var del = $.extend(true, {}, this.gameObject);  
		del.objectParent = c;  
		del.gradeType = 'button';  
		del.specificType = 'del';  
		del.active = false;   
		// del.active = true;     
		c.objectChildren.push(del);  
 
		var right = $.extend(true, {}, this.gameObject);  
		right.objectParent = c;  
		right.gradeType = 'button';  
		right.specificType = 'right';  
		right.active = false;   
		// right.active = true;     
		c.objectChildren.push(right);  
	},  
 
	setObjectList: function(c) { 
		this.objectList.push(c); 
		this.debugStep += 1;
		for(var i = 0; i < c.objectChildren.length; i++) { 
			this.setObjectList(c.objectChildren[i]); 
		} 
	}, 
 
	initData: function() { 
		var step = 0; 
		this.currentObjects = $.extend(true, {}, this.gameObject); 
		this.currentObjects.gradeType = 'groups'; 
		for(var k = 0; k < raw_datas.length; k++) { 
			raw_data = raw_datas[k]; 
			var result = $.extend(true, {}, this.gameObject); 
			result.gradeType = 'group'; 
			for(var i = 0; i < raw_data["DnaComponent"]["annotaions"].length; i++) { 
				if(step < parseInt(raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioStart"])) { 
					var temp = {};  
					var temp = $.extend(true, {}, this.gameObject); 
					temp.gradeType = 'component'; 
					temp.specificInfo.start = step; 
					temp.specificInfo.end = parseInt(raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioStart"]) - 1; 
					temp.specificInfo.word = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].substring(step, temp.end+1); 
					temp.specificInfo.name = "None"; 
 
 
					temp.color = "#DDDDDD";  
					temp.objectParent = result; 
					// result.objectChildren.push(temp);   
					step = temp.end + 1; 
				} 
				var temp1 = {};  
				var temp1 = $.extend(true, {}, this.gameObject); 
				temp1.gradeType = 'component'; 
				temp1.specificInfo.start = parseInt(raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioStart"]); 
				temp1.specificInfo.end = parseInt(raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioEnd"]); 
				temp1.specificInfo.word = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].substring(temp1.start, temp1.end); 
				temp1.specificInfo.name = raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["subComponent"]["DnaComponent"]["name"]; 
 
				temp1.specificType = raw_data["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["subComponent"]["DnaComponent"]["type"]; 
				temp1.alive = true; 
 
				step = temp1.specificType.end+1; 
				temp1.objectParent = result; 
				result.objectChildren.push(temp1); 
 
				this.setButtons(temp1);   
			} 
			if(step < raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].length) { 
				var temp = {}; 
				temp.specificInfo.start = step; 
				temp.specificInfo.end = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].length; 
				temp.specificInfo.word = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].substring(step, temp.end+1); 
				temp.specificInfo.name = "None"; 
				temp.specificInfo.color = "#BBBBBB"; 
				temp.objectParent = result; 
				// result.objectChildren.push(temp);   
				step = temp.end + 1; 
			} 
 
			result.wordLength = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"].length; 
			result.words = raw_data["DnaComponent"]["DnaSequence"]["nucleotides"]; 
 
			// circle.x = 130; circle.y = 150; circle.r = 100;   
 
			result.objectParent = this.currentObjects; 
			this.currentObjects.objectChildren.push(result); 
		} 
		// setComponentDisplay(groups);   
		// this.setComponentDisplay(this.groups);   
		this.setObjectList(this.currentObjects); 
		this.refreshDisplay(this.currentObjects);  
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
		// this.historyStack.stack.push($.extend(true, {}, this.currentObjects));    
		// this.deepClone(this.currentObjects);   
		this.historyStack.stack.push(this.deepClone(this.currentObjects));  
		// this.currentObjects = this.deepClone(this.currentObjects);   
		this.historyStack.pointer = this.historyStack.pointer + 1;  
		// this.objectList = [];   
		// this.setObjectList(this.currentObjects);   
		this.refreshDisplay(this.currentObjects);  
	}, 
 
	refreshDisplay: function(c) { 
		c.textureInfo.refresh(c); 
		for(var i = 0; i < c.objectChildren.length; i++) { 
			this.refreshDisplay(c.objectChildren[i]); 
		} 
	}, 

	clearButton: function() {
		for(var i = 0; i < this.objectList.length; i++) {
			if(this.objectList[i].gradeType == "button") {
				this.objectList[i].active = false;
			}
		} 
	},

	selectObject: function(c) {
		this.clearButton();
		if(c.gradeType == "component") {
			for(var i = 0; i < c.objectChildren.length; i++) {
				c.objectChildren[i].active = true;
			}
		} else if(c.gradeType == "group") {
			this.isActive = true;
			this.activeObject = c;
		}					
		this.refreshDisplay(this.currentObjects);
	},

	selectNothing: function() {
		this.clearButton();
		this.refreshDisplay(this.currentObjects);
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
		// this.setTransform(tar); this.setTransform(src);   
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
  
	setCurrentState: function(c) {  
		this.currentObjects = this.deepClone(c);  
		this.objectList = [];  
		this.setObjectList(this.currentObjects);  
		this.refreshDisplay(this.currentObjects);
	},  

	getActiveObjectChildrenLength: function(c) {
		var result = 0;
		for(var i = 0; i < c.objectChildren.length; i++) {
			if(c.objectChildren[i].active) result += 1;
		}									 
		return result;
	},
  
	moveLeft: function(c) {  
		var src = c.objectParent;  
		var x = this.getIndex(src);  
		if(x > 0) {  
			var tar = src.objectParent.objectChildren[x-1];  
			src.objectParent.objectChildren[x-1] = src;  
			src.objectParent.objectChildren[x] = tar;  
			this.exchangePosition(src, tar);  
			this.recordCurrentState();  
			this.refreshDisplay(src.objectParent);
		}  
	},  
  
	moveRight: function(c) {  
		var src = c.objectParent;  
		var x = this.getIndex(src);  
		if(x < this.getActiveObjectChildrenLength(src.objectParent)-1) {  
			var tar = src.objectParent.objectChildren[x+1];  
			src.objectParent.objectChildren[x+1] = src;  
			src.objectParent.objectChildren[x] = tar;  
			this.exchangePosition(src, tar);  
			this.recordCurrentState();  
			this.refreshDisplay(src.objectParent);
		}  
	},  
  
	deleteGroup: function(c) {  
		c.active = false;
	},  
  
	deleteComponent: function(c) {  
		var src =c.objectParent;  
		var x = this.getIndex(src);  
		if(this.getActiveObjectChildrenLength(src.objectParent) == 1) {  
			this.deleteGroup(src.objectParent);  
		} else {  
			for(var i = x; i < src.objectParent.objectChildren.length-1; i++) {  
				this.exchangePosition(src.objectParent.objectChildren[x], src.objectParent.objectChildren[i+1]);  
			}  
			for(var i = x; i < src.objectParent.objectChildren.length-1; i++) {  
				src.objectParent.objectChildren[i] = src.objectParent.objectChildren[i+1];  
			}  
			// src.objectParent.objectChildren.pop();   
			// src.alive = false;   
			src.objectParent.objectChildren[src.objectParent.objectChildren.length - 1] = src;
			src.active = false;
			// src.texture.remove();   
			// this.removeTexture(src);   
		}  
		this.recordCurrentState();  
		this.refreshDisplay(src.objectParent);
	},  
  
	// prepareComponent: function(selectedObject, part) {   
			// var tempObj = $.extend(true, {}, this.gameObject);   
			// tempObj.gradeType = 'component';   
			// tempObj.name = part.part_name;   
			// tempObj.specificType = part.part_type;   
			// tempObj.objectParent = selectedObject.objectParent;   
			// selectedObject.objectParent.objectChildren.push(tempObj);   
			// var x = this.getIndex(selectedObject);   
			// for(var j = selectedObject.objectParent.objectChildren.length-1; j > x+1; j--) {   
				// selectedObject.objectParent.objectChildren[j] = selectedObject.objectParent.objectChildren[j-1];   
				// selectedObject.objectParent.objectChildren[j].offsetX += selectedObject.objectParent.objectChildren[j].w;   
				// this.setTransform(selectedObject.objectParent.objectChildren[j]);   
			// }   
			// selectedObject.objectParent.objectChildren[x+1] = tempObj;   
			// this.setButtons(tempObj);     
  //  
			// this.setTexture(tempObj, tempObj.objectParent);   
			// tempObj.objectParent.scaleX += 1;   
			// this.scaleObject(tempObj.objectParent);   
  //  
			// var tempLeft = 0;     
			// for(var k = 0; k < x+1; k++) {     
				// tempLeft += tempObj.objectParent.objectChildren[k].w;     
			// }     
			// tempObj.offsetX = 10 + tempLeft;     
			// tempObj.offsetY = 10;     
			// tempObj.inactiveX = -999999;   
			// tempObj.inactiveY = -999999;   
			// this.setTransform(tempObj);   
  //  
			// for(var k = 0; k < tempObj.objectChildren.length; k++) {     
				// var button = tempObj.objectChildren[k];   
				// this.setTexture(button, tempObj);   
				// button.offsetX = 3+20 * k;   
				// button.offsetY = -15;   
				// button.inactiveX = -999999;   
				// button.inactiveY = -999999;   
				// button.texture.attr("transform", "translate(" + button.inactiveX + "," + button.inactiveY + ")");    
			// }     
			// return tempObj;   
									//    
	// },   
  //  
	// addComponent: function(part) {   
		// for(var i = 0; i < this.objectList.length; i++) {   
			// if(this.objectList[i].active && this.objectList[i].gradeType == "component") {   
				// this.prepareComponent(this.objectList[i], part);    
				// this.recordCurrentState();   
				// break;   
			// }   
		// }   
	// },   
} 
 
 
 
$(function(){ 
	$(".component").live("mousedown", function(e) {     
		var targetC = $(this);    
		for(var i = 0; i < game.objectList.length; i++) {         
			if(game.objectList[i].textureInfo.id == targetC.parent().attr("id")) {     
				var selectedObject = game.objectList[i];    
				if(selectedObject.gradeType == "group") {    
					game.selectObject(selectedObject);
					game.mouseStartPosition.x = e.pageX;    
					game.mouseStartPosition.y = e.pageY;    
				} else if(selectedObject.gradeType == "groups") {    
					game.selectNothing();
				}    
			}          
		}         
	});     
    
	$(".component").live("click", function(e) {    
		var targetC = $(this);    
		for(var i = 0; i < game.objectList.length; i++) {         
			if(game.objectList[i].textureInfo.id == targetC.parent().attr("id")) {     
				var selectedObject = game.objectList[i];    
				if(selectedObject.gradeType == "component") {    
					game.selectObject(selectedObject);
				} else if(selectedObject.gradeType == "button") {    
					if(selectedObject.specificType == "left") {    
						game.moveLeft(selectedObject);    
						break;  
					} else if(selectedObject.specificType == "right") {    
						game.moveRight(selectedObject);    
						break;  
					} else if(selectedObject.specificType == "del") {    
						game.deleteComponent(selectedObject);    
						break;  
					}    
				}    
			}          
		}         
	});    
    
	$("#root").live("mousemove", function(e) {    
		if(game.isActive) {    
			game.mouseEndPosition.x = e.pageX;    
			game.mouseEndPosition.y = e.pageY;    
			var dx = game.mouseEndPosition.x - game.mouseStartPosition.x;    
			var dy = game.mouseEndPosition.y - game.mouseStartPosition.y;    
			game.activeObject.textureInfo.setOffset(game.activeObject, dx, dy);
			game.mouseStartPosition.x = e.pageX;    
			game.mouseStartPosition.y = e.pageY;    
			game.hasChangePosition = true;    
		}    
	});    
    
	$("#root").live("mouseup", function(e) {    
		if(game.isActive) {    
			game.isActive = false;
			if(game.hasChangePosition) {    
				game.recordCurrentState();    
				game.hasChangePosition = false;    
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
