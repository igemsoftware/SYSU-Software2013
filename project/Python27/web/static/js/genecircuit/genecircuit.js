/* refer to donuts */
/* dashboard */
(function($) {
$.fn.dashboard = function(options) {
	options = options || {};
	return this.each(function() {
		$(this).append("<div class=\"dashboard-arrow arrow1\"></div>");
		$(this).append("<div class=\"dashboard-arrow arrow2\"></div>");
		if(options.size) {
			$(this).css("font-size", options.size.toString() + "px");
		}
		$(this).append("<div class=\"dashboard-value\">0%</div>");

		$(this).bind("update", function(e, val){
			var per = val;
			per = (per - options.min) / (options.max - options.min) * 100;
			if (per > 100)
				per = 100;
			else if (per < 0)
				per = 0;
			per = Math.floor(per);
			$(this).find(".arrow1").css('transform', 'rotate(' + ((1.8 * (per+3)) - 180) + 'deg)');
			$(this).find(".arrow2").css('transform', 'rotate(' + ((1.8 * (per-3)) - 180) + 'deg)');
			$(this).find(".dashboard-value").text(val);
		});

		$(this).trigger('update', 0);

	});
}
})(jQuery);

/* protein */
var protein = {
	init: function(aTextureId, aData) {
		this.setTexture(aTextureId, aData);
		this.setData(aTextureId, aData);
	},

	setTexture: function(aTextureId, aData) {
    console.log(aData['display']);
    if (!aData['display'])
      $("#" + aTextureId).hide();

		$("#" + aTextureId).append("<div class=\"module-title\"><em>protein1</em></div><div class=\"dashboard-unit\"><div><div class=\"dashboard before-regulated\"></div><span>before<br/> regulated</span></div><div class=\"protein-range mul\"><div class=\"slider pops\"></div><span>PoPS</span></div><div class=\"protein-range mul\"><div class=\"slider rips\"></div><span>RiPS</span></div><div class=\"protein-range mul\"><div class=\"slider copy\"></div><span>copy</span></div></div><div class=\"dashboard-unit\"><div><div class=\"dashboard repress-rate\"></div><span>repress<br/> rate</span></div><div class=\"protein-range\"><div class=\"slider k1\"></div><span>K1</span></div></div><div class=\"dashboard-unit\"><div><div class=\"dashboard induce-rate\"></div><span>induce<br/> rate</span></div><div class=\"protein-range\"><div class=\"slider concen\"></div><span>concen</span></div></div>");
		// $("#" + aTextureId + " .module-title em").text(aTextureId); 
		$("#" + aTextureId + " .module-title em").text(aData['name']);
		$("#" + aTextureId).data("grp_id", aData['grp_id']);
		$("#" + aTextureId).data("display", aData['display']);
		$("#" + aTextureId).data("pos", aData['pos']);

		$("#" + aTextureId + " .before-regulated").dashboard({
			size: 40,		
			percentage: 0,
			min: 0,
			max: 100,
		})

		$("#" + aTextureId + " .repress-rate").dashboard({
			size: 40,
			percentage: 0,
			min: -6,
			max: 6,
		});

		$("#" + aTextureId + " .induce-rate").dashboard({
			size: 40,
			percentage: 0,
			min: -6,
			max: 6,
		});

		/* $("#" + aTextureId + " .protein-range .slider").slider({ */
		$("#" + aTextureId + " .pops").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 60,
			stop: function(event, ui) {
				/* ws.send(JSON.stringify({ */
					/* 'request': 'changeRBS', */
				/* })); */
				detail.type = "PoPS";
        var id_str = $(this).parents(".proteins").attr('id');
				detail.pro_id = id_str.substring(id_str.indexOf('-') + 1, id_str.length);
				detail.new_value = $(this).slider("value");
				randomValue(); 
			}
		});

		$("#" + aTextureId + " .rips").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 60,
			stop: function(event, ui) {
				/* ws.send(JSON.stringify({ */
					/* 'request': 'changeRBS', */
				/* })); */
				detail.type = "RiPS";
        var id_str = $(this).parents(".proteins").attr('id');
				detail.pro_id = id_str.substring(id_str.indexOf('-') + 1, id_str.length);
				detail.new_value = $(this).slider("value");
				randomValue(); 
			}
		});

		$("#" + aTextureId + " .copy").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 60,
			stop: function(event, ui) {
				/* ws.send(JSON.stringify({ */
					/* 'request': 'changeRBS', */
				/* })); */
				detail.type = "copy";
        var id_str = $(this).parents(".proteins").attr('id');
				detail.pro_id = id_str.substring(id_str.indexOf('-') + 1, id_str.length);
				detail.new_value = $(this).slider("value");
				randomValue(); 
			}
		});

		$("#" + aTextureId + " .k1").slider({
			orientation: "vertical",
			range: "min",
			min: -6,
			max: 6,
			value: 0,
			stop: function(event, ui) {
				/* ws.send(JSON.stringify({ */
					/* 'request': 'changeRBS', */
				/* })); */
				detail.type = "K1";
        var id_str = $(this).parents(".proteins").attr('id');
				detail.pro_id = id_str.substring(id_str.indexOf('-') + 1, id_str.length);
				detail.new_value = $(this).slider("value");
				randomValue(); 
			}
		});

		$("#" + aTextureId + " .concen").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 60,
			stop: function(event, ui) {
				/* ws.send(JSON.stringify({ */
					/* 'request': 'changeRBS', */
				/* })); */
				detail.type = "concen";
        var id_str = $(this).parents(".proteins").attr('id');
				detail.pro_id = id_str.substring(id_str.indexOf('-') + 1, id_str.length);
				detail.new_value = $(this).slider("value");
				randomValue();
			}
		});

		/* this.textureId = aTextureId; */
	},
	setData: function(aTextureId, aData) {
		// aData.PoPS = Math.floor(Math.random()*100); 
		// aData.RiPS = Math.floor(Math.random()*100); 
		// aData.copy = Math.floor(Math.random()*100); 
		// aData.K1 = Math.floor(Math.random()*100); 
		// aData.concen = Math.floor(Math.random()*100); 
		// aData.before_regulated = Math.floor(Math.random()*100); 
		// aData.repress_rate = Math.floor(Math.random()*100); 
		// aData.induce_rate = Math.floor(Math.random()*100); 
		$("#" + aTextureId + " .pops").slider("value", aData.PoPS);
		$("#" + aTextureId + " .rips").slider("value", aData.RiPS);
		$("#" + aTextureId + " .copy").slider("value", aData.copy);
		if(aData.K1 == null) {
			$("#" + aTextureId + " .k1").addClass("unuse");
		} else {
			$("#" + aTextureId + " .k1").removeClass("unuse");
		}
		$("#" + aTextureId + " .k1").slider("value", aData.K1);
		$("#" + aTextureId + " .concen").slider("value", aData.concen);
		$("#" + aTextureId + " .before-regulated").trigger("update", aData.before_regulated);
		$("#" + aTextureId + " .repress-rate").trigger("update", aData.repress_rate);
		$("#" + aTextureId + " .induce-rate").trigger("update", aData.induce_rate);
	},
}

