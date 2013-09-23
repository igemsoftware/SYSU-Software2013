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
        this.boundPairs = new Array(); // Store all bounds of proteins
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

    onMouseDown: function( /* :int */ x, /* :int */ y) {
        var canDragStart = true;

        var figure = this.getBestFigure(x, y);

        // check if the user click on a child shape. DragDrop and movement must redirect
        // to the parent
        // Exception: Port's
        if ((figure !== null && figure.getParent() !== null) && !(figure instanceof graphiti.Port)) {
            figure = figure.getParent();
        }

        if (figure !== null && figure.isDraggable()) {
            canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY());
            // Element send a veto about the drag&drop operation
            if (canDragStart === false) {
                this.mouseDraggingElement = null;
                this.mouseDownElement = figure;
            } else {
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
            } else if (canDragStart === false) {
                this.setCurrentSelection(null);
            }
        } else if (figure === null) {
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
        this.countLength = 0;

        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.1);

        // Buttons
        this.remove = new g.Buttons.Remove();
        this.Activate = new g.Buttons.Activate();
        this.Inhibit = new g.Buttons.Inhibit();
        this.CoExpress = new g.Buttons.CoExpress();


        // this.addFigure(new g.Shapes.Protein(), new graphiti.layout.locator.LeftLocator(this));
    },

    addItem: function(item) {
        item.locator = (item.TYPE == "Unbind") ? new graphiti.layout.locator.UnbindLocator(this, this.countLength, 100) : new graphiti.layout.locator.ContainerLocator(this, this.count, 100);
        this.addFigure(item, item.locator);
        if (item.TYPE !== "Unbind") {
            this.count ++;
        }
        this.updateContainer();
    },

    removeItem: function(item, flag) {
        var target = null;
        this.children.each(function(i, e) {
            if (e.figure.getId() == item.getId()) {
                target = e;
                return;
            }
        });

        if (target.TYPE !== "Unbind") {
            this.count--;
        }

        this.children.remove(target);

        if (flag) {
            target.figure.setCanvas(null);
        }

        this.updateContainer();
        return target.figure;
    },

    onClick: function(x, y) {
        var figure = this.getBestFigure(x, y);
        // console.log(figure);
        if (figure !== undefined)
            figure.onClick(x, y);
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
    },

    getBestFigure: function(x, y, ignoreType) {
        var result = null;

        for (var i = 0; i < this.getChildren().getSize(); i++) {
            var figure = this.getChildren().get(i);
            if (figure.hitTest(x, y) == true && figure.TYPE !== ignoreType) {
                if (result === null) {
                    result = figure;
                } else if (result.getZOrder() < figure.getZOrder()) {
                    result = figure;
                }
            }
        };

        if (result !== null)
            return result;
    },

    updateContainer: function() {
        var children = this.getChildren();
        var len = children.getSize();
        var count = 0;
        var lastLength;

        for (var i = 0; i < len; i++) {
            var innerItem = children.get(i);
            
            if (innerItem.TYPE == "Container") {
                innerItem.locator.no = count;
                innerItem.locator.relocate(i, innerItem);
                count += innerItem.count;
                lastLength = innerItem.count;
            } else if (innerItem.TYPE == "Protein" || innerItem.TYPE == "R" || innerItem.TYPE == "A") {
                innerItem.locator.no = count;
                innerItem.locator.relocate(i, innerItem);
                count += 1;
                lastLength = 1;
            }
        }
        // console.log(innerItem.count);
        this.countLength = count - lastLength;
        this.setDimension(count * 100, 100);
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
            g.connect(source, target, "A");

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
            sourcePort.decorator = "A";
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
        if (canvas.getFigure(app.view.currentSelected).TYPE == "Protein" || canvas.getFigure(app.view.currentSelected).TYPE == "Container") {
            g.bind(canvas.getFigure(app.view.currentSelected), null, "R");
            var target = g.cache;
            g.connect(source, target, "R");
            // var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            // var targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomRightLocator(target));

            // // new graphiti.decoration.connection.ArrowDecorator()
            // var command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.TDecorator(), "Inhibit"); // 连接两点
            // app.view.getCommandStack().execute(command); // 添加到命令栈中
            // app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中

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
            sourcePort.decorator = "T";
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
            g.bind(source, target, "RORA");
        }
    }
});

