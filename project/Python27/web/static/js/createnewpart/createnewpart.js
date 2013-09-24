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
				name='seq'+(userDefineSize+1);
				item={};
				item[name]=seq;
				parts.push(seq);
				biobrickDivAddBiobrick(name);
				userDefineSize++;
				document.getElementById('seqInput').value='';
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
	var left = $("#left-container").css("left");
        if (parseInt(left) == 0) {
            $("#left-container").css({
                left: '-270px'
            });
        } else {
        	$("#left-container").css('left','0px')	;
        }
}
function step0()
{
	var seq=document.getElementById('seqInput').value;
		if (seq.length!=0)		
		{
			var re=/^[actg]+$/gim;
			if(re.test(seq))
			{
				name='seq'+userDefineSize;
				item={};
				item[name]=seq;
				parts.push(seq);
				biobrickDivAddBiobrick(name);
				userDefineSize++;				
			}else{
				alert('You have illegal chars in the sequence!Or you can leave this text area blank.');
			}
		}
		step+=1;
		$("#optionDiv").hide();
		$("#textareaDiv").hide();
		$("#step2").show();
		return;
}
function getRBS()
{
	var data={};
	data['Name']=$('#RBSName').val();
	data['Number']=$('#RBSNumber').val();
	data['MPRBS']=$('#RBSMPRBS').val();
	data['RIPS']=$('#RBSRIPS').val();
	return data;	
}
function getActivator()
{
	var data={};
	data['Name']=$('#ActName').val();
	data['Number']=$('#ActNumber').val();
	data['HillCoeff1']=$('#HillCoeff1').val();
	data['K1']=$('#ActK1').val();
	data['K2']=$('#ActK2').val();
	return data;
}
function getTerminater()
{
	var data={};
	data['Name']=$('#terminatorName').val();
	data['Number']=$('#terminatorNumber').val();
	data['Efficiency']=$('#Efficiency').val();
	return data;
}
function acButtonOnclick(obj)
{
	if(step==0)
	{
		step0();
		var sendData=JSON.stringify(parts);
		ws.send(JSON.stringify({'request': 'getNewPartSequence','data':sendData}));
		return;
	}else if(step==1)
	{	
		ret=getBasicInfomation();
		if(ret==false)
			{return;}
		sessionStorage.basicInfomation=JSON.stringify(ret);
		var type=document.getElementById('typeSelect').value;
		if(type=='promoter')
		{
			$("#step3").css('display','inline-block');
			$('#PromoterForm').show();	
		}else if(type=='RBS')
		{
			$("#step3").css('display','inline-block');
			$('#RBSForm').show();			
		}
		else if(type=='Coding')
		{
			step+=2;	
			$("#step4").css('display','inline-block');
			return;
		}else if(type=='Terminator')
		{			
			$('#step3').css('display','inline-block');
			$('#terminatorForm').show();
		}else if(type=='Repressor')
		{
			$('#step3').css('display','inline-block');
			$('#ActRep').show();
				
		}else if(type=='Inducer'||type=='Corepressor')
		{
			$('#step3').css('display','inline-block');
			$('#Inducer').show();
		}else if (type=='plasmid_backbone')
		{
			$('#step3').css('display','inline-block');
			$('#plasmid_backboneForm').show();
		}else{
			alert('You have not select the type!');
			return;
		}
		step+=1;		
		return;
	}else if(step==2)
	{
		step+=1;	
		$("#step4").css('display','block');		
		var type=document.getElementById('typeSelect').value;
		if(type=='promoter')
		{
			sessionStorage.ModelingParameters=JSON.stringify(getPromoter());	
		}else if(type=='RBS')
		{					 
			sessionStorage.ModelingParameters=JSON.stringify(getRBS());				
		}
		else if(type=='Coding')
		{			
		}else if(type=='Terminator')
		{			
			sessionStorage.ModelingParameters=JSON.stringify(getTerminater());	
		}else if(type=='Repressor')
		{
			sessionStorage.ModelingParameters=JSON.stringify(getActivator());
		}else if(type=='Inducer'||type=='Corepressor')
		{
			sessionStorage.ModelingParameters=JSON.stringify(getInducer());
		}else if (type=='plasmid_backbone')
		{
			sessionStorage.ModelingParameters=JSON.stringify(getPlasmidBackbone());
		}else{
			alert('You have not select the type!');
			return;
		}
	}else if(step==3){
		var seqData=document.getElementById('finalSeq').value;
		var re=/^[actg]+$/gim;
		if(seqData.length!=0&&!re.test(seqData))
		{				
			alert('You have illegal chars in the sequence!Or you can leave this text area blank.');
			return;
		}
		var standard=document.getElementById('standardSelect').value;
		if(standard.length==0)
			standard="RFC 10";
		sendData=JSON.stringify({'seq':seqData,'standard':standard});
		sendYourdata();
	}
}
function sendYourdata()
{
	basic=eval('(' + sessionStorage.basicInfomation + ')');
	parameters=eval('(' + sessionStorage.ModelingParameters + ')');
	var type=basic.type;
// 	 Object {author: "asda"
// name: "asd"
// nickname: "sasdasd"
// shortDesp: "asdasd"
// shortname: "asdas"
// type: "Inducer"} 
// Object {Name: "asdas", Number: "sdfsdf", HillCoeff2: "0.125", K2: "0.125"} 
// 
	ws.send(JSON.stringify({'request': 'addAUserPart','part_id':parameters.Number,'part_name':basic.name,'part_short_name':basic.shortname,'part_short_desc':basic.shortDesp,'part_type':basic.type,'part_nickname':basic.nickname,'part_author':basic.author,'sequence':$('#finalSeq').val(),'Number':parameters.Number,'parts':JSON.stringify(parts)}));
		if(type=='promoter'){
			ws.send(JSON.stringify({'request':'addAPromoter','name':parameters.Name,'number':parameters.Number,'MPPromoter':parameters.MPPromoter,'LeakageRate':parameters.LeakageRate,'K1':parameters.K1,'Type':parameters.Type,'Repressor':parameters.Repressor,'Source':parameters.Source,'Activator':parameters.Activator,'PoPS':parameters.PoPS}));			
		}else if(type=='RBS'){					 
			ws.send(JSON.stringify({'request': 'addARBS','name':parameters.Name,'number':parameters.Number,'MPRBS':parameters.MPRBS,'RIPS':parameters.RIPS}));
		}
		else if(type=='Coding'){

		}else if(type=='Terminator'){		
			ws.send(JSON.stringify({'request': 'addATerminator','name':parameters.Name,'number':parameters.Number,'Efficiency':parameters.Efficiency}));
		}else if(type=='Repressor'){
			ws.send(JSON.stringify({'request': 'addARepressor','name':parameters.Name,'number':parameters.Number,'HillCoeff1':parameters.HillCoeff1,'K2':parameters.K2,'K1':parameters.K1}));
		}else if(type=='Inducer'||type=='Corepressor')
		{
			ws.send(JSON.stringify({'request': 'addAnInducer','name':parameters.Name,'number':parameters.Number,'HillCoeff2':parameters.HillCoeff2,'K2':parameters.K2}));
		}else if (type=='plasmid_backbone'){	
			ws.send(JSON.stringify({'request': 'addAplasmid_backbone','name':parameters.Name,'number':parameters.Number,'CopyNumber':parameters.CopyNumber}));
		}
}
function standardChange(obj)
{
	var sendData=JSON.stringify(parts);
	ws.send(JSON.stringify({'request': 'getNewPartSequence','data':sendData,'rule':$('#standardSelect').val()}));
}
function getPlasmidBackbone()
{
	var data={};
	data['Name']=$('#plasmid_backboneName').val();
	data['Number']=$('#plasmid_backboneNumber').val();
	data['CopyNumber']=$('#CopyNumber').val();
	return data;	
}
function getInducer()
{
	var data={};
	data['Name']=$('#InducerName').val();
	data['Number']=$('#InducerNumber').val();
	data['HillCoeff2']=$('#HillCoeff2').val();
	data['K2']=$('#InducerK2').val();
	return data;
}
function getBasicInfomation()
{
	var data={};
	if($('#typeSelect').val()===''||$('#shortDesp').val()===''||$('#name').val()===''||$('#nickname').val()===''||$('#ShortName').val()===''||$('#ShortName').val()===''||$('#Author').val()==='')	
	{
		alert ('Please fill in all the blanks!');
		return false;
	}
	data['type']=$('#typeSelect').val();
	data['shortDesp']=$('#shortDesp').val();
	data['name']=$('#name').val();
	data['nickname']=$('#nickname').val();
	data['shortname']=$('#ShortName').val();
	data['author']=$('#Author').val();
	return data;
}
function getPromoter()
{
	var data={};
	data['Name']=$('#PromoterName').val();
	data['Number']=$('#PromoterNumber').val();
	data['PoPS']=$('#PromoterPoPS').val();
	data['MPPromoter']=$('#PromoterMPPromoter').val();
	data['LeakageRate']=$('#PromoterLeakageRate').val();
	data['Type']=$('#PromoterType').val();
	data['K1']=$('#PromoterK1').val();
	data['Activator']=$('#PromoterActivator').val();
	data['Repressor']=$('#PromoterRepressor').val();
	data['Source']=$('#PromoterSource').val();
	return data;
}
function biobrickDivAddBiobrick(name)
{
	if(document.getElementById('buttonAccept').style.display=='none')
		document.getElementById('buttonAccept').style.display='block';
	var biobrick=document.createElement("div");
	biobrick.style.width=name.length*10+'px';
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
        /*$("#left-container").css({
            left: '-270px'
        });*/

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
                
            } else if (message.request == 'getNewPartSequence')
            {
            	$('#finalSeq').text(message.result);
            } else if (message.request == 'addAUserPart')
            {
            	if(message.result=='add user part success!')
					alert('add user part to database success!');
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