/* group */
var group = {
	init: function(aTextureId, aData) {
		this.setTexture(aTextureId, aData);
		this.setData(aTextureId, aData, "init");
	},
	setTexture: function(aTextureId, aData) {
							
							
		$("#" + aTextureId).append("<ul class=\"sbol-components\"></ul><div class=\"move-left cmd-move\">&lt</div><div class=\"move-right cmd-move\">&gt</div><button class=\"sbol-switch switch-on\">trans</button>");
		for(var i = 0; i < aData.sbol.length; i++) {
			var type = 'Promoter.PNG';
			if(aData.sbol[i].type == 'Promoter') type = 'Promoter.PNG';
			else if(aData.sbol[i].type == 'RBS') type = 'rbs.PNG';
			else if(aData.sbol[i].type == 'Protein') type = 'Coding.PNG';
			else if(aData.sbol[i].type == 'Repressor') type = 'Coding.PNG';
			else if(aData.sbol[i].type == 'Activator') type = 'Coding.PNG';
			else if(aData.sbol[i].type == 'Terminator') type = 'Terminator.PNG';
			$("#" + aTextureId + " .sbol-components").append("<li id='" + aTextureId + "-" + i.toString() + "' class='component'><div><img src=\"../static/img/component/Promoter.PNG\"/></div><span>BBa_C0060</span></li>");
			$("#" + aTextureId + " .sbol-components li:eq(" + i.toString() + ")").find('img').attr('src', "../static/img/component/" + type);
			$("#" + aTextureId + " .sbol-components li:eq(" + i.toString() + ")").data('type', aData.sbol[i].type);
			
			if('id' in aData.sbol[i]) {
				$("#" + aTextureId + " .sbol-components li:eq(" + i.toString() + ")").data('id', aData.sbol[i].id);
			}

			$("#" + aTextureId + " .sbol-components li:eq(" + i.toString() + ")").find('span').text(aData.sbol[i].name);
		}

		$("#" + aTextureId + " .sbol-components sbol-switch").text(aData.state);
		if(aData.state == 'trans') {
			$("#" + aTextureId + " .sbol-switch").removeClass('switch-off').addClass('switch-on');
			$("#" + aTextureId + " .sbol-switch").text("trans");
			$("#" + aTextureId).data("order", "trans");
		} else if(aData.state == 'cis') {
			$("#" + aTextureId + " .sbol-switch").removeClass('switch-on').addClass('switch-off');
			$("#" + aTextureId + " .sbol-switch").text("cis");
			$("#" + aTextureId).data("order", "cis");
		}

		$("#" + aTextureId).data('from', aData.from); 
		$("#" + aTextureId).data('type', aData.type); 
		$("#" + aTextureId).data('to', aData.to); 
		$("#" + aTextureId).data('corep_ind_type', aData.corep_ind_type); 
		$("#" + aTextureId).data('corep_ind', aData.corep_ind); 
		$("#" + aTextureId + " ul").prepend("<li id='" + aTextureId + "-first' style='display:none'></li>");
		// $("#" + aTextureId + " ul").sortable({ 
			// items: "li", 
			// handle: "img, span", 
			// update: function(event, ui) { 
				// command.tempCmd.to = $(ui.item).prev().attr('id'); 
				// command.cmdConfirm(); 
				// randomValue(); 
			// }, 
			// start: function(event, ui) { 
				// command.tempCmd.type = 'Move'; 
				// command.tempCmd.actor = $(ui.item).attr('id'); 
				// command.tempCmd.from = $(ui.item).prev().attr('id'); 
			// }, 
//  
		// }); 
		$("#" + aTextureId + " ul .component").bind("click", function(){
			ws.send(JSON.stringify({
				'request': 'getBiobrickPath',
				'data': $(this).find("span").text(),
			}));
		});
		that = this;
		$("#" + aTextureId + " .sbol-switch").bind("click", function(){
			if($(this).text() == 'trans') {
				/* $(this).removeClass('switch-on').addClass('switch-off'); */
				/* $(this).text('cis'); */
				/* $(this).data("order", "cis"); */
				that.turnSwitch($(this), 'cis')
			} else {
				/* $(this).removeClass('switch-off').addClass('switch-on'); */
				/* $(this).text('trans'); */
				/* $(this).data("order", "trans"); */
				that.turnSwitch($(this), 'trans');
			}
			/* randomValue(); */
		});
	},
	setData: function(aTextureId, aData, state) {
		// after_connect 
		for(var i = 0; i < aData.sbol.length; i++) { 
			/* console.log(aTextureId); */
		/* console.log('aData', aData.sbol[i].name); */
		/* console.log($("#", aTextureId + " .sbol-components .component:eq(" + i.toString() + ")").find('span')); */
			/* console.log(aTextureId); */
			/* console.log($("#", aTextureId + " .sbol-components .component:eq(" + i.toString() + ")").find("span").text());  */
			$("#" + aTextureId + " .sbol-components .component:eq(" + i.toString() + ")").find("span").text(aData.sbol[i].name); 
		} 
		if(aData.state == 'trans') { 
			this.turnSwitch($("#" + aTextureId + " .sbol-switch"), 'trans'); 
		} else { 
			this.turnSwitch($("#" + aTextureId + " .sbol-switch"), 'cis'); 
		} 
		
		// for(var i = 0; i < aData.sbol.length; i++) {  
			// $("#" + aTextureId + " .sbol-components li.component:eq(" + i.toString() + ")").find('span').text(Math.floor(Math.random()*1000000).toString());  
		// }  
	},
	turnSwitch: function(target, type) {
		if(type == 'trans') {
			target.removeClass('switch-off').addClass('switch-on');
			target.text('trans');
			target.data("order", "trans");
		} else {
			target.removeClass('switch-on').addClass('switch-off');
			target.text('cis');
			target.data("order", "cis");
		}
	}
}


