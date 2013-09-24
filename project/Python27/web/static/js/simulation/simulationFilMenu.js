  /**
 *
 *    File:         simulationFileMenu.js
 *    Author:       Rathinho,Jiexin Guo
 *    Description:  right file config containner logic and websocket.
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
        } else {//save the data into the database
			var saveData = '';
            if(window.location.pathname==='/plasmid')
			{
				filetype='plasmid';
				saveData=sessionStorage.genecircuitSave;
			}            
            ws.send(JSON.stringify({
                'request': 'saveUserData',
                'data': JSON.stringify(saveData),
                'fileName': filename,
                'fileType': filetype
            }));           
        }
    });    	
    // Cleanly close websocket when unload window
    window.onbeforeunload = function() {  
		      
    };
});
function getPlasmidSaveData(){
	return JSON.stringify(raw_data);
}
function getSimulationSaveData(){
	var temp=JSON.stringify({'data':data,'proteinName':proteinNames});
	console.log(temp);
	return JSON.stringify({'data':temp});
}