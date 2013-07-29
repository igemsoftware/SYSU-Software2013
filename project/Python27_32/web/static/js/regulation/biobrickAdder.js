var BiobrickAdder = {
	name: null,	

	type: null,

	offsetTop: null,

	offsetLeft: null,

	init: function(name, type, offsetTop, offsetLeft) {
		this.name = name;
		this.type = type;
		this.offsetTop = offsetTop;
		this.offsetLeft = offsetLeft;
	},

	show: function() {
		var actualTop = (parseInt(this.offsetTop) - 15) + "px";
		var actualLeft = (parseInt(this.offsetLeft) + 29) + "px";
		var that = this;

		$(".adder").data("shape", this.type);

		$(".adder").css({
			"visibility": "visible",
			"top": actualTop,
			"left": actualLeft
		});

		$(".adder").click(function() {
			that.paint();

			$(this).unbind("click");	// 取消click事件绑定，避免多次绑定
		});
	},

	paint: function() {
		var figure = eval("new " + this.type + "()");	// 实例化对象

		var command = new graphiti.command.CommandAdd(app.view, figure, this.offsetTop, this.offsetLeft);
    	app.view.getCommandStack().execute(command);	// 添加到命令栈中

		figure.setId(this.name);	// 设置id
		figure.label.setText(this.name);	// 设置label

		app.view.collection.push(this.name);	// 放入collection中
	}
};



$(".factorNode").live("click", function(){
	var offset = $(this).offset();
	var thisId = $(this).attr("id");
	var name = thisId.substr(7, thisId.length - 1);

	var adder = BiobrickAdder;
	adder.init(name, "g.Shapes.Arrow", offset.top, offset.left);
	adder.show();
});