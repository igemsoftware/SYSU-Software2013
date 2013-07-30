/******************************************************* 画图区  ***************************************************/
// Create namespace
var g = {};

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
    this.collection = new Array();    // Store all components in this view
    this.currentSelected = null;       // Store the figure that is currently seleted
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
    var type = $(droppedDomNode).data("shape");
    var figure = eval("new " + type + "();");
    // create a command for the undo/redo support
    var command = new graphiti.command.CommandAdd(this, figure, x, y);
    this.getCommandStack().execute(command);
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
    this.label = new graphiti.shape.basic.Label("Protein");
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

  onClick: function() {
    
  }
});


g.Shapes.Protein = graphiti.shape.icon.ProteinIcon.extend({
  NAME: "g.Shapes.Protein",

  init: function(width, height) {
    this._super();

    if (typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(107, 94);
    }

    this.setColor("#339BB9");   

    // remove button
    this.remove = new g.Buttons.Remove();
    this.Activate = new g.Buttons.Activate();
    this.Inhibit = new g.Buttons.Inhibit();
    this.CoExpress = new g.Buttons.CoExpress();

    // Label
    this.label = new graphiti.shape.basic.Label("PCS");
    this.label.setFontColor("#000000");

    // this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    // this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this)); 
  },

  onClick: function() {    
    app.view.currentSelected = this.getId();   // set current selected figure

    if (this.remove || this.label) {
      this.resetChildren();
    }

    this.addFigure(this.remove, new graphiti.layout.locator.TopLocator(this));    
    this.addFigure(this.label, new graphiti.layout.locator.BottomLocator(this));

    var canvas = this.getCanvas();
    for (var i = 0; i < canvas.collection.length; i++) {
      var figure = canvas.getFigure(canvas.collection[i]);
      if (this.getId() !== figure.getId()) {
        figure.resetChildren();
        figure.addFigure(figure.Activate, new graphiti.layout.locator.TopLeftLocator(figure));
        figure.addFigure(figure.Inhibit, new graphiti.layout.locator.TopLocator(figure));
        figure.addFigure(figure.CoExpress, new graphiti.layout.locator.TopRightLocator(figure));
      }
    };

    $("#right-container").css({right: '0px'});
    var hasClassIn = $("#collapseTwo").hasClass('in');
    if(!hasClassIn) {
      $("#collapseOne").toggleClass('in');
      $("#collapseOne").css({height: '0'});
      $("#collapseTwo").toggleClass('in');
      $("#collapseTwo").css({height: "auto"});
    }

    $("#exogenous-factors-config").css({"display": "none"});
    $("#protein-config").css({"display": "block"});
    $("#component-config").css({"display": "none"});
    $("#arrow-config").css({"display": "none"});
  },

  onDoubleClick: function() {
    if (this.remove || this.label) {
      this.resetChildren();
    }
  }
});

// Buttons
g.Buttons = {};
// Remove Button
g.Buttons.Remove = graphiti.shape.icon.Remove.extend({
  NAME: "g.Buttons.Remove",

  init: function(width, height) {
    this._super();

    if (typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(20, 20);
    }
  },

  onClick: function() {
    var parent = this.getParent();
    var command = new graphiti.command.CommandDelete(parent);   // 删除父节点
    app.view.getCommandStack().execute(command);  // 添加到命令栈中
  }
});

// Activate Button
g.Buttons.Activate = graphiti.shape.icon.Activate.extend({
  NAME: "g.Buttons.Activate",

  init: function(width, height) {
    this._super();

    if (typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(20, 20);
    }
  },

  onClick: function() {
    var target = this.getParent();
    var source = this.getCanvas().getFigure(app.view.currentSelected);

    var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.RightLocator(source));
    var targetPort = target.createPort("hybrid", new graphiti.layout.locator.LeftLocator(target));

    var command = new graphiti.command.CommandConnect(this.getCanvas(), sourcePort, targetPort, new graphiti.decoration.connection.ArrowDecorator(), "Activate");   // 连接两点
    app.view.getCommandStack().execute(command);  // 添加到命令栈中
  }
});

