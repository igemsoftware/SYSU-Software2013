/******************************************************* 画图区  ***************************************************/
// Create namespace
var g = {};
var storage = window.localStorage;
g.Storage = Array();

g.Application = Class.extend({
  NAME: "graphiti.Application",

  /**
   * @constructor
   *
   * @param {String} canvasId the id of the DOM element to use as paint container
   */
  init: function() {
    this.view = new g.View("canvas");
  },

  undo: function() {
    this.view.getCommandStack().undo();
  },

  redo: function() {
    this.view.getCommandStack().redo();
  },

  zoom: function(x, y, zoomFactor) {
    this.view.setZoom(this.view.getZoom() * zoomFactor);
  },

  zoomReset: function() {
    this.view.setZoom(1.0);
  },

  toggleSnapToGrid: function() {
    this.view.setSnapToGrid(!this.view.getSnapToGrid());
  }

});

g.View = graphiti.Canvas.extend({

  init: function(id) {
    this._super(id);
    this.setScrollArea("#" + id);
    this.currentDropConnection = null;
    this.setSnapToGrid(true);

  },

  /**
   * @method
   * Called if the DragDrop object is moving around.<br>
   * <br>
   * Graphiti use the jQuery draggable/droppable lib. Please inspect
   * http://jqueryui.com/demos/droppable/ for further information.
   *
   * @param {HTMLElement} droppedDomNode The dragged DOM element.
   * @param {Number} x the x coordinate of the drag
   * @param {Number} y the y coordinate of the drag
   *
   * @template
   **/
  onDrag: function(droppedDomNode, x, y) {},

  /**
   * @method
   * Called if the user drop the droppedDomNode onto the canvas.<br>
   * <br>
   * Graphiti use the jQuery draggable/droppable lib. Please inspect
   * http://jqueryui.com/demos/droppable/ for further information.
   *
   * @param {HTMLElement} droppedDomNode The dropped DOM element.
   * @param {Number} x the x coordinate of the drop
   * @param {Number} y the y coordinate of the drop
   * @private
   **/
  onDrop: function(droppedDomNode, x, y) {
    //console.log("onDrop: x(" + x + "), y(" + y + ")");
    var type = $(droppedDomNode).data("shape");
    var figure = eval("new " + type + "();");
    // create a command for the undo/redo support
    var command = new graphiti.command.CommandAdd(this, figure, x, y);
    this.getCommandStack().execute(command);

    // store the node
    var temp = {};
    temp.x = figure.x;
    temp.y = figure.y;
    temp.type = type;
    temp.id = figure.id;
    g.Storage.push(temp);
    //console.log(g.Storage);
  }
});

g.Shapes = {};
g.Shapes.Process = graphiti.shape.basic.Circle.extend({
  NAME: "g.Shapes.Process",

  init: function(width, height) {
    this._super();

    if (typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(100, 100);
    }


    this.setColor("#339BB9");
    this.setBackgroundColor("#DDF4FB");

    // Label
    this.label = new graphiti.shape.basic.Label("圆");
    this.label.setFontColor("#000000");
    this.label.setStroke(0);
    this.addFigure(this.label, new graphiti.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new graphiti.layout.locator.TopLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.BottomLocator(this));

    this.label.installEditor(new graphiti.ui.LabelEditor(this.label));
  },

  onDoubleClick: function() {
    var t = prompt("Name: ", this.label.getText());
    if (t) {
      this.label.setText(t);
    }
  },

  // 添加 onclick事件 显示工具栏
  onClick: function() {
    // 显示菜单栏
    var toggleBar = $("#toggleBar");
    toggleBar.css("left", (this.x + 250) + "px");
    toggleBar.css("top", this.y + "px");
    toggleBar.css("display", "block");

    // 显示配置栏
    var configBar = $("div.span2#configBar");
    configBar.css("display", "none");
    configBar = $("div.span2#configBar");
    configBar.css("display", "block");
    configbar.setAttributes(this.id);
  }
});

