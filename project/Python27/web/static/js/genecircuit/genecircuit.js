/* refer to donuts */
(function($) {
$.fn.dashboard = function(options) {
	options = options || {};
	return this.each(function() {
		/* $(this).append("aaa"); */
		$(this).append("<div class=\"dashboard-arrow\"></div>");
		$(this).append("50%");
		/* console.log(this); */
			/* $(this).css("font-size", "60px"); */
		if(options.size) {
			$(this).css("font-size", options.size.toString() + "px");
		}
		$(this).append("<div class=\"dashboard-value\">0%</div>");

		$(this).bind("update", function(e, per){
			if (per > 100)
				per = 100;
			else if (per < 0)
				per = 0;
			per = Math.floor(per);
			$(this).find(".dashboard-arrow").css('transform', 'rotate(' + ((1.8 * per) - 180) + 'deg)');
			$(this).find(".dashboard-value").text(per.toString() + "%");
		});

		$(this).trigger('update', 0);


		/* if(!options.percentage) { */
			/* options.percentage = 0; */
		/* } */
		/* var percentage = options.percentage; */
    /* if (percentage > 100) */
      /* percentage = 100; */
    /* else if (percentage < 0) */
      /* percentage = 0; */
		/* percentage = Math.floor(percentage); */
    /* $(this).find(".dashboard-arrow").css('transform', 'rotate(' + ((1.8 * percentage) - 180) + 'deg)'); */
	});
}
})(jQuery);

var protein = function() {
	this.PoPs = 0;
	this.RiPs = 0;
	this.copy = 0;
	this.repress_rate = 0;
	this.induce_rate = 0;
	this.before_regulated = 0;
	this.after_regulated = 0;
	this.after_induced = 0;
}

protein.prototype = {
	init: function(aId, aTextureId, aData) {
		this.setId(aId);	
		this.setTexture(aTextureId);
		this.setData(aData);
	},
	setId: function(aId) {
		this.id = aId;
	},

	setTexture: function(aTextureId) {
								/* console.log(aTexture); */
		/* aTexture.append("<div class=\"module-title\"><em>protein1</em></div><div class=\"protein-row1\"><div class=\"dashboard\"></div><div class=\"dashboard\"></div><div class=\"dashboard\"></div><span>before<br/> regulated</span><span>after<br/> regulated</span><span>after<br/> induced</span></div><div class=\"protein-row2\"><div class=\"protein-range\"><span>PoPs</span><input type=\"range\"/></div><div class=\"protein-range\"><span>RiPs</span><input type=\"range\"/></div><div class=\"protein-range\"><span>copy</span><input type=\"range\"/></div><div class=\"protein-range\"><span>repress rate</span><input type=\"range\"/></div><div class=\"protein-range\"><span>induce rate</span><input type=\"range\"/></div></div>"); */
		$("#" + aTextureId).append("<div class=\"module-title\"><em>protein1</em></div><div class=\"dashboard-unit\"><div><div class=\"dashboard before-regulated\"></div><span>before<br/> regulated</span></div><div class=\"protein-range mul\"><div class=\"slider pops\"></div><span>PoPs</span></div><div class=\"protein-range mul\"><div class=\"slider rips\"></div><span>RiPs</span></div><div class=\"protein-range mul\"><div class=\"slider copy\"></div><span>copy</span></div></div><div class=\"dashboard-unit\"><div><div class=\"dashboard after-regulated\"></div><span>after<br/> regulated</span></div><div class=\"protein-range\"><div class=\"slider repress-rate\"></div><span>repress rate</span></div></div><div class=\"dashboard-unit\"><div><div class=\"dashboard after-induced\"></div><span>after<br/> induced</span></div><div class=\"protein-range\"><div class=\"slider induce-rate\"></div><span>induce rate</span></div></div>");

		$("#" + aTextureId + " .dashboard").dashboard({
			size: 40,
			percentage: 0,
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
				randomValue();
			}
		});

		$("#" + aTextureId + " .repress-rate").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 60,
			stop: function(event, ui) {
				/* ws.send(JSON.stringify({ */
					/* 'request': 'changeRBS', */
				/* })); */
				randomValue();
			}
		});

		$("#" + aTextureId + " .induce-rate").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 60,
			stop: function(event, ui) {
				/* ws.send(JSON.stringify({ */
					/* 'request': 'changeRBS', */
				/* })); */
				randomValue();
			}
		});
		this.textureId = aTextureId;
	},
	setData: function(aData) {
		this.PoPs = aData.PoPs;
		this.RiPs = aData.RiPs;
		this.copy = aData.copy;
		this.repress_rate = aData.repress_rate;
		this.induce_rate = aData.induce_rate;
		this.before_regulated = aData.before_regulated;
		this.after_regulated = aData.after_regulated;
		this.after_induced = aData.after_induced;
		console.log(this.PoPs);
		$("#" + this.textureId + " .pops").slider("value", this.PoPs);
		$("#" + this.textureId + " .rips").slider("value", this.RiPs);
		$("#" + this.textureId + " .copy").slider("value", this.copy);
		$("#" + this.textureId + " .repress-rate").slider("value", this.repress_rate);
		$("#" + this.textureId + " .induce-rate").slider("value", this.induce_rate);
		$("#" + this.textureId + " .before-regulated").trigger("update", this.before_regulated);
		$("#" + this.textureId + " .after-regulated").trigger("update", this.after_regulated);
		$("#" + this.textureId + " .after-induced").trigger("update", this.after_induced);
	},
}


var init = function(genecircuitData) {
	for(var i = 0 ; i < genecircuitData.proteins.length; i++) {
		$("#dashboard-view .mCSB_container").append("<div class='proteins new-proteins' id='protein-" + i.toString() + "'></div>");
		dataCollection.proteins.push(new protein());
		dataCollection.proteins[dataCollection.proteins.length-1].init(dataCollection.proteins.length-1, "protein-" + i.toString(), genecircuitData.proteins[i]);
	}
}

var randomValue = function() {
	$(".slider").each(function(){
		$(this).slider("value", Math.floor(Math.random()*100))
	});
	$(".dashboard").trigger('update', Math.floor(Math.random()*100));
}



$(function(){
	$(".dashboard").dashboard({
		size: 40,
		percentage: 20,
	});

	$(".sbol-components").sortable({
		items: "li",
		handle: "img, span",
	});
	$("#plasmids-view").sortable({
		items: ".sbol",
		handle: ".sbol-handle",
	});
	
	$(".proteins").live("ready", function(){
		console.log("laal");
	});

	$(".protein-range .slider").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 60,
	});

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
			updateOnContentResize: true,
		}
	});

});
