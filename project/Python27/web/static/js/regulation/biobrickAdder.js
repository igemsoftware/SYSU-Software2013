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

		$(".adder").css({
			"visibility": "visible",
			"top": actualTop,
			"left": actualLeft
		});

		$(".adder").data("shape", this.type);
	},

	paint: function() {
		var figure = eval("new " + this.type + "()");

		var command = new graphiti.command.CommandAdd(this, figure, this.offsetTop, this.offsetLeft);
    	
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