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




function hide() {
  var windNode = $("#win");
  //2 将窗口隐藏起来  
  //方法1.修改节点的css,让窗口显示出来  
  //windNode.css("display","none");  
  //方法2：利用Jquery的show方法  
  //windNode.hide("slow");  
  //方法3: 利用Jquery的fadeIn方法  
  windNode.fadeOut("slow");
}

$().ready(function() {
  document.ontouchmove = function(e) {
    e.preventDefault();
  };

  // save or load by WebSocket
  if ("WebSocket" in window) {
    ws = new WebSocket("ws://" + document.domain + ":5000/ws");
    ws.onmessage = function(msg) {
      var message = JSON.parse(msg.data);
      if (message.request == "getDirList") {
		console.log(message.result);
		if(message.result.files=='true')
		{
			
		}else{
			if (catalogHandler.istreeInit === true) {
			  catalogHandler.addExtraJSONdata(message.result);
			} else {
			  catalogHandler.handleJSONdata(message.result.files);
			}
		}
      } else if (message.request == "getBiobrick") {
        var configBar = $("div.span2#configBar");
        configBar.css("display", "none");
        configBar = $("div.span2#configBar");
        configBar.css("display", "block");
        configbar.showAttributes(eval('(' + message.result + ')'));
      } else {
        $("p#log").html(JSON.stringify(message));
        console.log(message);
      }
    };
  }

  ws.onopen = function() {
    ws.send(JSON.stringify({
      'request': 'getDirList',
      'dir': 'web\\biobrick'
    }));
  }
  //ws.send(JSON.stringify({'request': 'getDirList','dir':'web\\biobrick'}));
  //htmlobj=$.ajax({url:"http://127.0.0.1:5000/getdir/biobrick",async:false});
  //handleCatalog(htmlobj.responseText);

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
    //ws.send(JSON.stringify({'request': 'get_part', 'table_name': 'part_list'}));

    // render every element of message from server    
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

  // Cleanly close websocket when unload window
  window.onbeforeunload = function() {
    ws.onclose = function() {}; // disable onclose handler first
    ws.close();
  };
});