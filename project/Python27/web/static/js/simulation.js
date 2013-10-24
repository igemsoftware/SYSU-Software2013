var data =  [];
var time, dt;

var proteinNames=[];
var inducerList=[[2,'inducer1'],[7,'inducer2']];
var corepind ={}; //{5: {"time": 20},7: {"time": 60}}
function stateOnChange(obj)
{
	//ws.send(JSON.stringify({'request': 'getLoginedUserName'}));
    isStochastic = $('#stochastic')[0].checked;
    isDelay      = $('#delay')[0].checked;
    console.log(isStochastic);
    gene_circuit = sessionStorage.gene_circuit;
    ws.send(JSON.stringify({'request'     : 'Simulate',
                            'isStochastic': isStochastic,
                            'isDelay'     : isDelay,
                            'gene_circuit': gene_circuit,
                            'corepind'    : corepind
    }));
	$('#mymodal').modal({keyboard:false});
}
$(document).ready(function () {
  if ("WebSocket" in window) {
    ws = new WebSocket("ws://" + document.domain + ":5000/ws");
    ws.onmessage = function (msg) {
      var message = JSON.parse(msg.data);
      if (message.request == "Simulate") { 
	  	$('#mymodal').modal('hide');       
        raw_data = message.result.data;
        proteinNames = Object.keys(message.result.data);
        data = turnRawDatatoData(raw_data);
        time = message.result.time;
        dt = message.result.dt;
        var width1 = document.getElementById('canvasDiv').clientWidth -parseInt(document.getElementById('canvasDiv').style.left);
        var height1 = document.getElementById('canvasDiv').clientHeight -parseInt(document.getElementById('canvasDiv').style.top);		
        run(data,'canvasDiv', width1, height1, time, dt);
		$("#Inducer").empty();
		$("#Curve").empty();
		inducerList=getinducerList(sessionStorage.gene_circuit);		
        for(var i=0;i<data.length;i++)
        {
          var w=document.getElementById('Curve').clientWidth/3/6;
		      h=100/(data.length/3+1);
          document.getElementById('Curve').appendChild(createAnInputCheckBox(i,w,h,proteinNames[i]));          
        }		
		    for(var i=0;i<inducerList.length;i++)
        {			
          var w=document.getElementById('Inducer').clientWidth/3/6;
		      h=100/(data.length/3+1);		  
          document.getElementById('Inducer').appendChild(createAnInputCheckBoxForInducer(i,w,h,inducerList[i][0],inducerList[i][1]));   
        }
      }
      else if (message.request == "getDirList") { // get directory
        if (message.result.files == 'true') {

        } else {
          if (proteinList.isInit) {
            proteinList.parseSubTree(message.result);
          } else {
            proteinList.parseJson(message.result.files);
          }
        }
      }
      else if (message.request == "getLoginedUserName") { // get username
        $("#user-view-left #username").text(message.result);
      }
      else if (message.request == "loginOut") { // get logout info
        window.location = "..";
      }       
    };
  };

  // Bind send button to websocket
  ws.onopen = function() {
	ws.send(JSON.stringify({'request': 'getLoginedUserName'}));
  isStochastic = $('#stochastic')[0].checked;
  isDelay = $('#delay')[0].checked;

    gene_circuit = sessionStorage.gene_circuit;
    corepind = {};
    ws.send(JSON.stringify({'request'     : 'Simulate',
                            'isStochastic': isStochastic,
                            'isDelay'     : isDelay,
                            'gene_circuit': gene_circuit,
                            'corepind'    : corepind
    }));
	$('#mymodal').modal({keyboard:false});
  };

  // Cleanly close websocket when unload window
  window.onbeforeunload = function() {
    ws.onclose = function () {}; // disable onclose handler first
    ws.close();
  };
});
var size=0;
function getinducerList(circuit)
{
	var ret=[]	
    var obj = eval('(' + circuit + ')'); 
	//console.log(obj);
	for (x in obj['groups'])
	{
		
		if(obj.groups[x].corep_ind_type==="Inducer")
		{
			ret.push([x,obj.groups[x].corep_ind]);
		}
	}
	obj=null;
	return ret;
}
function createAnInputCheckBoxForInducer(index,width,height,inducerIndex,inducerName){
	var div=document.createElement("div");
	var o=document.createElement("input");
    o.type="radio";
    o.name="inducerRadio";
	o.id=inducerIndex;
	o.value=inducerName;
	div.style.width='30%';
	div.style.height=height+'%';
	div.style.display='inline-block';
	o.onclick = function() {
		console.log($('#canvasDiv :eq(0)').css('cursor'));
		$('#canvasDiv :eq(0)').css('cursor','hand');
	}
	div.appendChild(o);
	div.appendChild(document.createTextNode(inducerName));
	return div;
}
/**
 * [createAnInputCheckBox description]
 * @param  {[type]} index       [description]
 * @param  {[type]} width       [description]
 * @param  {[type]} height      [description]
 * @param  {[type]} proteinName [description]
 * @return {[type]}             [description]
 */
