function BiobrickAdder() {
	this.name = null;	

	this.type = null;

	this.nickname = null;

	this.offsetTop = null;

	this.offsetLeft = null;
};

BiobrickAdder.prototype = {
	init: function(name, type, offsetTop, offsetLeft, config, path, nickname) {
		this.name = name;
		this.type = type;
		this.nickname = nickname;
		this.offsetTop = offsetTop;
		this.offsetLeft = offsetLeft;

		if (config) {
			this.config = config;
		}

		if (path)
			this.path = path;
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
			that.paint();

			$(this).unbind("click");	// 取消click事件绑定，避免多次绑定
		});
	},

	hideAll: function() {
		$(".adder").remove();
	},

	paint: function() {
		var figure = eval("new " + this.type + "()");	// 实例化对象

		var command = new graphiti.command.CommandAdd(app.view, figure, this.offsetTop, this.offsetLeft);
    	app.view.getCommandStack().execute(command);	// 添加到命令栈中

		figure.name = this.name;	// 设置id
		figure.nickname = this.nickname;

		if (this.type == "g.Shapes.Protein") {
			figure.label.setText(this.name);
		}

		if (this.config)
			figure.config = this.config;

		if (this.path)
			figure.path = this.path;
	}
};