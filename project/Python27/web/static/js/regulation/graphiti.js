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
        this.collection = new Array(); // Store all components in this view
        this.connections = new Array(); // Store all connections in this view
        this.currentSelected = null; // Store the figure that is currently seleted

        this.collection.counter = 0;
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
    },

    onMouseDown : function(/* :int */x, /* :int */y)
    {
        var canDragStart = true;

        var figure = this.getBestFigure(x, y);

        // check if the user click on a child shape. DragDrop and movement must redirect
        // to the parent
        // Exception: Port's
        if((figure!==null && figure.getParent()!==null) && !(figure instanceof graphiti.Port)){
            figure = figure.getParent();
        }
        
        if (figure !== null && figure.isDraggable()) {
            canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY());
            // Element send a veto about the drag&drop operation
            if (canDragStart === false) {
                this.mouseDraggingElement = null;
                this.mouseDownElement = figure;
            }
            else {
                this.mouseDraggingElement = figure;
                this.mouseDownElement = figure;
            }
        }

        if (figure !== this.currentSelection && figure !== null && figure.isSelectable() === true) {

            this.hideResizeHandles();
            this.setCurrentSelection(figure);

            // its a line
            if (figure instanceof graphiti.shape.basic.Line) {
                // you can move a line with Drag&Drop...but not a connection.
                // A Connection is fixed linked with the corresponding ports.
                //
                if (!(figure instanceof graphiti.Connection)) {
                    this.draggingLineCommand = figure.createCommand(new graphiti.command.CommandType(graphiti.command.CommandType.MOVE));
                    if (this.draggingLineCommand !== null) {
                        this.draggingLine = figure;
                    }
                }
            }
            else if (canDragStart === false) {
                this.setCurrentSelection(null);
            }
        }
        else if (figure === null) {
            this.setCurrentSelection(null);
        }

        if (figure == null) {
            g.hideAllToolbar();
        }
    }
});



// Creates shapes
g.Shapes = {};

// shape container
g.Shapes.Container = graphiti.shape.basic.Rectangle.extend({
    NAME: "g.Shapes.Container",

    init: function(width, height) {
        this._super(); 

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(100, 100);
        }

        this.TYPE = "Container";
        this.count = 0;

        this.boundElements = new Array();
        this.setAlpha(0.1);

        // Buttons
        this.remove = new g.Buttons.Remove();
        this.Activate = new g.Buttons.Activate();
        this.Inhibit = new g.Buttons.Inhibit();
        this.CoExpress = new g.Buttons.CoExpress();

        // this.addFigure(new g.Shapes.Protein(), new graphiti.layout.locator.LeftLocator(this));
    },

    onClick: function() {
        g.toolbar(this);
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    },

    resetChildren: function() {
        var that = this;
        this.children.each(function(i, e) {
            if (!e.figure.TYPE) {
                e.figure.setCanvas(null);
                that.children.remove(e.figure);
            }
        });
        this.repaint();
    }
});

// button container
g.Shapes.btnContainer = graphiti.shape.icon.ProteinIcon.extend({
    NAME: "g.Shapes.btnContainer",

    init: function(width, height) {
        this._super(); 

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(5, 30);
        }

        this.TYPE = "btnContainer";
        // this.setAlpha(0.1);

        // Buttons
        this.Activate = new g.Buttons.Activate();
        this.Inhibit = new g.Buttons.Inhibit();
        this.addFigure(this.Activate, new graphiti.layout.locator.LeftLocator(this));
        this.addFigure(this.Inhibit, new graphiti.layout.locator.RightLocator(this));
    }
});


// Protein component
g.Shapes.Protein = graphiti.shape.icon.ProteinIcon.extend({
    NAME: "g.Shapes.Protein",

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(100, 100);
        }

        this.setColor("#339BB9");
        this.TYPE = "Protein";

        // Buttons
        this.remove = new g.Buttons.Remove();
        this.Activate = new g.Buttons.Activate();
        this.Inhibit = new g.Buttons.Inhibit();
        this.CoExpress = new g.Buttons.CoExpress();

        // Label
        // this.label = new graphiti.shape.basic.Label("PCS");
        // this.label.setFontColor("#000000");
    },

    onClick: function() {
        g.toolbar(this);
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    }
});

