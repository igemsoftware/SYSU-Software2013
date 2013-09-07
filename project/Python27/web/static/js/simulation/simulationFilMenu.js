  /**
 *
 *    File:         simulationFileMenu.js
 *    Author:       Rathinho,Jiexin Guo
 *    Description:  right file config containner logic and websocket.
 *
 **/
 
 //this function can get the param in a url
function    getArgs()   
{
	var    args=new    Object();   
	var    query=location.search.substring(1);//获取查询串   
	var    pairs=query.split(",");//在逗号处断开   
	for(var    i=0;i<pairs.length;i++)   
	{   
		var    pos=pairs[i].indexOf('=');//查找name=value   
		if(pos==-1)    
  			continue;//如果没有找到就跳过   
		var    argname=pairs[i].substring(0,pos);//提取name   
		var    value=pairs[i].substring(pos+1);//提取value   
		args[argname]=unescape(value);//存为属性   
	}   
	return    args;//返回对象   
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
				filetype='simulationSave';
			}else if(window.location.pathname==='/plasmid')
			{
				filetype='plasmidSave';
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