function createAnInputCheckBox(index,width,height,proteinName){
	var div=document.createElement("div");
	var o=document.createElement("input");
    o.type="checkbox";
    o.id=proteinName;
    o.name="aa";
	o.value=proteinName;
	div.style.width='30%';
	div.style.height=height+'%';
	div.style.display='inline-block';
	o.checked=true;
	o.onclick = function() {
		var newdata=new Array();
		for(var i=0;i<data.length;i++)
		{
			var oi=document.getElementById(proteinNames[i]);
			if(oi.checked){
				newdata.push(data[i]);
			}
		}
    var width1 = document.getElementById('canvasDiv').clientWidth;
    var height1 = document.getElementById('canvasDiv').clientHeight;
		run(newdata, 'canvasDiv', width1, height1, time, dt);
		chart.resize(document.getElementById('canvasDiv').clientWidth,document.getElementById('canvasDiv').clientHeight);
	}
	div.appendChild(o);
	div.appendChild(document.createTextNode(proteinName));
	return div;
}

/*
function getLabel(time, dt) {
  var labels = [];
  for (var i = 0; i < time; i += dt * 3)
    labels.push((Math.round(i*10)/10.0).toFixed(1));
  return labels;
}

var chart=null;
function saveGraph()
{
	var _canvas=document.getElementById(chart.canvasid);	
	Canvas2Image.AsPNG(_canvas); 
}
function run(data, canvasId, time, dt){
  //ws.send(JSON.stringify({'request': 'getSimulationData'}));
    var width1 = document.getElementById(canvasId).clientWidth - 15;
    var height1 = document.getElementById(canvasId).clientHeight - 15;
    labels = getLabel(time, dt);
    chart= new iChart.LineBasic2D({
    animation:true,
    render : 'canvasDiv',//图表渲染的HTML DOM的id
    data: data,//图表的数据源
    labels: labels,
    offsetx:10,//-60,
    shadow:true,
    background_color:'#f4f4f4',
    separate_angle:10,//分离角度
  -------
	coordinate:{
		scale:[{
			position:'left',	
			scale_space:5,
			scale_enable:false,//禁用小横线			

			},{
			position:'bottom',	
			start_scale:1,
			end_scale:12,	
			fontunit:'0.1',
			scale_space:10,		
			labels:labels
		}]
	},
  -------
    tip:{
      enable:true,
      showType:'fixed',
      animation:true,
      //fade_duration:700,
      listeners:{
        parseText:function(tip,name,value,text){
          var str = name;
          return str;
        }
      }
    },
    sub_option:{
      label: true,
      color_factor: 0.3,
      intersection: false,
      smooth: true,
      listeners:{
        click:function(r,e,m){
			// if($('#timedelay').attr('checked')==true)
			// {
			// 	if($('#stochastic').attr("checked")==true)
			// 	{
			// 		isStochastic = true;
			// 	}else{
			// 		isStochastic = false;
			// 	}
			// 	gene_circuit = sessionStorage.gene_circuit;        
			// 	$("#Curve").empty();
			// 	$("#Inducer").empty();
			// 	ws.send(JSON.stringify({'request'     : 'Simulate',
			// 							'isStochastic': isStochastic,
			// 							'gene_circuit': gene_circuit,
			// 							'corepind'    : corepind
			// 	}));
			// }
			if($("input[name='inducerRadio']:checked").val()!==undefined)
			{
				corepind[$("input[name='inducerRadio']:checked").attr('id')]={"time": (e.x-r.x)/(r.options.width) * 6000};
				if($('#stochastic').attr("checked")==true)
				{
					isStochastic = true;
				}else{
					isStochastic = false;
				}
				gene_circuit = sessionStorage.gene_circuit;
				$("#Curve").empty();
				$("#Inducer").empty();
                console.log(corepind);
				ws.send(JSON.stringify({'request'     : 'Simulate',
										'isStochastic': isStochastic,
										'gene_circuit': gene_circuit,
										'corepind'    : corepind
				}));
			}          
        }
      }
    },
    showpercent:true,
    decimalsnum:2,
    width : width1,
    height : height1,
    radius:140
  });
  chart.draw();
  document.body.style.zoom=1.5;
  chart.draw();
  document.body.style.zoom=1;
};
*/