// Inhibit Button
g.Buttons.Inhibit = graphiti.shape.icon.Inhibit.extend({
  NAME: "g.Buttons.Inhibit",

  init: function(width, height) {
    this._super();

    if (typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(20, 20);
    }
  },

  onClick: function() {
    var target = this.getParent();
    var source = this.getCanvas().getFigure(app.view.currentSelected);

    var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.RightLocator(source));
    var targetPort = target.createPort("hybrid", new graphiti.layout.locator.LeftLocator(target));

    var command = new graphiti.command.CommandConnect(this.getCanvas(), sourcePort, targetPort, new graphiti.decoration.connection.ArrowDecorator(), "Inhibit");   // 连接两点
    app.view.getCommandStack().execute(command);  // 添加到命令栈中
  }
});

// Co-Expression Button
g.Buttons.CoExpress = graphiti.shape.icon.CoExpress.extend({
  NAME: "g.Buttons.CoExpress",

  init: function(width, height) {
    this._super();

    if(typeof radius === "number") {
      this.setDimension(radius, radius);
    } else {
      this.setDimension(20, 20);
    }
  },

  onClick: function() {
    var target = this.getParent();
    var source = this.getCanvas().getFigure(app.view.currentSelected);

    var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.RightLocator(source));
    var targetPort = target.createPort("hybrid", new graphiti.layout.locator.LeftLocator(target));

    var command = new graphiti.command.CommandConnect(this.getCanvas(), sourcePort, targetPort, new graphiti.decoration.connection.ArrowDecorator(), "CoExpress");   // 连接两点
    app.view.getCommandStack().execute(command);  // 添加到命令栈中
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

          // this.renderNode(levels[j]);          
        } 
      }
    }

    // $("#pFactors").mCustomScrollbar({
    //   autoHideScrollbar: true,
    //   theme: "light",
    //   advanced: {
    //     autoExpandVerticalScroll: true
    //   }
    // });

    this.showTree(d); // 显示目录树
    d.openAll(); // 默认打开所有目录
  },

  renderNode: function(data) {
    var split = data.split(" ");

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

    

    $("#pFactors").append(outerDiv);
    $("#pFactors").mCustomScrollbar('update');

    $("#factor-" + id + " .label").tooltip({
      animation: true,
      title : data,
      placement : 'top',
    });
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
      var slider1 = new E.ui.Slider('#slider-1', {
        min: 0,
        max: 10,
        value: 5,
        axis: 'x',
        size: '198px'
      });

      var demoText1 = E('#slider-text-1');
      slider1.on('slide', function(e) {
        demoText1.text(this.value / 10);
      });

      demoText1.on('click', function() {
        slider1.setValue(5);
      });

      // Slider 2
      var slider2 = new E.ui.Slider('#slider-2', {
        min: -1,
        max: 10,
        value: 0,
        axis: 'x',
        size: '198px'
      });

      var demoText2 = E('#slider-text-2');
      slider2.on('slide', function(e) {
        demoText2.text(this.value);
      });

      demoText2.on('click', function() {
        slider2.setValue(0);
      });

      // Slider 3
      var slider3 = new E.ui.Slider('#slider-3', {
        min: -10,
        max: 10,
        value: 0.5,
        axis: 'x',
        size: '198px'
      });

      var demoText3 = E('#slider-text-3');
      slider3.on('slide', function(e) {
        demoText3.text(this.value);
      });

      demoText3.on('click', function() {
        slider3.setValue(0.5);
      });

      // Slider 4
      var slider4 = new E.ui.Slider('#slider-4', {
        min: -10,
        max: 10,
        value: 0,
        axis: 'x',
        size: '198px'
      });

      var demoText4 = E('#slider-text-4');
      slider4.on('slide', function(e) {
        demoText4.text(this.value);
      });

      demoText4.on('click', function() {
        slider4.setValue(0);
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
          if (biobrickCatalog.isInit) {
            var path = message.result.path.split("\\");
            // catalogHandler.addExtraJSONdata(message.result, path[path.length - 1]);
            biobrickCatalog.parseSubTree(message.result);
          } else {
            // catalogHandler.handleJSONdata(message.result.files);
            biobrickCatalog.parseJson(message.result.files);
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

    //     var twinsHtml = "";
    //     if (part.twins) {
    //       for (var i = 0; i < part.twins.twin.length; i++) {
    //         var li = "<li>" + part.twins.twin[i] + "</li>"
    //         twinsHtml += li;
    //       }
    //     }
    //     $("#twins").html(twinsHtml);

				// game.addComponent(part);

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
      //'dir': './biobrick/Protein coding sequences'
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
  app = new g.Application();

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
