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
		if(!options.percentage) {
			options.percentage = 0;
		}
		var percentage = options.percentage;
    if (percentage > 100)
      percentage = 100;
    else if (percentage < 0)
      percentage = 0;
		percentage = Math.floor(percentage);
		$(this).append("<div class=\"dashboard-value\">" + (percentage.toString()) + "%</div>");
    $(this).find(".dashboard-arrow").css('transform', 'rotate(' + ((1.8 * percentage) - 180) + 'deg)');
	});
}
})(jQuery);



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
	console.log($("#plasmids-view"));
	console.log($(".dashboard"))
	/* $(".plasmids").sortable({items:"ul"}); */
});
/*  */
/* E.config({ */
	/* baseUrl : './static/js/regulation/slider/js/' */
/* }); */
/* E.use('slider', function(){ */
	/* var slider = new E.ui.Slider('.protein-slider', { */
		/* min : -100, */
		/* max : 100, */
		/* axis : 'x', */
	/* }); */
/* }); */
