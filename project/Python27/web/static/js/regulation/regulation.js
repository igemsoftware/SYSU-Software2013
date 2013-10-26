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


    // click header 
    $(".header").click(function() {
        // console.log(app.view.figures);
        
        // window.sessionStorage.setItem("regulationWork", JSON.stringify(canvasToSaveData()));
        // console.log(window.sessionStorage.getItem("regulationWork"));
    });

    // toggle left-container
    $(".trigger-left").click(function() {
        var left = $("#left-container").css("left");

        $("#right-container").css("right", "-270px");

        if (parseInt(left) == 0) {
            $("#left-container").css({
                left: '-270px'
            });

            $("#canvas").css({
                left: '0px'
            });
        } else {
            $("#left-container").css({
                left: '0px'
            });

            $("#canvas").css({
                left: '270px'
            });
        }
    });

    // toggle right-container
    $(".trigger-right").click(function() {
        var right = $("#right-container").css("right");

        $("#left-container").css("left", "-270px");

        if (parseInt(right) == 0) {
            $("#right-container").css({
                right: '-270px'
            });

            $("#canvas").css({
                left: '0px'
            });
        } else {
            $("#right-container").css({
                right: '0px'
            });

            $("#canvas").css({
                left: '-270px'
            });
        }
    });

    $("#content").click(function() {
        $("#left-container").css({
            left: '-270px'
        });

        $("#canvas").css({
            left: '0px'
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
        canvasToJSON();
		window.location.pathname = "/file_manager";
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
        // 清除原来的内容
        app = null;
        $("#canvas").remove();

        // 新建画布
        $("#canvas-mask").append("<div id=\"canvas\"></div>");
        app = new g.Application();
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
                resetConfig();
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
            } else if (message.request == 'getuserPartByType') {
                // console.log(message.result);
                codingList.parseJson(message.result);
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

        // get coding file
        ws.send(JSON.stringify({
            'request': 'getuserPartByType',
            'type': 'Coding'
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
    };

    // Cleanly close websocket when unload window
    window.onbeforeunload = function() {
        var jsonData = JSON.stringify(canvasToJSON());
        ws.send(JSON.stringify({
            'request': 'indexSaveToGeneCircuit',
            'data': jsonData
        }));
        sessionStorage.regulation = jsonData;

        window.sessionStorage.setItem("regulationWork", JSON.stringify(canvasToSaveData()));

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



    if (window.sessionStorage) {
        regulationCache = window.sessionStorage;

        var regulationWork = regulationCache.getItem("regulationWork");
        if (regulationWork) {
            repaintCanvas(regulationWork);
        }

        $("#right-container").css("right", "-270px");
    } else {
        alert("Your browser does not support sessionStorage!");
    }

    function canvasToJSON() {
        var figures = app.view.figures.data,
            lines = app.view.lines.data;

        // console.log(figures);
        // console.log(lines);
        var figuresCount = app.view.collection.length,
            linesCount = app.view.connections.length;

        console.log("元件数:" + figuresCount + "  连接数:" + linesCount);

        var data = {
            part: [],
            link: []
        };


        // 添加part信息
        for (var i = 0; i < figuresCount; i++) {
            var figure = {};
            if (figures[i].TYPE == "Protein" || figures[i].TYPE == "R" || figures[i].TYPE == "A") {
                figure.id = figures[i].getId();
                figure.name = figures[i].name;                

                if (figures[i].TYPE == "A")
                    figure.type = "Activator";
                else if (figures[i].TYPE == "R")
                    figure.type = "Repressor";
                else
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
            data.link.push(app.view.boundPairs[i]);
        };

        console.log(JSON.stringify(data));
        return data;
    };

    function canvasToSaveData() {
        var figures = app.view.figures.data,
            lines = app.view.lines.data;

        var figuresCount = app.view.collection.length,
            linesCount = app.view.connections.length;

        var data = {
            part: [],
            link: []
        };


        // 添加part信息
        for (var i = 0; i < figuresCount; i++) {
            var figure = {};
            if (figures[i].TYPE == "Protein" || figures[i].TYPE == "R" || figures[i].TYPE == "A") {
                figure.id = figures[i].getId();
                figure.name = figures[i].name;
                figure.xPos = figures[i].getAbsoluteX();
                figure.yPos = figures[i].getAbsoluteY();

                if (figures[i].TYPE == "A")
                    figure.type = "Activator";
                else if (figures[i].TYPE == "R")
                    figure.type = "Repressor";
                else {
                    figure.config = figures[i].config;
                    figure.path = figures[i].path;
                    figure.type = figures[i].TYPE;
                }

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
                            repressor.xPos = sibling.getAbsoluteX();
                            repressor.yPos = sibling.getAbsoluteY();
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
                            activator.xPos = sibling.getAbsoluteX();
                            activator.yPos = sibling.getAbsoluteY();
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
            data.link.push(app.view.boundPairs[i]);
        };

        return data;
    };

    function repaintCanvas(msg) {
        var model = eval('(' + msg + ')');
        console.log(model);

        for (var i = 0; i < model.part.length; i++) {
            repaintFigure(model.part[i]);
        };

        for (var i = 0; i < model.link.length; i++) {
            repaintLine(model.link[i]);
        };
        

        function repaintFigure(part) {
            if (part.type == "Protein") {
                var type = 'g.Shapes.' + part.type;

                var figure = eval("new " + type + "()");   // 实例化对象

                var command = new graphiti.command.CommandAdd(app.view, figure, part.xPos, part.yPos);
                app.view.getCommandStack().execute(command);    // 添加到命令栈中

                console.log(part.xPos + "  " + part.yPos);

                app.view.collection.remove(figure.getId());

                figure.setId(part.id);    // 设置id
                figure.TYPE = part.type;

                app.view.collection.push(figure.getId());
            }
        };

        function repaintLine(link) {
            
            if (link.type === "Bound") {
                /*
                 *  Get source and target item of link.
                 */
                var source = app.view.getFigure(link.from);
                var targetArr = getTarget(link.to);

                for (var idx = 0; idx < targetArr.length; idx++) {
                    var target = app.view.getFigure(targetArr[idx].id);

                    app.view.currentSelected = link.from;
                    source.onClick();

                    if (targetArr[idx].type == "Activator") {
                        target.Activate.onClick();
                    } else if (targetArr[idx].type == "Repressor") {
                        target.Inhibit.onClick();
                    }
                };

                if (targetArr.length == 0) {
                    var target = app.view.getFigure(link.to);

                    source.onClick();

                    target.CoExpress.onClick();
                }
            }

            function getTarget(boundId) {
                var retArr = [];

                for (var j = 0; j < model.link.length; j++) {
                    if (model.link[j].from == boundId) {
                        retArr.push({id: model.link[j].to, type: model.link[j].type});
                    }
                };

                return retArr;
            }
        };
    };
});