g.Buttons.Unbind = graphiti.shape.icon.CoExpress.extend({
    NAME: "g.Buttons.Unbind",

    init: function(width, height) {
        this._super();
        this.from = null;
        this.to = null;
        this.TYPE = "Unbind";

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(30, 20);
        }
    },

    setAttr: function(from, to) {
        if (from !== null)
            this.from = from;

        if (to !== null)
            this.to = to;
    },

    onClick: function(x, y) {
        g.unbind(this.from, this.to);
        this.setCanvas(null);
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
        var container = null,
            outerContainer = null;


        if (source.getParent() && source.getParent().TYPE === "Container") {
            console.log("has container");
            container = source.getParent(); //内容器 
            outerContainer = container.getParent(); //外容器
        } else {
            console.log("new container");

            outerContainer = new g.Shapes.Container(); //外容器
            var command = new graphiti.command.CommandAdd(app.view, outerContainer, srcPosX, srcPosY);
            app.view.getCommandStack().execute(command);

            container = new g.Shapes.Container(); //内容器
            container.addItem(source);
            outerContainer.addItem(container);          
        }


        if (type == "Protein") {
            // 创建新的子容器
            var newContainer = new g.Shapes.Container();

            if (!target.getParent()) {
                newContainer.addItem(target);


                // 添加到外容器中
                outerContainer.addItem(newContainer);

                // 添加绑定符号
                var unbinder = new g.Buttons.Unbind();
                unbinder.setAttr(container, newContainer);
                outerContainer.addItem(unbinder);

                // 向蛋白绑定信息数组插入记录
                app.view.boundPairs.push({
                    from: source.getId(),
                    to: target.getId(),
                    type: "Bound",
                    inducer: "none"
                });

                // 更新外容器状态
                outerContainer.updateContainer();
                target.resetChildren();
            } else {
                console.log("容器绑定容器");
                var targetContainer = target.getParent();               // 获取target的innerContainer
                var targetOuterContainer = targetContainer.getParent(); // 获取target的outerContainer
                targetOuterContainer.removeItem(targetContainer);       // 从outerContainer里移除innerContainer
                outerContainer.addItem(targetContainer);                     // 将innerContainer加入到source的outterContainer中

                // 添加绑定符号
                var unbinder = new g.Buttons.Unbind();
                unbinder.setAttr(container, targetContainer);
                outerContainer.addItem(unbinder);

                targetOuterContainer.setCanvas(null);    // 删除target原来的outerContainer
            }

        } else if (type == "R") {
            var has = false;
            for (var i = 0; i < container.getChildren().size; i++) {
                var figure = container.getChildren().get(i);
                if (figure.TYPE == "R") {
                    has = true;
                    break;
                }
            }

            if (!has) {
                var r = new g.Shapes.R();
                container.addItem(r);
                // 添加绑定符号
                var unbinder = new g.Buttons.Unbind();
                unbinder.setAttr(source, r);
                container.addItem(unbinder);

                //   更新外容器大小
                outerContainer.updateContainer();
            }

        } else if (type == "A") {
            var has = false;
            for (var i = 0; i < container.getChildren().size; i++) {
                var figure = container.getChildren().get(i);
                if (figure.TYPE == "A") {
                    has = true;
                    break;
                }
            }

            if (!has) {
                var a = new g.Shapes.A();
                container.addItem(a);
                // 添加绑定符号
                var unbinder = new g.Buttons.Unbind();
                unbinder.setAttr(source, a);
                container.addItem(unbinder);

                //   更新外容器大小
                outerContainer.updateContainer();
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
    ex.unbind = function(from, to) {
        var oldOuterContainer;
        var sid, tid;
        var fromFlag = false, toFlag = false;

        console.log("From type: " + from.TYPE);
        console.log("To type: " + to.TYPE);

        if (from.TYPE == "Container") {
            console.log("From count: " + from.count);
            console.log("To count: " + to.count);

            var outerContainer = from.getParent();

            if (from.count == 1) {
                var figure = from.children.get(0).figure;      // from的子元件
                var xpos = figure.getAbsoluteX(),
                    ypos = figure.getAbsoluteY();

                copyFigure(figure);
                from.removeItem(figure);        // 从from中删除
                fromFlag = true;
            } else {
                // 检查前面的元素



                var outer = new g.Shapes.Container();
                var command = new graphiti.command.CommandAdd(app.view, outer, from.getAbsoluteX(), from.getAbsoluteY());
                app.view.getCommandStack().execute(command);

                outer.addItem(from);
                fromFlag = false;
            }

            if (to.count == 1) {
                var figure = to.children.get(0).figure;     // to的子元件
                var xpos = figure.getAbsoluteX(),
                    ypos = figure.getAbsoluteY();

                copyFigure(figure);
                to.removeItem(figure);
                toFlag = true;
            } else {
                // 检查后面的元素

                var outer = new g.Shapes.Container();
                var command = new graphiti.command.CommandAdd(app.view, outer, to.getAbsoluteX(), to.getAbsoluteY());
                app.view.getCommandStack().execute(command);

                outer.addItem(to);
                toFlag = false;
            }

            outerContainer.removeItem(from, fromFlag);
            outerContainer.removeItem(to, toFlag);
            app.view.removeFigure(outerContainer);

        } else if (from.TYPE == "Protein" || from.TYPE == "R" || from.TYPE == "A") {
            copyFigure(from);
            copyFigure(to);
            var outerContainer = from.getParent().getParent();

            outerContainer.removeItem(from.getParent(), true);
            // outerContainer.removeItem(to.getParent(), false);
            app.view.removeFigure(outerContainer);
        }

        // 清除绑定信息
        removeBoundInfo(sid, tid);

        // 拷贝元素
        function copyFigure(figure) {
            var id = figure.getId(),
                path = figure.path,
                name = figure.name,
                type = figure.TYPE;
            

            var newone = eval("new g.Shapes." + type + "()");
            newone.setId(id);
            newone.path = path;
            newone.name = name;

            // 设置连接
            if (figure.getConnections().getSize() !== 0) {
                var newPort = newone.createPort("hybrid", new graphiti.layout.locator.BottomLocator(newone));
                
                var figurePortId = figure.getPorts().get(0).getId();
                var figureConnectionPortId = figure.getConnections().get(0).getSource().getId();

                if (figurePortId == figureConnectionPortId) {
                    figure.getConnections().get(0).setSource(newPort);
                } else {
                    figure.getConnections().get(0).setTarget(newPort);
                }
            }

            app.view.removeFigure(figure);
            var command = new graphiti.command.CommandAdd(app.view, newone, figure.getAbsoluteX(), figure.getAbsoluteY());
            app.view.getCommandStack().execute(command);
        }

        // 删除特定的绑定信息
        function removeBoundInfo(sid, tid) {
            var idx = -1;
            for (var i = 0; i < app.view.boundPairs.length; i++) {
                var item = app.view.boundPairs[i];
                if (item.from == sid && item.to == tid) {
                    idx = i;
                    break;
                }
            }

            if (idx > -1) {
                app.view.boundPairs.splice(idx, 1);
            }
        }
    };
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

        if (ctx.config) {
            resetConfig();
            $("input[name=part_id]").attr({
                'value': ctx.config.part_id
            });
            $("input[name=part_name]").attr({
                'value': ctx.config.part_name
            });
            $("input[name=part_short_name]").attr({
                'value': ctx.config.part_short_name
            });
            $("input[name=part_short_desc]").attr({
                'value': ctx.config.part_short_desc
            });
            $("input[name=part_type]").attr({
                'value': ctx.config.part_type
            });
            $("input[name=part_status]").attr({
                'value': ctx.config.part_status
            });
            $("input[name=part_results]").attr({
                'value': ctx.config.part_results
            });
            $("input[name=part_nickname]").attr({
                'value': ctx.config.part_nickname
            });
            $("input[name=part_rating]").attr({
                'value': ctx.config.part_rating
            });
            $("input[name=part_author]").attr({
                'value': ctx.config.part_author
            });
            $("input[name=part_entered]").attr({
                'value': ctx.config.part_entered
            });
            $("input[name=part_quality]").attr({
                'value': ctx.config.best_quality
            });
        }

        if (ctx.path) {
            ws.send(JSON.stringify({
                'request': 'getXmlJson',
                'path': ctx.path
            }));
        }

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
                if (figure !== null && ctx.getId() !== figure.getId() && (figure.TYPE == "Protein") && figure.getConnections().getSize() == 0) {
                    figure.resetChildren();
                    figure.addFigure(figure.Activate, new graphiti.layout.locator.TopLeftLocator(figure));
                    figure.addFigure(figure.Inhibit, new graphiti.layout.locator.TopLocator(figure));
                    figure.addFigure(figure.CoExpress, new graphiti.layout.locator.TopRightLocator(figure));
                }
            };

            // show protein configuration
            $("#component-config").css({
                "display": "block"
            });
        } else if (ctx.TYPE == "Inducer") {
            var connections, connection;
            connections = canvas.getLines();

            for (var i = 0; i < connections.size; i++) {
                connection = connections.get(i);
                connection.addFigure(new g.Buttons.Activate(), new graphiti.layout.locator.ManhattanMidpointLocator(connection));
                connection.addFigure(new g.Buttons.Inhibit(), new graphiti.layout.locator.MidpointLocator(connection));
            }

            // show exogenous-factors configuration
            $("#exogenous-factors-config").css({
                "display": "block"
            });

        } else if (ctx.TYPE == "RORA") {
            for (var i = 0; i < canvas.collection.length; i++) {
                var figure = canvas.getFigure(canvas.collection[i]);
                if (figure !== null && ctx.getId() !== figure.getId() && figure.TYPE == "Protein") {
                    figure.resetChildren();
                    figure.addFigure(figure.Activate, new graphiti.layout.locator.TopLeftLocator(figure));
                    figure.addFigure(figure.Inhibit, new graphiti.layout.locator.TopLocator(figure));
                    figure.addFigure(figure.CoExpress, new graphiti.layout.locator.TopRightLocator(figure));
                }
            }
        }
    };
})(g);

