/**
 *
 *    File:         createnewpart.js
 *    Author:       Jiexin Guo
 *    Description:  
 *
 **/
var parts=[];
var userDefineSize=0;
var step=0;
var partInformation={};
function myInit()
{	
	
}
function addSeqPartButtonOnclick(obj)
{
	var textareaDiv=document.getElementById('textareaDiv');
	if(textareaDiv.style.display=='none')
	{
		document.getElementById('optionDiv').style.width="40%";
		document.getElementById('optionDiv').style.height="100px";
		document.getElementById('optionDiv').style.height="100px";
		textareaDiv.style.display='block';
	}else{//when the seqtextArea is shown
		var seq=document.getElementById('seqInput').value;
		if (seq.length!=0)		
		{
			var re=/^[actg]+$/gim;
			if(re.test(seq))
			{
				name='seq'+userDefineSize;
				item={};
				item[name]=seq;
				parts.push(item);
				biobrickDivAddBiobrick(name);
				userDefineSize++;
				if(document.getElementById('buttonAccept').style.display=='none')
					document.getElementById('buttonAccept').style.display='block';
			}else{
				alert('you have illegal chars in the sequence!');
			}
		}else{
			alert('Cannot add an empty sequence!');
		}
	}
}
function addPartFromRegButtonOnclick(obj)
{
	$(".trigger-left").click();
}
function acButtonOnclick(obj)
{
	if(step==0)
	{
		step+=1;
		$("#optionDiv").hide();
		$("#textareaDiv").hide();
		$("#step2").show();
		return;
	}else if(step==1)
	{
		step+=1;		
		var type=document.getElementById('typeSelect').value;
		if(type=='Coding')
		{
			//$("#step3").show();
		}else if(type=='RBS')
		{
			$("#step3").css('display','inline-block');
			//$("#step3").show();
			$('#RBSForm').show();			
		}else if(type=='Terminator')
		{
			$('#terminatorForm').show();
		}
		return;
	}else if(step==2)
	{
		step+=1;	
		$("#step4").show();
	}
}
function biobrickDivAddBiobrick(name)
{
	if(document.getElementById('buttonAccept').style.display=='none')
		document.getElementById('buttonAccept').style.display='block';
	var biobrick=document.createElement("div");
	biobrick.style.width=name.length*9+'px';
	biobrick.style.height="30px";
	biobrick.style.backgroundColor="#4388CC";
	biobrick.onclick=function()
	{
		console.log(this);
	}
	biobrick.style.cssFloat="left";
	biobrick.style.marginLeft="15px";
	biobrick.style.marginTop="10px";	
	var span=document.createElement("span");
	span.innerHTML=name;
	span.style.color="black";
	span.style.margin="5px";
	biobrick.appendChild(span);
	biobrickDiv.appendChild(biobrick);
	//parts.push(name);
}
// document ready
$().ready(function() {	
	myInit();	
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
        window.location.pathname = "/file_manager";
    });

    // create new biobrick
    $("#create-part").click(function() {
        window.location.pathname = "/createnewpart";
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
						console.log(message.result);
						var regS = new RegExp("/","g");
						for (var i=0;i<message.result.files.length;i++)
						{							
							message.result.files[i]=message.result.files[i].replace(regS,"\\");
							console.log(message.result.files[i]);
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
                  //repaintCanvas(message.result);
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
    /*window.onbeforeunload = function() {      
        ws.onclose = function() {}; // disable onclose handler first
        ws.close();

        return "";
    };*/
	
});