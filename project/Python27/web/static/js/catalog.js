var catalogHandler = {
	istreeInit: false,
	parentNode: $("#catalog"),

	// 插入目录项到html中
	appendCatalogItem: function(parent, index, data) {
		var parentNode = $("#" + parent);

		if (parentNode.children("#" + data).length === 0) {
			parentNode.append("<div class='treelevel-" + index + "' id=" + data + ">" + data + "</div>");
		}		
	},	
	
	// 判断目录树中是否有当前节点
	hasTreeNode: function(name, tree) {
		var aNodes = tree.aNodes;
		for (var i = 0; i < aNodes.length; i++) {
			if (aNodes[i].name === name) {
				return true;
			}
		}
		return false;
	},

	// 取得父节点的id
	getParentId: function(parentName, tree) {
		var aNodes = tree.aNodes;
		for (var i = 0; i < aNodes.length; i++) {
			if (aNodes[i].name === parentName) {
				return aNodes[i].id;
			}
		}
		return -2;
	},

	// 判断是否为文件夹
	isFolder: function(data) {
		var str = data;
		var pattern = /\.xml/;
		var matches = str.match(pattern);

		if (matches !== null) {
			return false;
		}
		return true;
	},

	// 向目录树插入节点
	insertCatalogItem: function(parentName, data, tree, path) {
	    if (!this.hasTreeNode(data, tree)) {
	    	var parentId = this.getParentId(parentName, tree);
	    	parentId = parentId === -2 ? 0 : parentId;
	    	var name = data.length > 15 ? data.substr(0, 15) + ".." : data;

			if (this.isFolder(data)) {
				tree.add(tree.aNodes.length, parentId, data, "#", data, "", "../static/img/folder.gif", "", "", path);
			} else {
				tree.add(tree.aNodes.length, parentId, data, "#", data, "", "", "", "", path);
			}
		}		
	},

	// 删除当前节点的所有子节点
	deleteChildren: function(nodeId, tree) {
		for (var i = 0; i < tree.aNodes.length; i++) {
			if (tree.aNodes[i].pid === nodeId) {
				tree.aNodes.splice(i, 1);
				i -= 1;
			}
		}
	},

	showTree: function(tree) {
		this.parentNode.html("<h3>Catalog</h3>");		//清空目录树
		this.parentNode.append(tree.toString());
	},
	
	addExtraJSONdata: function(JSONdata) {
		data = JSONdata.files;
		//console.log(JSONdata);
		for (var i = 0; i < data.length; i++) {
			var levels = data[i].split("\\");
			var path = "web";
			for (var j = 1; j < levels.length; j++) {
				// 设置路径
				path = path.concat("\\", levels[j]);
				var parentName = "Biobricks Database";
				if (j !== 1)
					parentName = levels[j - 1];
				this.insertCatalogItem(parentName, levels[j], d, path);
			}
		}
		this.showTree(d);
	},
	
	// 解析JSON数据并生成目录树
	handleJSONdata: function(JSONdata) {
		data = JSONdata;
		this.istreeInit = true;
		d = new dTree('d');
		d.add(0, -1, 'Biobricks Database');
		for (var i = 0; i < data.length; i++) {
			var levels = data[i].split("\\");
			var path = "web";
			for (var j = 1; j < levels.length; j++) {
				// 设置路径
				path = path.concat("\\", levels[j]);

				var parentName = "Biobricks Database";
				if (j !== 1)
					parentName = levels[j - 1];
				this.insertCatalogItem(parentName, levels[j], d, path);
			}
		}
		this.showTree(d);
		d.openAll(); // 默认打开所有目录
	}
};
