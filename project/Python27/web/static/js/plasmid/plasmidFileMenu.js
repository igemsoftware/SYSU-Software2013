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
        window.location.pathname = "/file_manager";
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
                'fileType': 'rnw'
            }));

            //  var pngwriter = new graphiti.io.png.Writer();
            // var png = pngwriter.marshal(app.view);
            // $(".header img").attr('src', png);
            // ws.send({
            //   "request" : "saveUserData",
            //   "data" : filename
            // });


            // $("#myModalInfo").html("File: " + filename + " is saved!");
            // $("#save-trigger").click();
        }
    });

    $("#clear").click(function() {
        app.view = new g.View("canvas");
    });    
    // Cleanly close websocket when unload window
    window.onbeforeunload = function() {        
    };

});