/* plasmid */
var plasmid =  {
	init: function(aTextureId, aData) {
		this.setTexture(aTextureId, aData);
		this.setData(aTextureId, aData);
	},
	setTexture: function(aTextureId, aData) {
		this.textureId = aTextureId;				
		/* alert(aTextureId); */
		$("#" + aTextureId).append("<div><span class=\"label\"></span></div><div class=\"cmd-del\">x</div>");
						
		// $("#" + aTextureId + " div .label").text(aTextureId); 
		/* $("#" + aTextureId + " div .label").html("<a href='plasmid'><i class='icon-zoom-in'></i>" + aTextureId + "</a>"); */
		$("#" + aTextureId + " div .label").html("<span class='view-plasmid'><i class='icon-zoom-in'></i>" + aTextureId + "</span>");
		$("#" + aTextureId).append("<div id='" + aTextureId + "-first' style='display:none'></div>");

		// console.log("kakakakak", aData); 
		for(var i = 0; i < aData.length; i++) {
			var sbol_id = aData[i].id;
			// $("#" + aTextureId).append("<div class='sbol' id='" + aTextureId + "-sbol-" + i.toString() + "'></div>"); 
			$("#" + aTextureId).append("<div class='sbol' id='sbol-" + sbol_id + "'></div>"); 
			group.init("sbol-" + sbol_id, aData[i]);
		}
		checkEmptyPlasmid();
		$("#plasmids-view").mCustomScrollbar("update");

		this.viewPlasmid(aTextureId);
	},

	setData: function(aTextureId, aData) {
		// after_connect 
		// for(var i = 0; i < aData.length; i++) { 
			// var tId = "sbol-" + aData[i].id; 
			// group.setData(tId, aData[i]); 
		// } 
		for(var i = 0; i < aData.length; i++) {
			var tId = $("#" + aTextureId + " .sbol:eq(" + i.toString() + ")").attr("id");
			group.setData(tId, aData[i]);
		}
	},
	addPlasmid: function() {
		/* var count = $("#plasmids-view .mCSB_container .plasmids").length; */
		var count = 0;
		while($("#plasmid-" + count).length > 0) {
			count += 1;
		}
		$("#plasmids-view .mCSB_container").append("<div class='plasmids' id='plasmid-" + count.toString() + "'></div>");	
		var aTextureId = "plasmid-" + count.toString();
		$("#" + aTextureId).append("<div><span class=\"label\"></span></div><div class=\"cmd-del\">x</div>");
		$("#" + aTextureId + " div .label").html("<span class='view-plasmid'><i class='icon-zoom-in'></i>" + aTextureId + "</span>");
		$("#" + aTextureId).append("<div id='" + aTextureId + "-first' style='display:none'></div>");
		checkEmptyPlasmid();
		/* $("#" + aTextureId).append("<div id='" + aTextureId + "-first'></div>"); */
		/* this.setSortable(); */
		/* for(var i = 0; i < 1000; i++) { */
			/* $("#plasmids-view").scroll(); */
		/* } */
		$("#plasmids-view").mCustomScrollbar("update");
		$("#plasmids-view").mCustomScrollbar("scrollTo", "bottom");
		this.viewPlasmid(aTextureId);
	},
	viewPlasmid: function(aTextureId) {
		$("#" + aTextureId + " div .label .view-plasmid").click(function(){
      var data = {};
			var circuit = [];
			$("#" + aTextureId + " .sbol").each(function(){
				circuit.push({"sbol":[],"state":""});
				circuit[circuit.length-1].state = $(this).data("order");
				curSbolId = $(this).attr('id');
				curSbol = circuit[circuit.length-1].sbol;

				$('.proteins').each(function(){
				var sbol_id = curSbolId.substring(curSbolId.indexOf('-') + 1, curSbolId.length);
					if($(this).data('grp_id') == sbol_id) {
						data.copy = $(this).find('.copy').slider("value");
					}
				});
				$("#" + curSbolId + " .component").each(function(){
					var type = $(this).data("type");
					var name = $(this).find("span").text();
					curSbol.push({'type':type, 'name':name});
				})				
			});	
      data.circuit = circuit;
			sessionStorage.genecircuitSave=JSON.stringify({'genecircuit':data});
			sessionStorage.gene_circuit = JSON.stringify(getDataCollection());
			// console.log(data); 
			// sendMessage 
			// console.log(sessionStorage);  
			window.location.href="plasmid";    
		});
					
	}
}


