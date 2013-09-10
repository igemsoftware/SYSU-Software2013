  /**
 *
 *    File:         simulationFileMenu.js
 *    Author:       Rathinho,Jiexin Guo
 *    Description:  right file config containner logic and websocket.
 *
 **/
 
 //this function can get if the url has args
function isUrlArgsExist()
{
	return (location.search.substring(1).length!=0);
}
//return the param of the url by 'paras' variable
function request(paras){ 
	var url = location.href;  
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
	var paraObj = {}  
	for (i=0; j=paraString[i]; i++){  
		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
	}  
	var returnValue = paraObj[paras.toLowerCase()];  
	if(typeof(returnValue)=="undefined"){  
		return "";  
	}else{  
		return returnValue;  
	}  
}
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
            if(window.location.pathname==='/simulation')
			{
				filetype='simulation';
				saveData=getSimulationSaveData();
			}else if(window.location.pathname==='/plasmid')
			{
				filetype='plasmid';
				saveData=getPlasmidSaveData();
			}            
            ws.send(JSON.stringify({
                'request': 'saveUserData',
                'data': saveData,
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
function loadPlasmidSaveData(){
}
function loadSimulationSaveData()
{
}