(function(ex) {
    ex.closeToolbar = function(ctx) {
        // remove all children nodes
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
        }

        var connections, connection;
        connections = canvas.getLines();
        for (var i = 0; i < connections.size; i++) {
            connection = connections.get(i);
            g.closeToolbar(connection);
        }
    }
})(g);

(function(ex) {
    ex.connect = function(source, target, type) {
        var canvas = source.getCanvas();
        var sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
        var aTarget = null;
        for (var i = 0; i < target.getChildren().getSize(); i++) {
            if (target.getChildren().get(i).TYPE == type) {
                aTarget = target.getChildren().get(i);
                break;
            }
        }

        var targetPort = aTarget.createPort("hybrid", new graphiti.layout.locator.BottomLocator(aTarget));
        var command;
        if (type == "A") {
            command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.ArrowDecorator(), "Activate"); // 连接两点
        } else if (type == "R") {
            command = new graphiti.command.CommandConnect(canvas, targetPort, sourcePort, new graphiti.decoration.connection.TDecorator(), "Inhibit"); // 连接两点
        }
        app.view.getCommandStack().execute(command); // 添加到命令栈中
        app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中
    };
})(g);

// remove all lines that can be traversed along the path starting from "startNode"
(function(ex) {
    ex.removeLinks = function(startNode) {

    };
})(g);


// test script
(function(ex) {

    ex.test = function() {
        var c = new g.Shapes.Container();
        var figure = new g.Shapes.Protein();
        var figure2 = new g.Shapes.R();
        var figure3 = new g.Shapes.A();
        var figure4 = new g.Shapes.Protein();


        c.addItem(figure);
        c.addItem(figure2);
        c.addItem(figure3);
        c.addItem(figure4);

        c.removeItem(figure3);
        console.log(c);

        app.view.addFigure(c, 100, 100);
    }
})(g);