/**
 *
 *    File:       graphiti.js
 *    Author:     Rathinho
 *    Description:  Initialization of graphiti
 *
 **/

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



// Creates shapes
g.Shapes = {};
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

g.Shapes.Inducer = graphiti.shape.icon.InducerIcon.extend({
  NAME: "g.Shapes.Inducer",

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
    this.label = new graphiti.shape.basic.Label("Inducer");
    this.label.setFontColor("#000000");
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

    $("#exogenous-factors-config").css({"display": "block"});
    $("#protein-config").css({"display": "none"});
    $("#component-config").css({"display": "none"});
    $("#arrow-config").css({"display": "none"});
  },

  onDoubleClick: function() {
    if (this.remove || this.label) {
      this.resetChildren();
    }
  }
});


g.Shapes.MetalIon = graphiti.shape.icon.MetalIonIcon.extend({
  NAME: "g.Shapes.MetalIon",

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
    this.label = new graphiti.shape.basic.Label("Metal ion");
    this.label.setFontColor("#000000");
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

    $("#exogenous-factors-config").css({"display": "block"});
    $("#protein-config").css({"display": "none"});
    $("#component-config").css({"display": "none"});
    $("#arrow-config").css({"display": "none"});
  },

  onDoubleClick: function() {
    if (this.remove || this.label) {
      this.resetChildren();
    }
  }
});


g.Shapes.Temperature = graphiti.shape.icon.TemperatureIcon.extend({
  NAME: "g.Shapes.Temperature",

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
    this.label = new graphiti.shape.basic.Label("Temperature");
    this.label.setFontColor("#000000");
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

    $("#exogenous-factors-config").css({"display": "block"});
    $("#protein-config").css({"display": "none"});
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