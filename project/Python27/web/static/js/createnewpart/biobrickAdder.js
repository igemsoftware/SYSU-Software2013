function BiobrickAdder() {
	this.name = null;	

	this.type = null;

	this.offsetTop = null;

	this.offsetLeft = null;
};

BiobrickAdder.prototype = {
	init: function(name, type, offsetTop, offsetLeft) {
		this.name = name;
		this.type = type;
		this.offsetTop = offsetTop;
		this.offsetLeft = offsetLeft;
	},

	show: function() {
		this.hideAll();
		var actualTop = (parseInt(this.offsetTop) - 105) + "px";
		var actualLeft = (parseInt(this.offsetLeft) + 5) + "px";
		var that = this;
		var adder = "<div class=\"adder\" id=\"adder-" + this.name + "\"></div>";

		if ($("#factor-"+this.name + "> .adder").length == 0) {
			$("#factor-"+this.name).append(adder);
		}

		$("#adder-"+this.name).data("shape", this.type);

		$("#adder-"+this.name).css({
			"top": "-95px",
			"left": "30px"
		});
	
		$("#adder-"+this.name).click(function() {
			that.onClick();

			$(this).unbind("click");	// 取消click事件绑定，避免多次绑定
		});
	},

	hideAll: function() {
		$(".adder").remove();
	},

	onClick: function()
	{
		console.log('click');
		biobrickDivAddBiobrick(this.name);
		parts.push(this.name);
	}
};