$(".empty-plasmid .cmd-del").live('click', function(){
	$(this).parents(".plasmids").remove();
	$("#plasmids-view").mCustomScrollbar("update");
	$("#plasmids-view").mCustomScrollbar("scrollTo", "bottom");
});

var checkEmptyPlasmid = function() {
	$(".plasmids").each(function(){
		if($(this).find(".sbol").length == 0) {
			$(this).addClass('empty-plasmid');
		} else {
			$(this).removeClass('empty-plasmid');
		}
	});
	/* $("#plasmids-view").mCustomScrollbar("update"); */
	/* $("#plasmids-view").mCustomScrollbar("scrollTo", "bottom"); */
}
var moveAndCheck = function(aGroup, fGroup, tGroup, fPlasmid, tPlasmid) {
	aGroup.fadeOut().detach().fadeIn();

	// detail.pro_id =  
	// detail.new_value =  
	// detail.type = "copy" 

  var id_str0 = aGroup.attr("id");
   var grp_id = id_str0.substring(id_str0.indexOf('-') + 1, id_str0.length);
	if(tPlasmid.find(".sbol").length > 0) {
    var id_str = tPlasmid.find(".sbol").attr('id');
		grp_id = id_str.substring(id_str.indexOf('-') + 1, id_str.length);
	}
	$(".proteins").each(function(){
		if($(this).data('grp_id') == grp_id) {
			detail.new_value = $(this).find(".copy").slider("value");
		}
	});
	aGroup.find(".component").each(function(){
		if($(this).data('id')) detail.pro_id = $(this).data('id');
	})
	detail.type = "copy";


	tGroup.after(aGroup);
	checkEmptyPlasmid();
	command.tempCmd.type = "Move";
	command.tempCmd.from = fGroup.attr('id');
	command.tempCmd.actor = aGroup.attr('id');
	command.tempCmd.to = tGroup.attr('id');
	command.cmdConfirm();
}
$(".move-left").live("click", function(e){
	var aGroup = $(this).parent(".sbol");
	var aPlasmid = $(this).parents(".plasmids");
	if(aGroup.prev(".sbol").length > 0) {
		var tGroup = aGroup.prev(" div").prev(" div");
		var fGroup = aGroup.prev(" div");
		var fPlasmid = aPlasmid, tPlasmid = tGroup.parents(".plasmids");
		moveAndCheck(aGroup, fGroup, tGroup, fPlasmid, tPlasmid);
		randomValue();
	} else {
		if(aPlasmid.prev(".plasmids").length > 0) {
			var tGroup = aPlasmid.prev(".plasmids").children("div").last();
			var fGroup = aGroup.prev(" div");
			var fPlasmid = aPlasmid, tPlasmid = tGroup.parents(".plasmids");
			moveAndCheck(aGroup, fGroup, tGroup, fPlasmid, tPlasmid);
			randomValue();
		}
	}
});
$(".move-right").live("click", function(e){
	var aGroup = $(this).parent(".sbol");
	var aPlasmid = $(this).parents(".plasmids");
	if(aGroup.next(".sbol").length > 0) {
		var tGroup = aGroup.next(" div");
		var fGroup = aGroup.prev(" div");
		var fPlasmid = aPlasmid, tPlasmid = tGroup.parents(".plasmids");
		moveAndCheck(aGroup, fGroup, tGroup, fPlasmid, tPlasmid);
		randomValue();
	} else {
		if(aPlasmid.next(".plasmids").length > 0) {
			var pId = aPlasmid.next(".plasmids").attr("id");
			var tGroup = $("#" + pId + "-first");
			var fGroup = aGroup.prev(" div");
			var fPlasmid = aPlasmid, tPlasmid = tGroup.parents(".plasmids");
			moveAndCheck(aGroup, fGroup, tGroup, fPlasmid, tPlasmid);
			randomValue();
		}
	}
});

