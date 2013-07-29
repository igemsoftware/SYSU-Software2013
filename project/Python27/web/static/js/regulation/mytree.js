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

};

function Tree(id) {
	// Tree body...
	this.id = id;

	this.nodes = [];

	this.root = new Node(-1, "root", "folder");

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
			icon = "folder.png";
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
		var shortname = node.name.length > 12 ? node.name.substr(0, 9) + ".." : node.name,
			img = "<img src=\"" + node.icon + "\">",
			iconDiv = "<div class=\"factorIcon\">" + img + "</div>",
			nameDiv = "<div class=\"factorName\"><span class=\"label label-info\">" + shortname + "</span></div>",
			outerDiv = "<div class=\"factorNode\" id=\"factor-" + node.name + "\">" + iconDiv + nameDiv + "</div>";

		$("#level-" + node.level + "-" + node.parent).append(outerDiv);
		$("#factor-" + node.name).click(function() {
			if (node.type === "folder") {
				$(".factorLevel").each(function(){
					$(this).css("display", "none");					
				});
				$("#level-" + (node.level+1) + "-" + node.name).css("display", "block");
			} else {
				alert("file");
			}
		});
	},

	renderAll: function() {
		for (var i = 0; i < this.nodes.length; i++) {
			this.renderNode(this.nodes[i]);
		};
	}
};


// Test script
var t = new Tree("mt");
t.addNode("folder-1", 1, "root");
t.addNode("folder-2", 1, "root");
t.addNode("1.xml", 2, "folder-1");
t.addNode("2.xml", 2, "folder-1");
t.addNode("3.xml", 2, "folder-1");
t.addNode("4.xml", 2, "folder-1");
t.addNode("5.xml", 2, "folder-2");
t.addNode("6.xml", 2, "folder-2");
t.addNode("7.xml", 2, "folder-2");
t.addNode("8.xml", 2, "folder-2");
t.addNode("9.xml", 2, "folder-2");
t.addNode("9.xml", 2, "folder-2");
t.renderAll();