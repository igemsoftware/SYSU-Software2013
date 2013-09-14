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
				detail.pro_id = parseInt($(this).parents(".proteins").attr('id').split('-')[1]);
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
				detail.pro_id = parseInt($(this).parents(".proteins").attr('id').split('-')[1]);
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
				detail.pro_id = parseInt($(this).parents(".proteins").attr('id').split('-')[1]);
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
				detail.pro_id = parseInt($(this).parents(".proteins").attr('id').split('-')[1]);
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
				detail.pro_id = parseInt($(this).parents(".proteins").attr('id').split('-')[1]);
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
			
			if(aData.sbol[i].id) {
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
					if($(this).data('grp_id') == parseInt(curSbolId.split('-')[1])) {
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
	var grp_id = aGroup.attr('id').split('-')[1];
	if(tPlasmid.find(".sbol").length > 0) {
		grp_id = parseInt(tPlasmid.find(".sbol").attr('id').split('-')[1]);
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
		var pid_i = parseInt(pid.split('-')[1]);
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
			var grp_id = groupsList.eq(j).attr('id').split('-')[1];
			dataCollection.plasmids[i].push(parseInt(grp_id));
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
				if(curGroup.find("li").eq(k+1).data("id")) {
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

	// var chart = new iChart.LineBasic2D({ 
		// animation: true, 
		// render: 'simulation', 
		// data: [2,4,2,1,6,3], 
	// }) 
	
	
	
	// var data = [ 
						// { 
							// name : 'aa', 
							// value:[-9,1,12,20,26,30,32,29,22,12,0,-6], 
							// color:'#1f7e92', 
							// line_width:2 
						// } 
				//  ]; 
			//   
	// var chart = new iChart.Area2D({ 
			// render : 'simulation', 
			// data: data, 
			// title : 'xxx', 
			// width : 267, 
			// height : 220, 
			// coordinate:{height:'80%',background_color:'#edf8fa'}, 
			// sub_option:{ 
				// hollow_inside:false,//设置一个点的亮色在外环的效果 
				// point_size:10 
			// }, 
			// labels:["1","2","3","4","5","6","7","8","9","10","11","12"] 
		// }); 
	// chart.draw(); 

	sim_data = turnRawDatatoData(raw_data);
	run(sim_data, 267, 200);
	$("#canvasDiv div").css("margin", "auto");
	/* run(sim_data,document.getElementById('canvasDiv').clientWidth,document.getElementById('canvasDiv').clientHeight); */
});

var sim_data =  [];
var raw_data= [[0.0, 0.0, 0.0, 0.0, 0.0], [0.2, 0.22400000000000003, 0.0, 0.28800000000000003, 0.0], [0.4, 0.43904000000000004, 0.021212121212121213, 0.5587200000000001, 0.027231467473524965], [0.6000000000000001, 0.6450784878064435, 0.05822837370242215, 0.81298696253916, 0.07639838285782616], [0.8, 0.8412189335098522, 0.10679038439544099, 1.050922151563454, 0.143270951407217], [1.0, 1.0260988722005626, 0.1634802597080469, 1.2720812396260928, 0.2243799474489355], [1.2000000000000002, 1.1983212572373874, 0.22552428290296128, 1.475770350486206, 0.31681297363370114], [1.4000000000000001, 1.3568323620347518, 0.2906696952921919, 1.661374967170522, 0.4180859986633185], [1.6, 1.5011431883130328, 0.35710535373983493, 1.828607853947608, 0.5260646641648602], [1.8, 1.6313663295969774, 0.42340407397524404, 1.9776315875736417, 0.6389152438964661], [2.0, 1.7481143819068725, 0.48847270863201486, 2.109060467357131, 0.7550708729391976], [2.2, 1.8523367112743945, 0.5515038330133208, 2.223879798917479, 0.8732041280746938], [2.4000000000000004, 1.9451581445047443, 0.6119283038791582, 2.323328881534912, 0.9922015445519656], [2.6, 2.0277526594312065, 0.6693703407000522, 2.4087839782320644, 1.1111386735211153], [2.8000000000000003, 2.101259572416881, 0.7236070056874704, 2.481661388528326, 1.2292558349349327], [3.0, 2.166736067614547, 0.7745332324550096, 2.543347153397029, 1.345935221003973], [3.2, 2.22513574647015, 0.8221327050787502, 2.5951517742945094, 1.460679948294966], [3.4000000000000004, 2.277303645735093, 0.8664542728224186, 2.6382848813826607, 1.573095404428205], [3.6, 2.323980580568848, 0.9075932530263444, 2.6738442241991294, 1.6828729814534398], [3.8000000000000003, 2.3658120806421885, 0.9456768581696425, 2.702814132495293, 1.7897761037713402], [4.0, 2.4033590474725903, 0.9808529974030643, 2.7260697595514367, 1.8936283512541983], [4.2, 2.437108524514338, 1.0132817816755337, 2.744384520905317, 1.9943034311285357], [4.4, 2.4674837630095974, 1.0431291632641781, 2.758439018905477, 2.091716744418364], [4.6000000000000005, 2.4948532327752506, 1.0705622424290082, 2.7688303817744817, 2.1858183072995017], [4.800000000000001, 2.5195384859126695, 1.0957458655707044, 2.7760813835163183, 2.276586812884339], [5.0, 2.541820915019779, 1.11884021706909, 2.7806489982743003, 2.3640246475569944], [5.2, 2.5619475087336707, 1.1399991708062012, 2.7829322244003185, 2.448153704020784], [5.4, 2.580135728714093, 1.159369218656275, 2.7832791240908565, 2.5290118587526034], [5.6000000000000005, 2.596577632595149, 1.1770888338858903, 2.7819930887296405, 2.606650003835023], [5.800000000000001, 2.6114433578932115, 1.193288159385728, 2.779338374980126, 2.681129542068099], [6.0, 2.6248840683800343, 1.2080889356775877, 2.775544973417959, 2.752520270086837], [6.2, 2.637034450182338, 1.221604603159315, 2.770812877355158, 2.8208985872998973], [6.4, 2.648014831409041, 1.2339405282486178, 2.7653158191032707, 2.886345979225072], [6.6000000000000005, 2.6579329870999118, 1.2451943149076554, 2.759204537131864, 2.9489477326116473], [6.800000000000001, 2.66688568092599, 1.2554561722173625, 2.752609632159778, 3.008791846950689], [7.0, 2.6749599863064155, 1.2648093158056002, 2.7456440642148756, 3.065968112873813], [7.2, 2.6822344222850214, 1.2733303864700016, 2.738405336711797, 3.1205673327733114], [7.4, 2.688779933443031, 1.2810898736277294, 2.7309774079484623, 3.1726806629425988], [7.6000000000000005, 2.6946607381200223, 1.288152534544712, 2.7234323652651096, 3.2223990597995447], [7.800000000000001, 2.699935065098086, 1.2945778028597925, 2.715831892499724, 3.2698128154490718], [8.0, 2.7046557955198627, 1.3004201818908654, 2.708228557309538, 3.315011170072507], [8.200000000000001, 2.708871024028938, 1.3057296197201216, 2.700666941378232, 3.3580819904858195], [8.4, 2.7126245508316966, 1.3105518642052076, 2.693184633446579, 3.3991115057565704], [8.6, 2.7159563144929133, 1.3149287969315857, 2.685813102439482, 3.438184092066033], [8.8, 2.7189027737192935, 1.3188987457706332, 2.6785784656637563, 3.475382100093706], [9.0, 2.7214972450956014, 1.3224967761866546, 2.6715021650709896, 3.510785719122696], [9.200000000000001, 2.7237702026680175, 1.3257549617821112, 2.6646015628748567, 3.54447287284575], [9.4, 2.7257495443791497, 1.328702634813971, 2.657890466344058, 3.57651914251695], [9.600000000000001, 2.7274608296164367, 1.331366617578655, 2.6513795903268247, 3.6069977136627127], [9.8, 2.728927491514297, 1.3337714356670833, 2.645076964971606, 3.6359793430536764], [10.0, 2.730171027128986, 1.3359395141493242, 2.6389882951660337, 3.663532343059203], [10.200000000000001, 2.7312111681663405, 1.3378913577716776, 2.633117277401116, 3.6897225808693537], [10.4, 2.7320660345722656, 1.3396457162466087, 2.6274658790615457, 3.714613490384006], [10.600000000000001, 2.7327522729823692, 1.3412197356947253, 2.622034584530403, 3.7382660948425577], [10.8, 2.733285181761061, 1.3426290972633856, 2.6168226119641513, 3.760739038506465], [11.0, 2.7336788241339125, 1.343888143902731, 2.6118281041303875, 3.7820886259156494], [11.200000000000001, 2.7339461307237247, 1.3450099962301982, 2.6070482962966697, 3.8023688674228326], [11.4, 2.7340989926352095, 1.346006658361334, 2.602479663805787, 3.8216315298706123], [11.600000000000001, 2.7341483460911316, 1.3468891145299204, 2.5981180516640245, 3.8399261914175598], [11.8, 2.734104249500477, 1.3476674172653982, 2.5939587881984205, 3.857300299644321], [12.0, 2.733975953733727, 1.348350767841401, 2.5899967846015612, 3.8737992321807666], [12.200000000000001, 2.7337719662890523, 1.348947589656628, 2.5862266219738057, 3.889466359192503], [12.4, 2.733500109954101, 1.3494655951587933, 2.582642627289211, 3.9043431071510857], [12.600000000000001, 2.7331675764992767, 1.3499118468743725, 2.579238939549623, 3.918469023388422], [12.8, 2.732780975878433, 1.3502928130614982, 2.5760095672486485, 3.9318818410032566], [13.0, 2.7323463813605904, 1.3506144184607576, 2.572948438141154, 3.9446175437473707], [13.200000000000001, 2.7318693709704243, 1.3508820905788619, 2.5700494422024316, 3.9567104305719933], [13.4, 2.7313550655750944, 1.3511008019031305, 2.5673064685625215, 3.968193179561754], [13.600000000000001, 2.7308081639196202, 1.351275108410427, 2.564713437113738, 3.9790969110249788], [13.8, 2.730232974881877, 1.3514091847024619, 2.5622643254119457, 3.9894512495457537], [14.0, 2.7296334471907944, 1.3515068560701655, 2.5599531914233418, 3.9992843848356294], [14.200000000000001, 2.7290131968270077, 1.3515716277629544, 2.5577741926074036, 4.008623131251396], [14.4, 2.7283755323036667, 1.3516067117140527, 2.555721601772383, 4.017492985870609], [14.600000000000001, 2.727723478005955, 1.3516150509504534, 2.553789820091456, 4.025918185038719], [14.8, 2.72705979575084, 1.3515993418954315, 2.551973387624682, 4.033921759321163], [15.0, 2.726387004713397, 1.351562054752661, 2.5502669916537037, 4.041525586810849], [15.200000000000001, 2.725707399852486, 1.3515054521437688, 2.548665473102077, 4.048750444756439], [15.4, 2.7250230689564323, 1.351431606155474, 2.547163831283779, 4.0556160594898145], [15.600000000000001, 2.724335908418508, 1.3513424139381738, 2.5457572271954323, 4.062141154642454], [15.8, 2.723647637842243, 1.3512396119848478, 2.5444409855436674, 4.068343497650229], [16.0, 2.722959813567839, 1.3511247892073344, 2.5432105956775852, 4.074239944554562], [16.2, 2.722273841203053, 1.3509993989163036, 2.5420617115771007, 4.0798464831151], [16.400000000000002, 2.72159098723482, 1.3508647698014995, 2.5409901510308766, 4.0851782742552105], [16.6, 2.7209123897914256, 1.350722115999983, 2.5399918941223008, 4.090249691866816], [16.8, 2.7202390686192492, 1.350572546332075, 2.5390630811283676, 4.09507436100539], [17.0, 2.7195719343328184, 1.3504170727774174, 2.5382000099241915, 4.099665194509566], [17.2, 2.718911796992136, 1.350256618256967, 2.5373991329750565, 4.104034428082729], [17.400000000000002, 2.7182593740569114, 1.3500920237807523, 2.536657053988261, 4.108193653876299], [17.6, 2.717615297763366, 1.3499240550157872, 2.5359705242883974, 4.112153852616252], [17.8, 2.716980121965698, 1.3497534083236236, 2.535336438972038, 4.115925424315796], [18.0, 2.7163543284810143, 1.3495807163125584, 2.5347518328909566, 4.119518217618092], [18.2, 2.715738332973534, 1.3494065529454655, 2.5342138765069158, 4.122941557813565], [18.400000000000002, 2.7151324904111434, 1.3492314382405644, 2.5337198716556144, 4.126204273576635], [18.6, 2.714537100124871, 1.3490558425991037, 2.5332672472525615, 4.129314722466802], [18.8, 2.713952410499564, 1.348880190790931, 2.5328535549693285, 4.132280815238852], [19.0, 2.7133786233219346, 1.3487048656261829, 2.532476464904813, 4.135110039006579], [19.200000000000003, 2.7128158978102235, 1.3485302113388522, 2.532133761272732, 4.13780947930391], [19.400000000000002, 2.7122643543479423, 1.3483565367057329, 2.5318233381235524, 4.140385841086672], [19.6, 2.711724077942532, 1.348184117922211, 2.531543195116371, 4.142845468717433], [19.8, 2.711195121428262, 1.3480132012545034, 2.5312914333538896, 4.145194364974996], [20.0, 2.710677508431316, 1.3478440054862737, 2.5310662512915107, 4.147438209129159], [20.200000000000003, 2.710171236113724, 1.3476767241760113, 2.530865940729734, 4.1495823741203255], [20.400000000000002, 2.7096762777116234, 1.347511527740182, 2.530688882897366, 4.151631942882502], [20.6, 2.7091925848822442, 1.3473485653758823, 2.53053354463162, 4.1535917238470725], [20.8, 2.708720089872989, 1.3471879668355866, 2.5303984746598993, 4.155466265663633], [21.0, 2.708258707525066, 1.3470298440655202, 2.530282299986929, 4.157259871172988], [21.200000000000003, 2.7078083371232444, 1.3468742927182469, 2.5301837223899257, 4.158976610666259], [21.400000000000002, 2.707368864102526, 1.3467213935491817, 2.53010151502362, 4.160620334462875], [21.6, 2.7069401616217537, 1.346571213705952, 2.5300345191362115, 4.162194684839039], [21.8, 2.7065220920135094, 1.3464238079188036, 2.5299816408966675, 4.163703107337118], [22.0, 2.7061145081190094, 1.346279219599591, 2.5299418483332192, 4.165148861485241], [22.200000000000003, 2.705717254516099, 1.3461374818562881, 2.5299141683824184, 4.166535030955263], [22.400000000000002, 2.7053301686479023, 1.3459986184293997, 2.529897684047702, 4.167864533186135], [22.6, 2.704953081859178, 1.3458626445561566, 2.5298915316660526, 4.16914012849863], [22.8, 2.704585820346924, 1.3457295677679153, 2.529894898281037, 4.170364428726305], [23.0, 2.7042282060313694, 1.345599388625755, 2.5299070191202655, 4.171539905386541], [23.200000000000003, 2.703880057353037, 1.3454721013988842, 2.5299271751750845, 4.172668897414481], [23.400000000000002, 2.7035411900011965, 1.3453476946901133, 2.529954690880159, 4.1737536184817055], [23.6, 2.703211417578668, 1.3452261520123214, 2.5299889318904545, 4.174796163920526], [23.8, 2.702890552207583, 1.345107452319548, 2.5300293029530216, 4.175798517273855], [24.0, 2.7025784050804127, 1.3449915704960689, 2.5300752458709024, 4.176762556489701], [24.200000000000003, 2.702274786960282, 1.3448784778065574, 2.53012623755642, 4.177690059778481], [24.400000000000002, 2.701979508634296, 1.3447681423102071, 2.5301817881710695, 4.178582711150515], [24.6, 2.7016923813233773, 1.3446605292414686, 2.530241439349212, 4.179442105650235], [24.8, 2.7014132170518548, 1.3445556013598687, 2.5303047625027566, 4.180269754302894], [25.0, 2.7011418289798335, 1.3444533192711878, 2.5303713572040385, 4.181067088788789], [25.200000000000003, 2.700878031701164, 1.3443536417221094, 2.530440849644096, 4.181835465859323], [25.400000000000002, 2.70062164150964, 1.3442565258703012, 2.5305128911636006, 4.182576171508503], [25.6, 2.7003724766358705, 1.3441619275317427, 2.5305871568537124, 4.183290424912859], [25.8, 2.700130357457099, 1.3440698014069838, 2.530663344224191, 4.183979382152086], [26.0, 2.6998951066821006, 1.3439801012878982, 2.5307411719361252, 4.184644139722139], [26.200000000000003, 2.699666549513121, 1.3438927802463785, 2.5308203785967174, 4.185285737851922], [26.400000000000002, 2.6994445137866996, 1.343807790806321, 2.5309007216136, 4.185905163634138], [26.6, 2.6992288300950835, 1.3437250851001499, 2.5309819761062378, 4.186503353980366], [26.8, 2.6990193318898195, 1.3436446150110357, 2.531063933872022, 4.18708119840989], [27.0, 2.6988158555690047, 1.3435663323018927, 2.5311464024047376, 4.187639541681358], [27.200000000000003, 2.6986182405495653, 1.343490188732147, 2.531229203963147, 4.188179186275841], [27.400000000000002, 2.6984263293258377, 1.3434161361632104, 2.5313121746875065, 4.188700894739455], [27.6, 2.698239967515639, 1.343344126653518, 2.531395163761898, 4.1892053918932834], [27.8, 2.6980590038949255, 1.3432741125439345, 2.5314780326203334, 4.189693366917913], [28.0, 2.6978832904220518, 1.3432060465342697, 2.531560654194645, 4.19016547531954], [28.200000000000003, 2.697712682252589, 1.3431398817515983, 2.5316429122022672, 4.1906223407842225], [28.400000000000002, 2.697547037745567, 1.3430755718110217, 2.531724700472056, 4.191064556926517], [28.6, 2.6973862184619546, 1.3430130708694716, 2.531805922306388, 4.191492688938401], [28.8, 2.697230089156137, 1.342952333673108, 2.531886489877819, 4.191907275144073], [29.0, 2.697078517761074, 1.3428933155988232, 2.5319663236586725, 4.1923088284659205], [29.200000000000003, 2.6969313753677935, 1.3428359726903338, 2.5320453518819783, 4.19269783780666], [29.400000000000002, 2.696788536199806, 1.3427802616893005, 2.5321235100322452, 4.193074769352404], [29.6, 2.6966498775829937, 1.3427261400618857, 2.5322007403646167, 4.193440067801104], [29.8, 2.696515279911479, 1.3426735660211357, 2.532276991451019, 4.193794157520642], [30.0, 2.696384626609939, 1.342622498545536, 2.53235221775196, 4.194137443640559], [30.200000000000003, 2.6962578040927982, 1.34257289739407, 2.532426379212708, 4.194470313081206], [30.400000000000002, 2.696134701720691, 1.3425247231180877, 2.5324994408826194, 4.1947931355239145], [30.6, 2.6960152117545637, 1.342477937070262, 2.5325713725564465, 4.195106264325547], [30.8, 2.6958992293077433, 1.342432501410898, 2.532642148436507, 4.195410037380645], [31.0, 2.6957866522962886, 1.342388379111835, 2.532711746814642, 4.195704777934175], [31.200000000000003, 2.6956773813878936, 1.3423455339581671, 2.53278014977294, 4.195990795347729], [31.400000000000002, 2.6955713199496136, 1.342303930547987, 2.5328473429022527, 4.19626838582188], [31.6, 2.695468373994634, 1.3422635342903475, 2.53291331503757, 4.196537833077215], [31.8, 2.6953684521283106, 1.3422243114016186, 2.532978058009362, 4.196799408996456], [32.0, 2.695271465493668, 1.3421862289003994, 2.533041566410047, 4.197053374229922], [32.2, 2.6951773277165354, 1.342149254601141, 2.533103837374769, 4.197299978766486], [32.4, 2.6950859548504833, 1.3421133571066184, 2.5331648703757237, 4.197539462472005], [32.6, 2.6949972653217054, 1.3420785057993774, 2.5332246670292937, 4.197772055597154], [32.800000000000004, 2.6949111798739787, 1.342044670832281, 2.5332832309152975, 4.197997979256443], [33.0, 2.6948276215138183, 1.3420118231182578, 2.533340567407689, 4.198217445880094], [33.2, 2.694746515455939, 1.3419799343193568, 2.533396683516077, 4.198430659640389], [33.4, 2.694667789069115, 1.3419489768352006, 2.5334515877374564, 4.198637816853969], [33.6, 2.6945913718225216, 1.3419189237909217, 2.5335052899175947, 4.198839106361514], [33.800000000000004, 2.6945171952326445, 1.3418897490246557, 2.5335578011215154, 4.1990347098861145], [34.0, 2.6944451928108117, 1.3418614270746705, 2.533609133512576, 4.199224802371612], [34.2, 2.694375300011417, 1.3418339331661886, 2.533659300239643, 4.19940955230207], [34.4, 2.6943074541808794, 1.3418072431979668, 2.533708315331908, 4.199589122003497], [34.6, 2.694241594507391, 1.341781333728687, 2.533756193600893, 4.199763667928864], [34.800000000000004, 2.6941776619714863, 1.3417561819632051, 2.533802950549239, 4.19993334092741], [35.0, 2.694115599297467, 1.3417317657387056, 2.5338486022858753, 4.200098286499151], [35.2, 2.694055350905713, 1.3417080635108027, 2.533893165447194, 4.200258645035475], [35.4, 2.6939968628659003, 1.3416850543396233, 2.533936657123879, 4.20041455204664], [35.6, 2.6939400828511433, 1.3416627178759046, 2.5339790947930445, 4.200566138376958], [35.800000000000004, 2.6938849600930785, 1.3416410343471414, 2.5340204962553723, 4.200713530408374], [36.0, 2.6938314453379, 1.341619984543804, 2.534060879576941, 4.200856850253131], [36.2, 2.693779490803353, 1.3415995498056539, 2.5341002630354628, 4.200996215936188], [36.4, 2.6937290501366893, 1.3415797120081805, 2.5341386650706585, 4.2011317415679486], [36.6, 2.69368007837359, 1.3415604535491752, 2.5341761042385125, 4.201263537507917], [36.800000000000004, 2.6936325318980536, 1.341541757335461, 2.5342125991691704, 4.201391710519786], [37.0, 2.693586368403243, 1.3415236067697947, 2.534248168528245, 4.201516363918466], [37.2, 2.6935415468532895, 1.3415059857379492, 2.534282830981323, 4.2016375977095395], [37.4, 2.693498027446051, 1.341488878595997, 2.5343166051614623, 4.201755508721568], [37.6, 2.693455771576808, 1.3414722701577935, 2.534349509639489, 4.201870190731687], [37.800000000000004, 2.6934147418028913, 1.3414561456826777, 2.5343815628969164, 4.201981734584855], [38.0, 2.693374901809236, 1.3414404908633921, 2.5344127833013084, 4.202090228307161], [38.2, 2.6933362163748384, 1.3414252918142306, 2.5344431890839334, 4.202195757213501], [38.400000000000006, 2.6932986513401156, 1.3414105350594172, 2.5344727983195514, 4.2022984040099765], [38.6, 2.693262173575141, 1.3413962075217196, 2.534501628908192, 4.202398248891299], [38.800000000000004, 2.6932267509487544, 1.3413822965113034, 2.5345296985587895, 4.202495369633511], [39.0, 2.6931923522985177, 1.341368789714823, 2.5345570247745473, 4.202589841682265], [39.2, 2.693158947401514, 1.3413556751847582, 2.5345836248399123, 4.202681738236935], [39.400000000000006, 2.6931265069459642, 1.3413429413289895, 2.5346095158090463, 4.202771130330797], [39.6, 2.693095002503648, 1.3413305769006167, 2.534634714495688, 4.202858086907488], [39.800000000000004, 2.693064406503113, 1.3413185709880198, 2.5346592374643087, 4.2029426748939684], [40.0, 2.6930346922036557, 1.3413069130051587, 2.534683101022464, 4.20302495927017], [40.2, 2.6930058336700524, 1.341295592682113, 2.534706321214256, 4.2031050031355335], [40.400000000000006, 2.6929778057480322, 1.3412846000558574, 2.534728913814827, 4.203182867772589], [40.6, 2.6929505840404633, 1.3412739254612722, 2.534750894325798, 4.203258612707762], [40.800000000000004, 2.6929241448842447, 1.3412635595223854, 2.5347722779715895, 4.2033322957695365], [41.0, 2.6928984653278825, 1.3412534931438438, 2.53479307969655, 4.203403973144139], [41.2, 2.692873523109731, 1.3412437175026088, 2.5348133141628293, 4.203473699428869], [41.400000000000006, 2.6928492966368904, 1.3412342240398765, 2.534832995748942, 4.2035415276832016], [41.6, 2.6928257649647303, 1.3412250044532128, 2.5348521385489566, 4.203607509477783], [41.800000000000004, 2.6928029077770383, 1.3412160506889075, 2.534870756372263, 4.203671694941442], [42.0, 2.6927807053667654, 1.3412073549345365, 2.5348888627438706, 4.203734132806295], [42.2, 2.692759138617355, 1.3411989096117318, 2.534906470905189, 4.203794870451074], [42.400000000000006, 2.692738188984645, 1.341190707369155, 2.5349235938152446, 4.203853953942756], [42.6, 2.692717838479319, 1.3411827410756676, 2.5349402441523035, 4.203911428076576], [42.800000000000004, 2.692698069649895, 1.3411750038136991, 2.5349564343158506, 4.2039673364145145], [43.0, 2.692678865566241, 1.3411674888728016, 2.5349721764289033, 4.204021721322336], [43.2, 2.692660209803591, 1.3411601897433931, 2.5349874823406138, 4.204074624005247], [43.400000000000006, 2.6926420864270617, 1.3411531001106811, 2.535002363629141, 4.204126084542242], [43.6, 2.69262447997664, 1.3411462138487646, 2.5350168316047594, 4.2041761419192065], [43.800000000000004, 2.692607375452641, 1.341139525014908, 2.5350308973131774, 4.2042248340608275], [44.0, 2.6925907583016153, 1.3411330278439846, 2.535044571539042, 4.204272197861384], [44.2, 2.6925746144026905, 1.3411267167430845, 2.5350578648096103, 4.204318269214447], [44.400000000000006, 2.6925589300543438, 1.3411205862862832, 2.5350707873985616, 4.204363083041571], [44.6, 2.6925436919615784, 1.3411146312095663, 2.5350833493299345, 4.204406673319991], [44.800000000000004, 2.6925288872235074, 1.3411088464059062, 2.535095560382171, 4.204449073109397], [45.0, 2.6925145033213185, 1.341103226920487, 2.5351074300922467, 4.2044903145778045], [45.2, 2.6925005281066174, 1.3410977679460732, 2.53511896775988, 4.204530429026588], [45.400000000000006, 2.6924869497901334, 1.341092464818519, 2.535130182451797, 4.204569446914682], [45.6, 2.69247375693078, 1.3410873130124141, 2.5351410830060446, 4.20460739788202], [45.800000000000004, 2.6924609384250537, 1.341082308136861, 2.5351516780363403, 4.204644310772207], [46.0, 2.6924484834967686, 1.3410774459313823, 2.535161975936443, 4.204680213654496], [46.2, 2.6924363816871075, 1.3410727222619518, 2.535171984884541, 4.204715133845062], [46.400000000000006, 2.6924246228449875, 1.3410681331171483, 2.5351817128476393, 4.204749097927635], [46.6, 2.6924131971177245, 1.3410636746044267, 2.5351911675859493, 4.204782131773484], [46.800000000000004, 2.6924020949419907, 1.3410593429465032, 2.5352003566572643, 4.204814260560807], [47.0, 2.692391307035053, 1.3410551344778534, 2.5352092874213144, 4.204845508793539], [47.2, 2.692380824386288, 1.3410510456413165, 2.535217967044098, 4.204875900319587], [47.400000000000006, 2.692370638248959, 1.341047072984805, 2.5352264025021847, 4.204905458348548], [47.6, 2.6923607401322505, 1.341043213158116, 2.5352346005869797, 4.204934205468883], [47.800000000000004, 2.692351121793554, 1.341039462909841, 2.535242567908946, 4.204962163664616], [48.0, 2.692341775230989, 1.3410358190843712, 2.5352503109017865, 4.2049893543315315], [48.2, 2.692332692676163, 1.3410322786189957, 2.5352578358265743, 4.20501579829292], [48.400000000000006, 2.6923238665871514, 1.3410288385410882, 2.5352651487758306, 4.205041515814877], [48.6, 2.6923152896417006, 1.3410254959653842, 2.535272255677551, 4.205066526621157], [48.800000000000004, 2.6923069547306397, 1.341022248091338, 2.53527916229917, 4.205090849907627], [49.0, 2.6922988549514972, 1.3410190922005656, 2.535285874251469, 4.205114504356307], [49.2, 2.692290983602316, 1.3410160256543642, 2.535292396992422, 4.205137508149021], [49.400000000000006, 2.6922833341756616, 1.3410130458913097, 2.535298735830978, 4.205159878980678], [49.6, 2.6922759003528145, 1.3410101504249294, 2.5353048959307776, 4.205181634072178], [49.800000000000004, 2.6922686759981413, 1.3410073368414452, 2.535310882313805, 4.205202790182979], [50.0, 2.6922616551536436, 1.3410046027975877, 2.5353166998639733, 4.205223363623311], [50.2, 2.69225483203367, 1.3410019460184779, 2.5353223533306415, 4.205243370266062], [50.400000000000006, 2.692248201019798, 1.3409993642955742, 2.535327847332066, 4.205262825558349], [50.6, 2.6922417566558647, 1.3409968554846836, 2.535333186358779, 4.2052817445327735], [50.800000000000004, 2.6922354936431607, 1.3409944175040331, 2.535338374776904, 4.205300141818374], [51.0, 2.6922294068357635, 1.340992048332403, 2.535343416831399, 4.205318031651292], [51.2, 2.6922234912360175, 1.3409897460073148, 2.5353483166492303, 4.205335427885148], [51.400000000000006, 2.6922177419901536, 1.3409875086232785, 2.5353530782424847, 4.205352344001148], [51.6, 2.692212154384042, 1.3409853343300915, 2.535357705511406, 4.2053687931179216], [51.800000000000004, 2.6922067238390732, 1.3409832213311896, 2.5353622022473674, 4.205384788001095], [52.0, 2.692201445908167, 1.3409811678820518, 2.5353665721357777, 4.205400341072621], [52.2, 2.6921963162719043, 1.3409791722886515, 2.5353708187589197, 4.205415464419855], [52.400000000000006, 2.692191330734773, 1.3409772329059555, 2.535374945598724, 4.2054301698044005], [52.6, 2.6921864852215314, 1.340975348136471, 2.5353789560394757, 4.205444468670718], [52.800000000000004, 2.692181775773681, 1.3409735164288354, 2.5353828533704603, 4.20545837215451], [53.0, 2.6921771985460468, 1.34097173627645, 2.535386640788543, 4.2054718910908875], [53.2, 2.6921727498034604, 1.3409700062161554, 2.535390321400686, 4.205485036022326], [53.400000000000006, 2.6921684259175436, 1.3409683248269473, 2.5353938982264075, 4.205497817206408], [53.6, 2.6921642233635907, 1.340966690728733, 2.535397374200176, 4.205510244623369], [53.800000000000004, 2.692160138717543, 1.3409651025811233, 2.535400752173746, 4.205522327983449], [54.0, 2.692156168653056, 1.3409635590822635, 2.5354040349184377, 4.205534076734044], [54.2, 2.692152309938655, 1.340962058967699, 2.535407225127355, 4.205545500066684], [54.400000000000006, 2.692148559434972, 1.3409606010092756, 2.5354103254175504, 4.205556606923819], [54.6, 2.692144914092074, 1.3409591840140729, 2.535413338332133, 4.205567406005434], [54.800000000000004, 2.692141370946862, 1.340957806823371, 2.535416266342322, 4.205577905775491], [55.0, 2.6921379271205557, 1.340956468311648, 2.535419111849446, 4.205588114468205], [55.2, 2.692134579816248, 1.340955167385607, 2.5354218771868924, 4.2055980400941575], [55.400000000000006, 2.6921313263165363, 1.3409539029832345, 2.5354245646220046, 4.2056076904462465], [55.6, 2.6921281639812205, 1.3409526740728848, 2.5354271763579286, 4.205617073105488], [55.800000000000004, 2.6921250902450735, 1.3409514796523947, 2.5354297145354097, 4.205626195446663], [56.0, 2.6921221026156763, 1.3409503187482228, 2.5354321812345435, 4.205635064643822], [56.2, 2.6921191986713167, 1.3409491904146158, 2.5354345784764796, 4.2056436876756385], [56.400000000000006, 2.6921163760589515, 1.3409480937327987, 2.535436908225078, 4.205652071330634], [56.6, 2.6921136324922283, 1.3409470278101916, 2.5354391723885215, 4.2056602222122565], [56.800000000000004, 2.6921109657495665, 1.3409459917796471, 2.5354413728208844, 4.205668146743836], [57.0, 2.6921083736722946, 1.3409449847987127, 2.53544351132366, 4.205675851173402], [57.2, 2.6921058541628433, 1.3409440060489142, 2.535445589647245, 4.205683341578385], [57.400000000000006, 2.69210340518299, 1.3409430547350611, 2.535447609492381, 4.205690623870185], [57.6, 2.6921010247521573, 1.3409421300845727, 2.535449572511562, 4.205697703798634], [57.800000000000004, 2.6920987109457584, 1.3409412313468232, 2.535451480310398, 4.205704586956326], [58.0, 2.692096461893595, 1.3409403577925079, 2.5354533344489436, 4.2057112787828475], [58.2, 2.6920942757783006, 1.340939508713027, 2.535455136442989, 4.20571778456889], [58.400000000000006, 2.692092150833828, 1.3409386834198882, 2.535456887765316, 4.205724109460255], [58.6, 2.6920900853439815, 1.3409378812441277, 2.5354585898469164, 4.2057302584617595], [58.800000000000004, 2.692088077640995, 1.3409371015357467, 2.535460244078181, 4.205736236441033], [59.0, 2.6920861261041473, 1.3409363436631658, 2.5354618518100502, 4.205742048132218], [59.2, 2.692084229158421, 1.3409356070126954, 2.535463414355138, 4.205747698139572], [59.400000000000006, 2.6920823852731983, 1.3409348909880214, 2.535464932988817, 4.205753190940974], [59.6, 2.6920805929609966, 1.3409341950097065, 2.535466408950284, 4.205758530891343], [59.800000000000004, 2.69207885077624, 1.3409335185147053, 2.5354678434435822, 4.205763722225961], [60.0, 2.692077157314067, 1.3409328609558946, 2.535469237638605, 4.205768769063711]]
function turnRawDatatoData(raw)
{
  var ret = [];
  var LineNum = raw[0].length;
  var PointNum = raw.length;
  for (var i = 1; i < LineNum; i++) {
    ret[i-1] = {};
    ret[i-1].name = i;
    ret[i-1].value = [];
    ret[i-1].line_width = 2;
  }
  ret[0]["color"] = '#44f4f4';
  ret[1]["color"] = '#8fd8ef';
  ret[2]["color"] = '#237e90';
  ret[3]["color"] = '#80bd91';
  for (var i = 0; i < PointNum; i++)
  for (var j = 1; j < LineNum; j++)
  ret[j-1]["value"].push(raw[i][j]);
  return ret;
}
function getLabel(raw) {
  var PointNum = raw.length;
  var labels = [];
  for (var i = 0; i < PointNum; i++)
  if (i % 10 == 0)
    labels.push(raw[i][0]);
  return labels;
}
function run(data,width1,height1){
  //ws.send(JSON.stringify({'request': 'getSimulationData'}));
  console.log(data);
  labels = getLabel(raw_data);
    chart= new iChart.LineBasic2D({
    animation:true,
    render : 'canvasDiv',//图表渲染的HTML DOM的id
    data: data,//图表的数据源
    labels: labels,
    offsetx:0,//-60,
    shadow:true,
    background_color:'#f4f4f4',
    separate_angle:10,//分离角度
	/*coordinate:{
		scale:[{
			position:'left',	
			scale_space:5,
			scale_enable:false,//禁用小横线			
			
			},{
			position:'bottom',	
			start_scale:1,
			end_scale:12,	
			fontunit:'0.1',
			scale_space:10,		
			labels:labels
		}]
	},*/
    tip:{
      enable:true,
      showType:'fixed',
      animation:true,
      //fade_duration:700,
      listeners:{
        parseText:function(tip,name,value,text){
          var str= name;
          return str;
        }
      }
    },
    sub_option:{
      label: false,
      color_factor: 0.3,
      intersection: false,
      smooth: true,
      listeners:{
        click:function(r,e,m){
          console.log(e.x-r.x);
        }
      }
    },
    showpercent:true,
    decimalsnum:2,
    width : width1,
    height : height1,
    radius:140
  });
  chart.draw();
};