/* detail */
var detail = {
	type: "",
	pro_id: 0,
	new_value: 0,
}

/* command */
var command = {
	tempCmd: {
		type: '',
		from: '',
		to: '',
		newAt: '',
		deleteAt: '',
		spe: '',
	},
	cmd: {},
	cmdConfirm: function() {
		this.cmd = this.tempCmd;
		this.cmd = $.extend({}, this.tempCmd, true);
	}
}

/* historyStack */
var historyStack = {
	pointer: -1,
	stack: [],
	add: function(dataCollection) {
		while(this.stack.length - 1 > this.pointer) {
			this.stack.pop();
		}
		this.stack.push(dataCollection);
		this.pointer += 1;
		this.stack[this.pointer].cmd = command.cmd;
	},
	setState: function(p) {
		var curState = this.stack[p];
		// for(var i = 0; i < genecircuitData.proteins.length; i++) { 
			// var tId = $("#dashboard-view .mCSB_container .proteins:eq(" + i.toString() + ")").attr("id"); 
			// protein.setData(tId, curState.proteins[i]); 
		// } 
		// for(var i = 0; i < genecircuitData.plasmids.length; i++) { 
			// var tId = $("#plasmids-view .mCSB_container .plasmids:eq(" + i.toString() + ")").attr("id"); 
			// plasmid.setData(tId, curState.plasmids[i]); 
		// } 

		for(var prop in curState.proteins) { 
			var tId = "protein-" + prop; 
			protein.setData(tId, curState.proteins[prop]); 
		} 
		for(var i = 0; i < curState.plasmids.length; i++) { 
			var tId = $("#plasmids-view .mCSB_container .plasmids:eq(" + i.toString() + ")").attr("id"); 
			var groups = []; 
			for(var j = 0; j < curState.plasmids[i].length; j++) { 
				groups.push(curState.groups[curState.plasmids[i][j].toString()]); 
				groups[groups.length-1].id = curState.plasmids[i][j].toString(); 
			} 
			plasmid.setData(tId, groups); 
		} 
	},
	undo: function() {
		if(this.pointer > 0) {
			this.pointer -= 1;
			var curCmd = this.stack[this.pointer+1].cmd
			if(curCmd.type == 'Move') {
				var temp = $("#" + curCmd.actor).detach().fadeOut().fadeIn();
				$("#" + curCmd.from).after(temp);
			}
			this.setState(this.pointer);
			/* this.setCurrentStack(stack[pointer], stack[pointer+1]); */
		}
	},
	redo: function() {
		if(this.pointer < this.stack.length - 1) {
			this.pointer += 1;
			var curCmd = this.stack[this.pointer].cmd
			if(curCmd.type == 'Move') {
				var temp = $("#" + curCmd.actor).detach();
				$("#" + curCmd.to).after(temp);
			}
			this.setState(this.pointer);
			/* this.setCurrentStack(stack[pointer], stack[pointer+1]); */
		}
	}
}

