/**
 *
 *		File: 			mytree.js
 *		Author: 		Rathinho
 *		Description: 	XXX
 *
 **/


function Node(id, name, level, type, parent, children, icon, path) {
	// Node body...
	this.id = id;

	this.name = name;

	this.level = level;

	this.type = type;

	this.parent = parent;

	this.children = children;

	this.icon = icon;

	this.path = path;

	this.isInit = false;

};

function Tree(id, rootName) {
	// Tree body...
	this.id = id;

	this.nodes = [];

	this.root = new Node(-1, rootName, 0, "folder");

};

Tree.prototype = {
	// prototype...
	constructor: Tree,

	// add a new node to nodes array
	addNode: function(name, level, parentName, childrenNames, path) {
		var id = this.nodes.length;
		var type;

		if (name.match(/\.xml/)) {
			type = "file";
			icon = "file.png";
		} else {
			type = "folder";
			icon = "filefolder.png";
		}

		var name = name.split(".");

		this.nodes[this.nodes.length] = new Node(id, name[0], level, type, parentName, childrenNames, icon, path);
	},

	getNodeByName: function(name) {
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].name === name) {
				return this.nodes[i];
			}
		};
	},

	renderNode: function(node) {
		if ($("#level-" + node.level + "-" + node.parent).length > 0) {
			var shortname = node.name.length > 12 ? node.name.substr(0, 9) + ".." : node.name,
				img = "<img src=\"../static/img/" + node.icon + "\">",
				iconDiv = "<div class=\"factorIcon\">" + img + "</div>",
				nameDiv = "<div class=\"factorName\"><span class=\"label label-info\">" + shortname + "</span></div>",
				outerDiv = "<div class=\"factorNode\" id=\"factor-" + node.name + "\">" + iconDiv + nameDiv + "</div>";
	
			$("#level-" + node.level + "-" + node.parent).append(outerDiv);

			// add tooltip
			$("#factor-" + node.name + " .label").tooltip({
		      animation: true,
		      title : node.name,
		      placement : 'top',
		    });


			// bind click event
			$("#factor-" + node.name).click(function() {
				// if type is "folder"
				if (node.type === "folder") {
					// display when subtree exists
					if ($("#level-" + (node.level + 1) + "-" + node.name).length > 0) {
						$(".factorLevel").each(function() {
							$(this).css("display", "none");
						});
						$("#level-" + (node.level + 1) + "-" + node.name).css("display", "block");
						$("#level-" + (node.level + 1) + "-" + node.name).mCustomScrollbar({
							autoHideScrollbar: true,
							theme: "light",
							advanced: {
								autoExpandVerticalScroll: true
							}
						});

					} else {	// else load subtree and add it to tree						
						alert("not found");

						

					}
				} else {	// if type is "file"					
					var adder = new BiobrickAdder();
					var offset = $(this).offset();			
					adder.init(node.name, "g.Shapes.Protein", offset.top, offset.left);
					adder.show();
				}
			});
		}
	},

	renderAll: function() {
		for (var i = 0; i < this.nodes.length; i++) {
			this.renderNode(this.nodes[i]);
		};		
	},

	parseSubTree: function(data) {

	},

	parseJson: function(data) {
		this.isInit = true;
		var rootPathSeg = data[0].split("\\");
		var rootLevel = rootPathSeg.length - 3;
		var rootParentName = rootPathSeg[rootPathSeg.length - 2].split(" ").join("-");
		var levelDiv = "<div class=\"factorLevel\" id=\"level-" + rootLevel + "-" + rootParentName + "\"></div>"
		$("#pFactors").append(levelDiv);
		$("#level-" + rootLevel + "-" + rootParentName).css("display", "block");

		for (var i = 0; i < data.length; i++) {
			var pathSeg = data[i].split("\\");
			var name = pathSeg[pathSeg.length - 1].split(" ").join("-");
			var level = pathSeg.length - 3;
			var parentName = pathSeg[pathSeg.length - 2].split(" ").join("-");

			this.addNode(name, level, parentName, "", data[i]);
		};

		this.renderAll();
	}
};


// Test script
var biobrickCatalog = new Tree("mt");