// Inducer component
g.Shapes.Inducer = graphiti.shape.icon.InducerIcon.extend({
    NAME: "g.Shapes.Inducer",

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(100, 100);
        }

        // this.setColor("#339BB9");
        this.TYPE = "Inducer";

        // Buttons
        this.remove = new g.Buttons.Remove();
        this.Activate = new g.Buttons.Activate();
        this.Inhibit = new g.Buttons.Inhibit();
        this.CoExpress = new g.Buttons.CoExpress();
        this.btnContainer = new g.Shapes.btnContainer();

        // Label
        this.label = new graphiti.shape.basic.Label("Inducer");
        this.label.setFontColor("#000000");
    },

    onClick: function() {
        g.toolbar(this);
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    }
});


// Metal-Ion component
g.Shapes.MetalIon = graphiti.shape.icon.MetalIonIcon.extend({
    NAME: "g.Shapes.MetalIon",

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(100, 100);
        }

        this.setColor("#339BB9");
        this.TYPE = "MetalIon";

        // Buttons
        this.remove = new g.Buttons.Remove();
        this.Activate = new g.Buttons.Activate();
        this.Inhibit = new g.Buttons.Inhibit();
        this.CoExpress = new g.Buttons.CoExpress();

        // Label
        this.label = new graphiti.shape.basic.Label("Metal ion");
        this.label.setFontColor("#000000");
    },

    onClick: function() {
        g.toolbar(this);
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    }
});


// Temperature component
g.Shapes.Temperature = graphiti.shape.icon.TemperatureIcon.extend({
    NAME: "g.Shapes.Temperature",

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(100, 100);
        }

        this.setColor("#339BB9");
        this.TYPE = "Temperature";

        // Buttons
        this.remove = new g.Buttons.Remove();
        this.Activate = new g.Buttons.Activate();
        this.Inhibit = new g.Buttons.Inhibit();
        this.CoExpress = new g.Buttons.CoExpress();

        // Label
        this.label = new graphiti.shape.basic.Label("Temperature");
        this.label.setFontColor("#000000");
    },

    onClick: function() {
        g.toolbar(this);
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    }
});


// R/A component
g.Shapes.RORA = graphiti.shape.icon.RORAIcon.extend({
    NAME: "g.Shapes.RORA",

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(100, 100);
        }

        this.setColor("#339BB9");
        this.TYPE = "RORA";

        // Buttons
        this.remove = new g.Buttons.Remove();
        this.Activate = new g.Buttons.Activate();
        this.Inhibit = new g.Buttons.Inhibit();
        this.CoExpress = new g.Buttons.CoExpress();

        // Label
        this.label = new graphiti.shape.basic.Label("A/R");
        this.label.setFontColor("#000000");
    },

    onClick: function() {
        g.toolbar(this);
    },

    onDoubleClick: function() {
        if (this.remove || this.label) {
            this.resetChildren();
        }
    }
});

// R
g.Shapes.R = graphiti.shape.icon.R.extend({
    NAME: "g.Shapes.R",

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(100, 100);
        }

        this.TYPE = "R";
    }
});

// A
g.Shapes.A = graphiti.shape.icon.A.extend({
    NAME: "g.Shapes.A",

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(100, 100);
        }

        this.TYPE = "A";
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
        var parent = this.getParent(),
            connections = parent.getConnections();

        for (var i = 0; i < connections.size; i++) {
            app.view.connections.remove(connections.get(i).getId());
        }

        var command = new graphiti.command.CommandDelete(parent); // 删除父节点
        app.view.getCommandStack().execute(command); // 添加到命令栈中
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
        var canvas = this.getCanvas();
        var source = this.getParent();

        if (canvas.getFigure(app.view.currentSelected).TYPE == "Protein" || canvas.getFigure(app.view.currentSelected).TYPE == "Container") {
            g.bind(canvas.getFigure(app.view.currentSelected), null, "A");
            var target = g.cache;
            var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            var targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomRightLocator(target));

            var command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.ArrowDecorator(), "Activate"); // 连接两点
            app.view.getCommandStack().execute(command); // 添加到命令栈中
            app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中

        } else if (canvas.getFigure(app.view.currentSelected).TYPE == "RORA") {
            var target = canvas.getFigure(app.view.currentSelected);
            var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            var targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomLocator(target));

            var command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.ArrowDecorator(), "Activate"); // 连接两点
            app.view.getCommandStack().execute(command); // 添加到命令栈中
            app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中

        } else if (canvas.getFigure(app.view.currentSelected).TYPE == "Inducer") {
            var target = canvas.getFigure(app.view.currentSelected);
            // var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            var targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomLocator(target));
            var sourcePort = new graphiti.HybridPort();
            source.addFigure(sourcePort, new graphiti.layout.locator.ManhattanMidpointLocator(source));

            var command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.ArrowDecorator(), "Activate");
            app.view.getCommandStack().execute(command); // 添加到命令栈中
            app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中
        }
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
        var canvas = this.getCanvas();
        var source = this.getParent();
        console.log("Click Inhibit");
        if (canvas.getFigure(app.view.currentSelected).TYPE == "Protein" || canvas.getFigure(app.view.currentSelected).TYPE == "Container") {
            g.bind(canvas.getFigure(app.view.currentSelected), null, "R");
            var target = g.cache;
            var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            var targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomRightLocator(target));

            // new graphiti.decoration.connection.ArrowDecorator()
            var command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.TDecorator(), "Inhibit"); // 连接两点
            app.view.getCommandStack().execute(command); // 添加到命令栈中
            app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中

        } else if (canvas.getFigure(app.view.currentSelected).TYPE == "RORA") {
            var target = canvas.getFigure(app.view.currentSelected);
            var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            var targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomLocator(target));

            var command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.TDecorator(), "Inhibit"); // 连接两点
            app.view.getCommandStack().execute(command); // 添加到命令栈中
            app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中
        } else if (canvas.getFigure(app.view.currentSelected).TYPE == "Inducer") {
            var target = canvas.getFigure(app.view.currentSelected);
            // var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            var targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomLocator(target));
            var sourcePort = new graphiti.HybridPort();
            source.addFigure(sourcePort, new graphiti.layout.locator.ManhattanMidpointLocator(source));

            var command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.TDecorator(), "Inhibit");
            app.view.getCommandStack().execute(command); // 添加到命令栈中
            app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中
        }
    }
});