g.Shapes.Rectangle = graphiti.shape.basic.Rectangle.extend({
  NAME: "g.Shapes.Rectangle",

  init: function(width, height) {
    this._super();

    if (typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(100, 100);
    }


    this.setColor("#339BB9");
    this.setBackgroundColor("#DDF4FB");

    // Label
    this.label = new graphiti.shape.basic.Label("矩形");
    this.label.setFontColor("#000000");
    this.label.setStroke(0);
    this.addFigure(this.label, new graphiti.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new graphiti.layout.locator.TopLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.BottomLocator(this));

    this.label.installEditor(new graphiti.ui.LabelEditor(this.label));
  },

  onDoubleClick: function() {
    var t = prompt("Name: ", this.label.getText());
    if (t) {
      this.label.setText(t);
    }
  },

  // 添加 onclick事件 显示工具栏
  onClick: function() {
    // 显示菜单栏
    var toggleBar = $("#toggleBar");
    toggleBar.css("left", (this.x + 250) + "px");
    toggleBar.css("top", this.y + "px");
    toggleBar.css("display", "block");

  }
});

g.Shapes.Diamond = graphiti.shape.basic.Diamond.extend({
  NAME: "g.Shapes.Diamond",

  init: function(width, height) {
    this._super();

    if (typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(100, 100);
    }


    this.setColor("#339BB9");
    this.setBackgroundColor("#DDF4FB");

    // Label
    this.label = new graphiti.shape.basic.Label("菱形");
    this.label.setFontColor("#000000");
    this.label.setStroke(0);
    this.addFigure(this.label, new graphiti.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new graphiti.layout.locator.TopLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.BottomLocator(this));

    this.label.installEditor(new graphiti.ui.LabelEditor(this.label));
  },

  onDoubleClick: function() {
    var t = prompt("Name: ", this.label.getText());
    if (t) {
      this.label.setText(t);
    }
  },

  // 添加 onclick事件 显示工具栏
  onClick: function() {
    // 显示菜单栏
    var toggleBar = $("#toggleBar");
    toggleBar.css("left", (this.x + 250) + "px");
    toggleBar.css("top", this.y + "px");
    toggleBar.css("display", "block");

  }
});

g.Shapes.Arrow = graphiti.shape.icon.ProteinArrow.extend({
  NAME: "g.Shapes.Arrow",

  init: function(width, height) {
    this._super();

    if (typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(100, 100);
    }


    this.setColor("#339BB9");
    //this.setBackgroundColor("#DDF4FB");

    // Label
    // this.label = new graphiti.shape.basic.Label("PCS");
    // this.label.setFontColor("#000000");
    // this.label.setStroke(0);
    // this.addFigure(this.label, new graphiti.layout.locator.CenterLocator(this));

    //this.createPort("hybrid", new graphiti.layout.locator.TopLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this));
    //this.createPort("hybrid", new graphiti.layout.locator.BottomLocator(this));

    // this.label.installEditor(new graphiti.ui.LabelEditor(this.label));
  }
});
