var getDataCollection = function() {
	var dataCollection = {
		proteins: {}, 
		plasmids: [], 
		groups: {},
	}
	var pLength = $("#dashboard-view .mCSB_container .proteins").length;
	for(var i = 0; i < pLength; i++) {
		var pid = $(".proteins:eq(" + i.toString() + ")").attr('id');

		pid_i = pid.substring(pid.indexOf('-') + 1, pid.length);
		var p = $("#" + pid);

		dataCollection.proteins[pid_i] = {};
		dataCollection.proteins[pid_i].grp_id = p.data('grp_id');
		dataCollection.proteins[pid_i].display = p.data('display');
		dataCollection.proteins[pid_i].pos = p.data('pos');
		dataCollection.proteins[pid_i].name = p.find(".module-title em").text();
		dataCollection.proteins[pid_i].PoPS = p.find(".pops").slider("value");
		dataCollection.proteins[pid_i].RiPS = p.find(".rips").slider("value");
		console.log(p.find(".rips").slider("value"));
		dataCollection.proteins[pid_i].copy = p.find(".copy").slider("value");
    if (p.find(".k1").hasClass("unuse"))
		  dataCollection.proteins[pid_i].K1 = null;
    else
      dataCollection.proteins[pid_i].K1 = p.find(".k1").slider("value");
		dataCollection.proteins[pid_i].concen = p.find(".concen").slider("value");
		dataCollection.proteins[pid_i].before_regulated = parseInt(p.find(".before-regulated .dashboard-value").text());
		dataCollection.proteins[pid_i].repress_rate = parseInt(p.find(".repress-rate .dashboard-value").text());
		dataCollection.proteins[pid_i].induce_rate = parseInt(p.find(".induce-rate .dashboard-value").text());
	}
	var plasmidsLength = $("#plasmids-view .plasmids").length;
	var plasmidsList = $("#plasmids-view .plasmids");
	for(var i = 0; i < plasmidsLength; i++) {
		dataCollection.plasmids.push([]);
		var curPlasmid = plasmidsList.eq(i);
		var groupsLength = curPlasmid.find(".sbol").length;
		var groupsList = curPlasmid.find(".sbol");
		for(var j = 0; j < groupsLength; j++) {

      var id_str = groupsList.eq(j).attr('id');
			var grp_id = id_str.substring(id_str.indexOf('-') + 1, id_str.length);
			dataCollection.plasmids[i].push(grp_id);
			dataCollection.groups[grp_id] = {};
			var curGroup = groupsList.eq(j);
			var componentsLength = curGroup.find(".component").length;
			var componentsList = curGroup.find(".component");
			dataCollection.groups[grp_id] = {sbol:[],state:''};
			dataCollection.groups[grp_id].from = curGroup.data("from"); 
			dataCollection.groups[grp_id].to = curGroup.data("to"); 
			dataCollection.groups[grp_id].type = curGroup.data("type"); 
			dataCollection.groups[grp_id].state = curGroup.data("order"); 
			dataCollection.groups[grp_id].corep_ind_type = curGroup.data("corep_ind_type"); 
			dataCollection.groups[grp_id].corep_ind = curGroup.data("corep_ind");
			for(var k = 0; k < componentsLength; k++) {
				dataCollection.groups[grp_id].sbol.push({'type':'','name':''});
				dataCollection.groups[grp_id].sbol[k].name = curGroup.find("li").eq(k+1).find("span").text();
				dataCollection.groups[grp_id].sbol[k].type = curGroup.find("li").eq(k+1).data("type");
				if('id' in curGroup.find("li").eq(k+1).data()) {
					dataCollection.groups[grp_id].sbol[k].id = curGroup.find("li").eq(k+1).data("id");
				}
			}
		}
	}
	return dataCollection;
}