// Co-Expression Button
g.Buttons.CoExpress = graphiti.shape.icon.CoExpress.extend({
    NAME: "g.Buttons.CoExpress",

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

        if (source.TYPE == "Protein" || source.TYPE == "Container") {
            g.bind(source, target, "Protein");
        } else if (source.TYPE == "RORA") {
            g.bind(source, target, "RORA")
        }
    }
});

g.Buttons.Unbind = graphiti.shape.icon.CoExpress.extend({
    NAME: "g.Buttons.Unbind",

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(20, 20);
        }
    },

    onClick: function() {
        g.unbind(this.getParent());
    }
});



// functions 
/*
 *  两个元素的绑定
 */
(function(ex) {
    ex.bind = function(source, target, type) {
        var srcPosX = source.getX(),
            srcPosY = source.getY();
        var canvas = source.getCanvas();
        

        if (source.TYPE === "Container") {
            console.log("has container");
            container = source;
            // console.log(container);
            // container.setDimension(source.count * 100 + 100, 100);            
        } else {
            console.log("new container");
            // 测试用
            container = new g.Shapes.Container();
            app.view.collection.push(container.getId());
            // create a command for the undo/redo support            
            var command = new graphiti.command.CommandAdd(app.view, container, srcPosX, srcPosY);
            app.view.getCommandStack().execute(command);
            container.addFigure(source, new graphiti.layout.locator.ContainerLocator(container, container.count, 100));
            source.resetChildren();
            container.count += 1;            
        }
       

        if (type == "Protein") {
            container.setDimension(container.count * 100 + 100, 100);
            container.addFigure(target, new graphiti.layout.locator.ContainerLocator(container, container.count, 100));
            container.count += 1;
            target.resetChildren();
        } else if (type == "RORA") {
            container.addFigure(target, new graphiti.layout.locator.ContainerLocator(container, container.count, 100));
        } else if (type == "R") {
            var has = false;
            for (var i = 0 ; i < container.getChildren().size ; i++) {
                var figure = container.getChildren().get(i);
                if (figure.TYPE == "R") {
                    has = true;
                    break;
                }
            }

            if (!has) {
                container.setDimension(container.count * 100 + 100, 100);
                container.addFigure(new g.Shapes.R(), new graphiti.layout.locator.ContainerLocator(container, container.count, 100));
                container.count += 1;
            }
        } else if (type == "A") {
            var has = false;
            for (var i = 0 ; i < container.getChildren().size ; i++) {
                var figure = container.getChildren().get(i);
                if (figure == source) {
                    console.log(figure);
                    // has = true;
                    // break;
                }
            }

            if (!has) {
                container.setDimension(container.count * 100 + 100, 100);
                container.addFigure(new g.Shapes.A(), new graphiti.layout.locator.ContainerLocator(container, container.count, 100));
                container.count += 1;
            }
        }

        g.cache = container;
        g.hideAllToolbar();
    };
})(g);


/*
 *  元素的解绑定
 */
(function(ex) {
    ex.unbind = function(figure) {
        
    }
})(g);


/*
 * 在生物元件上方显示操作按钮组
 */
