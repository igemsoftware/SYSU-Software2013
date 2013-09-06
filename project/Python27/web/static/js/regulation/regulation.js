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


    // logout
    $("#logout").click(function() {
        ws.send(JSON.stringify({
            'request': 'loginOut'
        }));
    });

    // load file list
    $("#myfile").click(function() {
        ws.send(JSON.stringify({
            'request': 'getUserFileList'
        }));
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

            canvasToJSON();
            // ws.send({
            //   "request" : "saveUserData",
            //   "data" : filename
            // });


            // $("#myModalInfo").html("File: " + filename + " is saved!");
            // $("#save-trigger").click();
        }
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
                console.log(message.result);
                $("#filelist").html("");
                for (var i = 0; i < message.result.length; i++) {
                    $("#filelist").append("<a href=\"javascript:void(0);\" id=\"" + message.result[i].fileName + "\">" + message.result[i].fileName + "</a><br/>");
                };

                $("#filelist > a").live("click", function() {
                    ws.send(JSON.stringify({
                        "request": "loadUserFile",
                        "fileName": "default1",
                        "fileType": "data"
                    }));
                });
            } else if (message.request == "loadUserFile") {
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
            'dir': 'web\\biobrick\\Protein coding sequences'
        }));

        // get username
        ws.send(JSON.stringify({
            'request': 'getLoginedUserName'
        }));
    }

    // Cleanly close websocket when unload window
    window.onbeforeunload = function() {
        ws.onclose = function() {}; // disable onclose handler first
        ws.close();
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
        // console.log(figures);
        // console.log(lines);

        var figuresCount = app.view.collection.length,
            linesCount = app.view.connections.length;

        var data = {
            part: [],
            links: []
        };

        for (var i = 0; i < figuresCount; i++) {
            var figure = {};
            figure.id = i;
            figure.name = figures[i].id;
            figure.type = figures[i].TYPE;

            data.part.push(figure);
        }

        for (var i = 0; i < linesCount; i++) {
            var line = {};
            line.from = lines[i].sourcePort.parent.id;
            line.to = lines[i].targetPort.parent.id;
            line.type = "default";
            line.inducer = "default";

            data.links.push(line);
        };
        console.log(JSON.stringify(data));
    }
});