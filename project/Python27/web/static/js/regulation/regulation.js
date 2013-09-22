/**
 *
 *    File:         regulation.js
 *    Author:       Rathinho
 *    Description:  Main entrance of this application, including initialization of graphiti
 *                  application, configuration window and websocket.
 *
 **/

// document ready
$().ready(function() {
    document.ontouchmove = function(e) {
        e.preventDefault();
    };

    // toggle left-container
    $(".trigger-left").click(function() {
        var left = $("#left-container").css("left");

        if (parseInt(left) == 0) {
            $("#left-container").css({
                left: '-270px'
            });
        } else {
            $("#left-container").css({
                left: '0px'
            });
        }
    });

    // toggle right-container
    $(".trigger-right").click(function() {
        var right = $("#right-container").css("right");

        if (parseInt(right) == 0) {
            $("#right-container").css({
                right: '-270px'
            });
        } else {
            $("#right-container").css({
                right: '0px'
            });
        }
    });

    $("#content").click(function() {
        $("#left-container").css({
            left: '-270px'
        });

        $("#right-container").css({
            right: '-270px'
        });
    });

    $("#username").click(function() {
        window.location.pathname = "/profile";
    });

    $(".avatar-container").click(function() {
        window.location.pathname = "/profile";
    });

    // logout
    $("#logout").click(function() {
        ws.send(JSON.stringify({
            'request': 'loginOut'
        }));
    });

    // load file list
    $("#myfile").click(function() {
        // ws.send(JSON.stringify({
        //     'request': 'getUserFileList'
        // }));
        // window.location.pathname = "/file_manager";
        canvasToJSON();
    });

    // create new biobrick
    $("#create-part").click(function() {
        //var pngwriter = new graphiti.io.png.Writer();
		console.log('create');
        //var png = pngwriter.marshal(app.view);
		window.location.pathname = "/createnewpart";
        // $(".header img").attr('src', png);
    });

    // save file
    $("#save").click(function() {
        var fnInput = $("#fn-input");
        var filename = fnInput.attr('value');
        if (!filename) {
            fnInput.focus();
            fnInput.tooltip('show');

            // check whether filename input has changed 
            var tid = setInterval(function() {
                filename = fnInput.attr('value');
                if (filename) {
                    fnInput.tooltip('destroy');
                    clearInterval(tid);
                }
            }, 1000);
        } else {
            var saveData = JSON.stringify(canvasToSaveData());
            saveData.fileName = filename;
            saveData.fileType = 'rnw';

            ws.send(JSON.stringify({
                'request': 'saveUserData',
                'data': saveData,
                'fileName': filename,
                'fileType': 'regulation'
            }));

            $("#myModalInfo").html("File: " + filename + " is saved!");
            $("#save-trigger").click();
        }
    });
    
    // clear the canvas
    $("#clear").click(function() {
        app.view = new g.View("canvas");
    });

    // save configuration of protein 
    $("#save-protein").click(function(e) {
        e.preventDefault();
        var expressionVal = $("input[name=expressionVal]").val();
        console.log(expressionVal);
    });

    // save configuration of protein 
    $("#save-ef").click(function(e) {
        e.preventDefault();
        var ConcentrationVal = $("input[name=ConcentrationVal]").val();
        console.log(ConcentrationVal);
    });

    // save configuration of protein 
    $("#save-arrow").click(function(e) {
        e.preventDefault();
        var regStrength = $("input[name=regStrength]").val();
        console.log(regStrength);
    });



    // protein configuration
    $("#protein-config").ready(function() {
        E.config({
            baseUrl: 'static/js/regulation/slider/js/'
        });

        E.use('slider', function() {
            // Slider 1
            //   var slider1 = new E.ui.Slider('#slider-1', {
            //     min: 0,
            //     max: 10,
            //     value: 5,
            //     axis: 'x',
            //     size: '198px'
            //   });

            //   var demoText1 = E('#slider-text-1');
            //   slider1.on('slide', function(e) {
            //     demoText1.text(this.value / 10);
            //   });

            //   demoText1.on('click', function() {
            //     slider1.setValue(5);
            //   });

            //   // Slider 2
            //   var slider2 = new E.ui.Slider('#slider-2', {
            //     min: -1,
            //     max: 10,
            //     value: 0,
            //     axis: 'x',
            //     size: '198px'
            //   });

            //   var demoText2 = E('#slider-text-2');
            //   slider2.on('slide', function(e) {
            //     demoText2.text(this.value);
            //   });

            //   demoText2.on('click', function() {
            //     slider2.setValue(0);
            //   });

            //   // Slider 3
            //   var slider3 = new E.ui.Slider('#slider-3', {
            //     min: -10,
            //     max: 10,
            //     value: 0.5,
            //     axis: 'x',
            //     size: '198px'
            //   });

            //   var demoText3 = E('#slider-text-3');
            //   slider3.on('slide', function(e) {
            //     demoText3.text(this.value);
            //   });

            //   demoText3.on('click', function() {
            //     slider3.setValue(0.5);
            //   });

            //   // Slider 4
            //   var slider4 = new E.ui.Slider('#slider-4', {
            //     min: -10,
            //     max: 10,
            //     value: 0,
            //     axis: 'x',
            //     size: '198px'
            //   });

            //   var demoText4 = E('#slider-text-4');
            //   slider4.on('slide', function(e) {
            //     demoText4.text(this.value);
            //   });

            //   demoText4.on('click', function() {
            //     slider4.setValue(0);
            //   });
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


    /*
     * Websocket onmessage
     */
    if ("WebSocket" in window) {
        ws = new WebSocket("ws://" + document.domain + ":5000/ws");
        ws.onmessage = function(msg) {
            var message = JSON.parse(msg.data);
            if (message.request == "getDirList") { // get directory
                if (message.result.files == 'true') {

                } else {
                    if (proteinList.isInit) {
                        proteinList.parseSubTree(message.result);
                    } else {
						// console.log(message.result);
						var regS = new RegExp("/","g");
						for (var i=0;i<message.result.files.length;i++)
						{
							message.result.files[i]=message.result.files[i].replace(regS,"\\");
							// console.log(message.result.files[i]);
						}						 
						message.result.path=message.result.path.replace(regS,"\\");
                        proteinList.parseJson(message.result.files);
                    }
                }
            } else if (message.request == "getXmlJson") { // get configuration data of a single protein
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

            } else if (message.request == "getLoginedUserName") { // get username
                $("#user-view-left #username").text(message.result);
            } else if (message.request == "loginOut") { // get logout info
                window.location = "..";
            } else if (message.request == "getUserFileList") {
                
            } else if (message.request == "loadUserFile") {
                // console.log(message.result);
                repaintCanvas(message.result);
            } else if (message.request == 'indexSaveToGeneCircuit') {
                console.log(message.result);
            } else if (message.request == 'saveUserData') {
                console.log(message.result);
            }
        };
    }



    /*
     *  Websocket onopen
     */
    ws.onopen = function() {
        // get directory
        ws.send(JSON.stringify({
            'request': 'getDirList',
			'dir': 'web/biobrick/Protein coding sequences'
        }));

        // get username
        ws.send(JSON.stringify({
            'request': 'getLoginedUserName'
        }));

        (function loadFile() {
            var search = window.location.search;
            if (search) {
                search = search.substr(1, search.length);
                var type = search.split('&')[0].split('=')[1];
                var name = search.split('&')[1].split('=')[1];

                ws.send(JSON.stringify({
                    'request': 'loadUserFile',
                    'fileType': type,
                    'fileName': name
                }));
            } else {
                return;
            }
        })();
    }

    // Cleanly close websocket when unload window
    window.onbeforeunload = function() {
        var jsonData = JSON.stringify(canvasToJSON());
        // console.log(jsonData);
        ws.send(JSON.stringify({
            'request': 'indexSaveToGeneCircuit',
            'data': jsonData
        }));
        sessionStorage.regulation = jsonData;

        ws.onclose = function() {}; // disable onclose handler first
        ws.close();

        // return "";
    };



    // Create graphiti application
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



    var canvasToJSON = function() {
        var figures = app.view.figures.data,
            lines = app.view.lines.data;

        console.log(figures);
        console.log(lines);
        var figuresCount = app.view.collection.length,
            linesCount = app.view.connections.length;

            console.log(figuresCount);
            console.log(linesCount);

        var data = {
            part: [],
            link: []
        };


        // 添加part信息
        for (var i = 0; i < figuresCount; i++) {
            var figure = {};
            if (figures[i].TYPE == "Protein") {
                figure.id = figures[i].getId();
                figure.name = figures[i].name;
                figure.type = figures[i].TYPE;
                data.part.push(figure);

                // 添加R/A绑定信息
                if (figures[i].getParent() && figures[i].getParent().TYPE == "Container") {
                    for (var j = 0; j < figures[i].getParent().getChildren().getSize(); j++) {
                        var sibling = figures[i].getParent().getChildren().get(j);
                        if (sibling.TYPE == "R") {
                            var repressor = {};
                            repressor.id = sibling.getId();
                            repressor.name = "Repressor";
                            repressor.type = "Repressor";
                            data.part.push(repressor);

                            // 添加绑定链接信息
                            var line = {};
                            line.from = figures[i].getId();
                            line.to = repressor.id;
                            line.type = "Bound";
                            line.inducer = "none";
                            data.link.push(line);

                        } else if (sibling.TYPE == "A") {
                            var activator = {};
                            activator.id = sibling.getId();
                            activator.name = "Activator";
                            activator.type = "Activator";
                            data.part.push(activator);

                            // 添加绑定链接信息
                            var line = {};
                            line.from = figures[i].getId();
                            line.to = activator.id;
                            line.type = "Bound";
                            line.inducer = "none";
                            data.link.push(line);
                        }
                    };
                }
            }
        }


        // 添加link信息（除蛋白绑定外）
        for (var i = 0; i < linesCount; i++) {
            var line = {};

            // 
            if (lines[i].sourcePort.parent.TYPE !== "Inducer") {
                line.from = lines[i].sourcePort.parent.id;
                line.to = lines[i].targetPort.parent.id;
                line.type = lines[i].TYPE;
                line.inducer = "none";
                var lineChildren = lines[i].getChildren();
                for (var j = 0; j < lineChildren.size; j++) {
                    if (lineChildren.get(j).TYPE == "HybridPort") {
                        var lineType = lineChildren.get(j).decorator;

                        if (lineType == "T") {
                            line.inducer = "Negative";
                        } else if (lineType == "A") {
                            line.inducer = "Positive";
                        }
                        break;
                    }
                   
                };

                data.link.push(line);
            }
        };

        // 添加蛋白绑定信息
        var len = app.view.boundPairs.length;
        for (var i = 0; i < len ; i++) {
            data.link.push(app.view.boundPairs[i])
        };

        console.log(JSON.stringify(data));
        return data;
    };

    var canvasToSaveData = function() {
        var figures = app.view.figures.data,
            lines = app.view.lines.data;
        console.log(figures);
        console.log(lines);

        var figuresCount = app.view.collection.length,
            linesCount = app.view.connections.length;

        var data = {
            part: [],
            link: []
        };

        for (var i = 0; i < figuresCount; i++) {
            var figure = {};
            figure.id = i;
            figure.name = figures[i].id;
            figure.type = figures[i].TYPE;
            figure.xPos = figures[i].getX();
            figure.yPos = figures[i].getY();


            data.part.push(figure);
        }

        for (var i = 0; i < linesCount; i++) {
            var line = {};
            line.from = lines[i].sourcePort.parent.id;
            line.to = lines[i].targetPort.parent.id;
            line.type = lines[i].TYPE;
            line.inducer = "none";

            data.link.push(line);
        };
        
        return data;
    };

    var repaintCanvas = function(msg) {
        var model = eval('(' + msg + ')');
        console.log(model);

        for (var i = 0; i < model.part.length; i++) {
            repaintFigure(model.part[i]);
        };

        for (var i = 0; i < model.link.length; i++) {
            repaintLine(model.link[i]);
        };
        

        function repaintFigure(part) {
            var type = 'g.Shapes.' + part.type;

            var figure = eval("new " + type + "()");   // 实例化对象

            var command = new graphiti.command.CommandAdd(app.view, figure, part.xPos, part.yPos);
            app.view.getCommandStack().execute(command);    // 添加到命令栈中

            figure.setId(part.name);    // 设置id
            figure.label.setText(part.name.substr(0, part.name.length - 2));    // 设置label

            app.view.collection.push(part.name);    // 放入collection中
            app.view.collection.counter += 1;
        };

        function repaintLine(link) {
            var source = app.view.getFigure(link.from);
            var target = app.view.getFigure(link.to);

            var sourcePort, targetPort;

            if (source.TYPE == 'Protein' || source.TYPE == 'PandP') {
                sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            } else if (source.TYPE == 'PandA' || source.TYPE == 'PandR' || source.TYPE == 'PandRORA') {
                sourcePort = source.createPort("hybrid", new graphiti.layout.locator.BottomRightLocator(source));
            }

            if (target.TYPE == 'Protein' || target.TYPE == 'PandP') {
                targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomLocator(target));
            } else if (target.TYPE == 'PandA' || target.TYPE == 'PandR' || target.TYPE == 'PandRORA') {
                targetPort = target.createPort("hybrid", new graphiti.layout.locator.BottomRightLocator(target));
            }

            if (link.type == 'Activator') {
                var command = new graphiti.command.CommandConnect(app.view, targetPort, sourcePort, null, "Activate"); // 连接两点
                app.view.getCommandStack().execute(command); // 添加到命令栈中
                app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中
            } else if (link.type == 'Repressor') {
                var command = new graphiti.command.CommandConnect(app.view, targetPort, sourcePort, null, "Inhibit"); // 连接两点
                app.view.getCommandStack().execute(command); // 添加到命令栈中
                app.view.connections.push(command.connection.getId()); // 添加connection的id到connections集合中
            }
        };
    };
});