/* genecircuit */
var randomValue = function() {
	var data = {};
	dataCollection = getDataCollection();
	data.gene_circuit = dataCollection;
	data.detail = detail;

	console.log("data", data);

	// console.log("data", data); 
	// console.log("upup", JSON.stringify({ 
		// 'request': 'updateGeneCircuit', 
		// 'data': {'detail':detail, 'gene_circuit':dataCollection}, 
	// })); 
	ws.send(JSON.stringify({
		'request': 'updateGeneCircuit',
		'data': {'detail':detail, 'gene_circuit':dataCollection},
	}));
	/* send message */
}

var init = function(genecircuitData) {
	// for(var i = 0 ; i < genecircuitData.proteins.length; i++) { 
		// $("#dashboard-view .mCSB_container").append("<div class='proteins new-proteins' id='protein-" + i.toString() + "'></div>"); 
		// protein.init("protein-" + i.toString(), genecircuitData.proteins[i]); 
	// } 
	for(var prop in genecircuitData.proteins) {
		// console.log(genecircuitData.proteins[prop]); 
		$("#dashboard-view .mCSB_container").append("<div class='proteins new-proteins' id='protein-" + prop + "'></div>"); 
		protein.init("protein-" + prop, genecircuitData.proteins[prop]); 
	}
	// for(var i = 0; i < genecircuitData.plasmids.length; i++) {  
		// $("#plasmids-view .mCSB_container").append("<div class='plasmids' id='plasmid-" + i.toString() + "'></div>");  
		// plasmid.init("plasmid-" + i.toString(), genecircuitData.plasmids[i]);  
	// }  
	for(var i = 0; i < genecircuitData.plasmids.length; i++) { 
		var groups = [];
		for(var j = 0; j < genecircuitData.plasmids[i].length; j++) {
			groups.push(genecircuitData.groups[genecircuitData.plasmids[i][j].toString()]);
			groups[groups.length-1].id = genecircuitData.plasmids[i][j].toString();
		}
		$("#plasmids-view .mCSB_container").append("<div class='plasmids' id='plasmid-" + i.toString() + "'></div>"); 
		plasmid.init("plasmid-" + i.toString(), groups); 
	} 
	dataCollection = getDataCollection();
	historyStack.add(dataCollection);
}

