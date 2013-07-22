var plasmidPainter = {

	canvas: null,

	canvasId: null,

	data: null,

	text: null,

	init: function(JSONdata) {
		data = JSONdata;
	},

	bindCanvas: function(canvasId) {
		var canvas = document.getElementById(canvasId);
		if (canvas == null) {
			console.log("canvas not found!");
			return false;
		}
		this.canvas = canvas;
		this.canvasId = canvasId;
	},

	drawSegment: function(bioStart, bioEnd, name, type, seq) {
		var color;
		switch (type) {
			case 'type1':
				color = "#9e33cc";
				break;
			case 'type2':
				color = "#00FF00";
				break;
		}

		var marginLeft = 20, 
			marginTop = 12.5;

		// draw
		jc.start(this.canvasId, true);
		jc.rect((marginLeft + bioStart), marginTop, (bioEnd - bioStart), 25, color, true).id(name);

		// add shadow
		jc('#'+name).shadow({
            x:3,
            y:3,
            blur:5,
            color:'rgba(100, 100, 100, 0.5)'
        });

		// bind mouseover event
		jc("#"+name).mouseover(function() {
			this.color("#FF0000");
			jc("#seq").string("seq: " + seq);
		});

		// bind mouseout event
		jc("#"+name).mouseout(function() {
			this.color(color);
			jc("#seq").string("seq: select a segment to show its sequence");
		});

		//jc.start(this.canvasId, true);
	},

	drawAll: function() {
		jc.start(this.canvasId);
		jc.rect(0, 0, 900, 50, "#EEEEFF", true);
		jc.text("seq: select a segment to show its sequence", 400, 60).id("seq");
		this.text = jc("#seq");		// global text
		jc.start(this.canvasId);


		// 把JSONdata里的每一个元素画出来
		this.drawSegment(0, 40, '1','type1', 'AAATTACGA');
		this.drawSegment(60, 200, '2', 'type2', 'TAGCAGTA');
		this.drawSegment(280, 500, '3', 'type2', 'CGATATGATC');
		this.drawSegment(700, 800, '4', 'type1', 'GACTAACT');
		this.drawSegment(850, 870, '5', 'type2', 'ATTACGATACGA');
	}
};

function show(id) {
	plasmidPainter.bindCanvas(id);
	plasmidPainter.drawAll();
}