/******************************************************* 目录树  ***************************************************/
var catalogHandler = {
  istreeInit: false,

  parentNode: $("#catalog"),

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
        tree.add(tree.aNodes.length, parentId, data, "#", data, "", "../static/img/folder.png", "../static/img/folderopen.png", "", path);
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
    this.parentNode.html(""); //清空目录树
    this.parentNode.append(tree.toString());

    $("#catalog").mCustomScrollbar({
      autoHideScrollbar: true,
      theme: "light",
      advanced: {
        autoExpandVerticalScroll: true
      }
    });
  },

  addExtraJSONdata: function(JSONdata, nodeName) {
    data = JSONdata.files;

    console.log(JSONdata);
    
    // 获取子节点数据并插入到dtree中
    for (var i = 0; i < data.length; i++) {
      var levels = data[i].split("\\");
      var path = "web";
      for (var j = 1; j < levels.length; j++) {
        // 设置路径
        path = path.concat("\\", levels[j]);
        var parentName = "Proteins";
        if (j !== 1)
          parentName = levels[j - 1];

        // 不显示web\biobrick前缀
        if (j >= 3) 
          this.insertCatalogItem(parentName, levels[j], d, path);
      }
    }
    this.showTree(d);

    // 默认打开当前节点
    var cur_id = this.getParentId(nodeName, d);
    d.o(cur_id);
  },

  // 解析JSON数据并生成目录树
  handleJSONdata: function(JSONdata) {
    data = JSONdata;
    this.istreeInit = true;
    d = new dTree('d');
    d.add(0, -1, 'Proteins');
    for (var i = 0; i < data.length; i++) {
      var levels = data[i].split("\\");
      var path = "web";
      for (var j = 1; j < levels.length; j++) {
        // 设置路径
        path = path.concat("\\", levels[j]);

        var parentName = "Proteins";
        if (j !== 1)
          parentName = levels[j - 1];

        // 不显示web\biobrick前缀
        if(j >= 3) {
          this.insertCatalogItem(parentName, levels[j], d, path);

          this.renderNode(levels[j]);          
        } 
      }
    }

    $("#eFactors").mCustomScrollbar({
      autoHideScrollbar: true,
      theme: "light",
      advanced: {
        autoExpandVerticalScroll: true
      }
    });

    this.showTree(d); // 显示目录树
    d.openAll(); // 默认打开所有目录
  },

  renderNode: function(data) {
    var split = data.split(" ");
    console.log(split);

    var id = "";
    if (split.length > 1) {
      for (var i = 0; i < split.length - 1; i++) {
        id += split[i] + "-";
      }
      id += split[i];
    } else {
      id = data;
    }

    var shortname = data.length > 12 ? data.substr(0, 9) + ".." : data,
        img = "<img src=\"../static/img/lock.png\">",
        iconDiv = "<div class=\"factorIcon\">" + img + "</div>",
        nameDiv = "<div class=\"factorName\"><span class=\"label label-info\">" + shortname + "</span></div>",
        outerDiv = "<div class=\"factorNode\" id=\"factor-" + id + "\">" + iconDiv + nameDiv + "</div>";

    

    $("#eFactors").append(outerDiv);
    $("#eFactors").mCustomScrollbar('update');

    $("#factor-" + id + " .label").tooltip({
      animation: true,
      title : data,
      placement : 'top',
    });
  }
};












/******************************************************* 配置栏  ***************************************************/
var configbar = {
  createInput: function(attr, defaultValue) {
    var div = document.createElement("div");
    div.className = "input-prepend";
    var label = document.createElement("label");
    label.className = "add-on"
    label.innerText = attr + ":";
    var input = document.createElement("input");
    input.type = "text";
    input.id = attr + "-input";
    input.name = attr + "-input";
    input.value = defaultValue;
    div.appendChild(label);
    div.appendChild(input);

    return div;
  },

  saveData: function(id, JSONdata) {
    storage.setItem(id, JSON.stringify(JSONdata));
    ws.onopen = function() {
      dataToSend = JSON.stringify({
        'request': 'saveUserData',
        'data': JSON.stringify(JSONdata)
      });
      ws.send(dataToSend);
      console.log(dataToSend);
    }
    //storage.clear();
  },

  setAttributes: function(id) {
    // 生成config bar并添加标题 
    var configBar = document.getElementById("optionpanel");
    configBar.innerHTML = "";
    var h3 = document.createElement("h3");
    h3.innerText = "Config Bar";
    configBar.appendChild(h3);

    // add input for id
    //var defaultValue = storage.getItem(id) === null ? "" : storage.getItem(id);
    var idInput = this.createInput("id", "");
    configBar.appendChild(idInput);

    // add input for seq
    var seqInput = this.createInput("seq", "");
    configBar.appendChild(seqInput);

    // add button 
    var btn_save = document.createElement("button");
    btn_save.id = "btn-save";
    btn_save.innerText = "save";
    var thisObj = this;
    btn_save.onclick = function() {
      var inputList = document.getElementsByTagName("input");
      var elem = {};
      var key = inputList[0].value;
      for (var i = 0; i < inputList.length; i++) {
        elem[inputList[i].id] = inputList[i].value;
      };

      thisObj.saveData(id, elem);

      //alert("saved. ^_^! ");
    };
    configBar.appendChild(btn_save);
  },

  showAttributes: function(JSONdata) {
    //example
    //console.log(JSONdata);
    var id = JSONdata["rsbpml"]["part_list"]["part"]["part_id"];
    var seq = JSONdata["rsbpml"]["part_list"]["part"]["sequences"]["seq_data"];
    var attrs = [{
      attrName: "id",
      attrValue: id
    }, {
      attrName: "seq",
      attrValue: seq
    }];
    // 生成config bar并添加标题 
    var configBar = document.getElementById("optionpanel");
    configBar.innerHTML = "";
    var h3 = document.createElement("h3");
    h3.innerText = "Config Bar";
    configBar.appendChild(h3);

    // 添加属性
    for (var i = 0; i < attrs.length; i++) {
      var p = document.createElement("p");
      p.innerText = attrs[i].attrName + ": " + attrs[i].attrValue;
      configBar.appendChild(p);
    }
  }
};