var updateGen = function(genecircuitData) {
	/* in onmessage */
	for(var prop in genecircuitData.proteins) {
		var tId = "protein-" + prop;
		protein.setData(tId, genecircuitData.proteins[prop]);
	}
	for(var i = 0; i < genecircuitData.plasmids.length; i++) {
		var tId = $("#plasmids-view .mCSB_container .plasmids:eq(" + i.toString() + ")").attr("id");
		var groups = [];
		for(var j = 0; j < genecircuitData.plasmids[i].length; j++) {
			groups.push(genecircuitData.groups[genecircuitData.plasmids[i][j].toString()]);
			groups[groups.length-1].id = genecircuitData.plasmids[i][j].toString();
		}
		plasmid.setData(tId, groups);
	}
	/* dataCollection -- messageResult */
	historyStack.add(dataCollection);
}

var setContentSize = function() {
	winH = $(window).height() - 70;
	winW = $(window).width() - 60;
	if(winH < 0 || winW < 0) return;
	conH = parseInt($("#content").css("height"));
	conW = parseInt($("#content").css("width"));
	var scale = 1;
	if(winW / winH > conW / conH) {
		scale = winH / conH;
	} else {
		scale = winW / conW;
	}
	/* $("#content").css("zoom", scale); */
	/* $("#content").css("width", Math.floor(conW * scale).toString() + "px"); */
	/* $("#content").css("height", Math.floor(conH * scale).toString() + "px"); */
}

var jumpToSimulation = function() {
	sessionStorage.gene_circuit = JSON.stringify(getDataCollection());
  window.location.pathname = "/simulation";
}

$(window).resize(function() {
	/* setContentSize(); */
});

$(function(){
	$("#dashboard-view").mCustomScrollbar({
		/* autoHideScrollbar: true, */
		theme: "light",
		advanced: {
			autoExpandVerticalScroll: true,
			updateOnContentResize: true,
		}
	});

	$("#plasmids-view").mCustomScrollbar({
		/* autoHideScrollbar: true, */
		theme: "light",
		advanced: {
			autoExpandVerticalScroll: true,
			/* updateOnContentResize: true, */
		}
	});

	$("#cmd-new-plasmid").click(function(){
		plasmid.addPlasmid();
	});
});