(function(ex) {
    ex.toolbar = function(ctx) {

        // Dom operation
        $("#right-container").css({
            right: '0px'
        });

        var hasClassIn = $("#collapseTwo").hasClass('in');
        if (!hasClassIn) {
            $("#collapseOne").toggleClass('in');
            $("#collapseOne").css({
                height: '0'
            });
            $("#collapseTwo").toggleClass('in');
            $("#collapseTwo").css({
                height: "auto"
            });
        }

        $("#exogenous-factors-config").css({
            "display": "none"
        });
        $("#protein-config").css({
            "display": "none"
        });
        $("#component-config").css({
            "display": "none"
        });
        $("#arrow-config").css({
            "display": "none"
        });


        // set current selected figure
        app.view.currentSelected = ctx.getId();

        // remove all children nodes
        if (ctx.remove || ctx.label) {
            ctx.resetChildren();
        }

        // add remove button and label
        ctx.addFigure(ctx.remove, new graphiti.layout.locator.TopLocator(ctx));
        // ctx.addFigure(ctx.label, new graphiti.layout.locator.BottomLocator(ctx));

        // get this canvas
        var canvas = ctx.getCanvas();


        // different opearation for different types of components
        if (ctx.TYPE == "Protein") {
            for (var i = 0; i < canvas.collection.length; i++) {
                var figure = canvas.getFigure(canvas.collection[i]);
                if (figure != null && ctx.getId() !== figure.getId() && (figure.TYPE == "Protein" || figure.TYPE == "Container")) {
                    figure.resetChildren();
                    figure.addFigure(figure.Activate, new graphiti.layout.locator.TopLeftLocator(figure));
                    figure.addFigure(figure.Inhibit, new graphiti.layout.locator.TopLocator(figure));
                    figure.addFigure(figure.CoExpress, new graphiti.layout.locator.TopRightLocator(figure));
                }
            };

            // show protein configuration
            $("#protein-config").css({
                "display": "block"
            });
        } else if (ctx.TYPE == "Inducer") {
            var connections, connection;
            connections = canvas.getLines();

            for (var i = 0; i < connections.size; i++) {
                connection = connections.get(i);
                connection.addFigure(new g.Buttons.Activate(), new graphiti.layout.locator.ManhattanMidpointLocator(connection));
                connection.addFigure(new g.Buttons.Inhibit(), new graphiti.layout.locator.MidpointLocator(connection));
            };

            // show exogenous-factors configuration
            $("#exogenous-factors-config").css({
                "display": "block"
            });

        } else if (ctx.TYPE == "RORA") {
            for (var i = 0; i < canvas.collection.length; i++) {
                var figure = canvas.getFigure(canvas.collection[i]);
                if (figure != null && ctx.getId() !== figure.getId() && figure.TYPE == "Protein") {
                    figure.resetChildren();
                    figure.addFigure(figure.Activate, new graphiti.layout.locator.TopLeftLocator(figure));
                    figure.addFigure(figure.Inhibit, new graphiti.layout.locator.TopLocator(figure));
                    figure.addFigure(figure.CoExpress, new graphiti.layout.locator.TopRightLocator(figure));
                }
            };
        } else if (ctx.TYPE == "Container") {
            for (var i = 0; i < canvas.collection.length; i++) {
                var figure = canvas.getFigure(canvas.collection[i]);
                if (figure != null && ctx.getId() !== figure.getId() && (figure.TYPE == "Protein" || figure.TYPE == "Container")) {
                    figure.resetChildren();
                    figure.addFigure(figure.Activate, new graphiti.layout.locator.TopLeftLocator(figure));
                    figure.addFigure(figure.Inhibit, new graphiti.layout.locator.TopLocator(figure));
                    figure.addFigure(figure.CoExpress, new graphiti.layout.locator.TopRightLocator(figure));
                }
            };
        }

    };
})(g);

(function(ex) {
    ex.closeToolbar = function(ctx) {
        // remove all children nodes
        // console.log(ctx);
        if (ctx.remove || ctx.label) {
            ctx.resetChildren();
        }
    };
})(g);


(function(ex) {
    ex.hideAllToolbar = function() {
        var canvas = app.view;

        for (var i = 0; i < canvas.collection.length; i++) {
            var figure = canvas.getFigure(canvas.collection[i]);
            g.closeToolbar(figure);
        };

        var connections, connection;
        connections = canvas.getLines();
        for (var i = 0; i < connections.size; i++) {
            connection = connections.get(i);
            g.closeToolbar(connection);
        };
    }
})(g);

// remove all lines that can be traversed along the path starting from "startNode"
(function(ex) {
    ex.removeLinks = function(startNode) {

    }
})(g);