/******************************************************* 全局  ***************************************************/
$().ready(function() {
  document.ontouchmove = function(e) {
    e.preventDefault();
  };

  // slide in right-container
  $("#right-container").mouseover(function() {
    $("#right-container").css({
      right: '0px'
    });
  });

  // slide out right-container
  $("#right-container").mouseout(function() {
    $("#right-container").css({
      right: '-261px'
    });
  });

  // logout
  $("#logout").click(function() {
    ws.send(JSON.stringify({
      'request' : 'loginOut'
    }));
  });

  // save file
  $("#save").click(function() {
    var fnInput = $("#fn-input");
    var filename = fnInput.attr('value');
    if (!filename) {
      fnInput.focus();
      fnInput.tooltip('show');

      var tid = setInterval(function() {
        var newFilename = fnInput.attr('value');

        if (newFilename) {
          console.log("change");
          fnInput.tooltip('destroy');
          clearInterval(tid);
        }
      }, 500);
    } else {
      $("#save-trigger").click();
    }
  });

  $("#protein-config").ready(function() {
    E.config({
      baseUrl: 'static/js/regulation/slider/js/'
    });

    E.use('slider', function() {
      // Slider 1
      var slider = new E.ui.Slider('#slider-1', {
        min: 0,
        max: 10,
        value: 5,
        axis: 'x',
        size: '198px'
      });

      var demoText = E('#slider-text-1');
      slider.on('slide', function(e) {
        demoText.text(this.value / 10);
      });

      demoText.on('click', function() {
        slider.setValue(5);
      });

      // Slider 2
      var slider = new E.ui.Slider('#slider-2', {
        min: -1,
        max: 10,
        value: 0,
        axis: 'x',
        size: '198px'
      });

      var demoText = E('#slider-text-2');
      slider.on('slide', function(e) {
        demoText.text(this.value);
      });

      demoText.on('click', function() {
        slider.setValue(0);
      });

      // Slider 3
      var slider = new E.ui.Slider('#slider-3', {
        min: -10,
        max: 10,
        value: 0,
        axis: 'x',
        size: '198px'
      });

      var demoText = E('#slider-text-3');
      slider.on('slide', function(e) {
        demoText.text(this.value);
      });

      demoText.on('click', function() {
        slider.setValue(0);
      });

      // Slider 4
      var slider = new E.ui.Slider('#slider-4', {
        min: -10,
        max: 10,
        value: 0,
        axis: 'x',
        size: '198px'
      });

      var demoText = E('#slider-text-4');
      slider.on('slide', function(e) {
        demoText.text(this.value);
      });

      demoText.on('click', function() {
        slider.setValue(0);
      });
    });

    $("#component-config").ready(function() {
      $("#component-form").mCustomScrollbar({
        autoHideScrollbar: true,
        theme: "dark-thin",
        advanced: {
          autoExpandVerticalScroll: true
        }
      });
    });
  });

































































  // save or load by WebSocket
  if ("WebSocket" in window) {
    ws = new WebSocket("ws://" + document.domain + ":5000/ws");
    ws.onmessage = function(msg) {
      var message = JSON.parse(msg.data);
      if (message.request == "getDirList") { // 获取目录
        if (message.result.files == 'true') {

        } else {
          if (catalogHandler.istreeInit === true) {
            var path = message.result.path.split("\\");
            catalogHandler.addExtraJSONdata(message.result, path[path.length - 1]);
          } else {
            catalogHandler.handleJSONdata(message.result.files);
          }
        }
      } else if (message.request == "getXmlJson") { // 获取单个元件的配置数据
        var part = eval('(' + message.result + ')').rsbpml.part_list.part;

        $("input[name=part_id]").attr({
          'value': part.part_id
        });
        $("input[name=part_name]").attr({
          'value': part.part_name
        });
        $("input[name=part_short_name]").attr({
          'value': part.part_short_name
        });
        $("input[name=part_short_desc]").attr({
          'value': part.part_short_desc
        });
        $("input[name=part_type]").attr({
          'value': part.part_type
        });
        $("input[name=part_status]").attr({
          'value': part.part_status
        });
        $("input[name=part_results]").attr({
          'value': part.part_results
        });
        $("input[name=part_nickname]").attr({
          'value': part.part_nickname
        });
        $("input[name=part_rating]").attr({
          'value': part.part_rating
        });
        $("input[name=part_author]").attr({
          'value': part.part_author
        });
        $("input[name=part_entered]").attr({
          'value': part.part_entered
        });
        $("input[name=part_quality]").attr({
          'value': part.best_quality
        });

        var twinsHtml = "";
        if (part.twins) {
          for (var i = 0; i < part.twins.twin.length; i++) {
            var li = "<li>" + part.twins.twin[i] + "</li>"
            twinsHtml += li;
          }
        }
        $("#twins").html(twinsHtml);

				game.addComponent(part);

      } else if (message.request == "getLoginedUserName") { // 获取用户名
        $("#user-view-left > p").text(message.result);
      } else if (message.request == "loginOut") {
        window.location = "..";
      }
    };
  }





  // 登录后自动获取Proteins列表和用户名
  ws.onopen = function() {
    ws.send(JSON.stringify({
      'request': 'getDirList',
      'dir': 'web\\biobrick\\Protein coding sequences'
    }));

    ws.send(JSON.stringify({
      'request': 'getLoginedUserName'
    }));
  }

  // Cleanly close websocket when unload window
  window.onbeforeunload = function() {
    ws.onclose = function() {}; // disable onclose handler first
    ws.close();
  };



  // 创建工作区应用
  var app = new g.Application();

  $('#cmd_undo').click(function(ev) {
    app.undo();
  });

  $('#cmd_redo').click(function(ev) {
    app.redo();
  });

  $('#cmd_zoom_in').click(function(ev) {
    app.zoom(ev.clientX, ev.clientY, 0.9);
  });

  $('#cmd_zoom_out').click(function(ev) {
    app.zoom(ev.clientX, ev.clientY, 1.1);
  });

  $('#cmd_zoom_reset').click(function(ev) {
    app.zoomReset();
  });

  $('#cmd_snap_to_grid').click(function(ev) {
    app.toggleSnapToGrid();
  });

  





  // Bind load button to localstorage
  $("#btn-load").live("click", function() {
    var loadItem = storage.getItem('view');
    var getObj = eval('(' + loadItem + ')');
    for (var i = 0; i < getObj.length; i++) {
      var type = getObj[i].type;
      var figure = eval("new " + type + "();");
      // create a command for the undo/redo support
      var command = new graphiti.command.CommandAdd(app.view, figure, getObj[i].x, getObj[i].y);
      app.view.getCommandStack().execute(command);
    }
    $('#btn-load').attr('disabled', true);
  });

  // Bind send button to localstorage
  $("#btn-save").live("click", function() {
    var jsonStr = JSON.stringify(g.Storage);
    storage.setItem("view", jsonStr);
  });
});