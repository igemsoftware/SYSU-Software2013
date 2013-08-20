/* refer to donuts */
(function($) {
$.fn.dashboard = function(options) {
	options = options || {};
	return this.each(function() {
		/* $(this).append("aaa"); */
		$(this).append("<div class=\"dashboard-arrow\"></div>");
		/* $(this).append("<div class=\"dashboard-value\">50%</div>"); */
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
    $(this).find(".dashboard-arrow").css('transform', 'rotate(' + ((1.8 * percentage) - 90) + 'deg)');
	});
}
	
})(jQuery);

$(function(){
	$(".dashboard").dashboard({
		size: 40,
		percentage: 20,
	});
});
