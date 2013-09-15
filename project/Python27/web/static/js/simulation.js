var data =  [];

proteinNames=[];
$(document).ready(function () {
  if ("WebSocket" in window) {
    ws = new WebSocket("ws://" + document.domain + ":5000/ws");
    ws.onmessage = function (msg) {
      var message = JSON.parse(msg.data);
      if (message.request == "Simulate") {
        console.log(message.result);
        raw_data = message.result.data;
        console.log(raw_data);
        proteinNames = Object.keys(message.result.data);
        data = turnRawDatatoData(raw_data);
        var canvasWidth = document.getElementById('canvasDiv').clientWidth;
        var canvasHeight = document.getElementById('canvasDiv').clientHeight;
        var time = message.result.time;
        var dt = message.result.dt;
        run(data,canvasWidth, canvasHeight, time, dt);
        for(var i=0;i<data.length;i++)
        {
          var w=document.getElementById('Curve').clientWidth/3/6;
          //var h=document.getElementById('Curve').clientHeight/(data.length/3);
		  h=100/(data.length/3+1);
          document.getElementById('Curve').appendChild(createAnInputCheckBox(i,w,h,proteinNames[i]));
          //document.getElementById('Curve').appendChild(document.createTextNode(proteinNames[i]));
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
      else if (message.request == "getUserFileList") {
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
      }
      else if (message.request == "loadUserFile") {
        console.log(message.result);
      }
      else if (message.request == 'saveUserData') {
        console.log(message.result);
      }
    };
  };

  // Bind send button to websocket
  ws.onopen = function() {
	  ws.send(JSON.stringify({'request': 'getLoginedUserName'}));
    isStochastic = false;
    gene_circuit = sessionStorage.gene_circuit;
    //gene_circuit = raw;
    corepind = {};
    ws.send(JSON.stringify({'request'     : 'Simulate',
                            'isStochastic': isStochastic,
                            'gene_circuit': gene_circuit,
                            'corepind'    : corepind
    }));
  };

  // Cleanly close websocket when unload window
  window.onbeforeunload = function() {
    ws.onclose = function () {}; // disable onclose handler first
    ws.close();
  };


});
var size=0;
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
		run(newdata,document.getElementById('canvasDiv').clientWidth-15,document.getElementById('canvasDiv').clientHeight-15);
		chart.resize(document.getElementById('canvasDiv').clientWidth,document.getElementById('canvasDiv').clientHeight);
	}
	div.appendChild(o);
	div.appendChild(document.createTextNode(proteinName));
	return div;
}
function turnRawDatatoData(raw)
{
  var ret = [];
  var LineNum = Object.keys(raw).length;
  var iter = 0;
  var colors = ["#44f4f4", "#80bd91", "#8fd8ef"];
  var color_cnt = colors.length;
  for (var key in raw) {
    ret[iter] = {};
    ret[iter]["color"] = colors[iter % color_cnt];
    ret[iter]["value"] = raw[key];
    ret[iter]["name"]  = key;
    iter++;
  }
  return ret;
}

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
function run(data, width1, height1, time, dt){
  //ws.send(JSON.stringify({'request': 'getSimulationData'}));
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
	/*coordinate:{
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
	},*/
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
          console.log((e.x-r.x)/(r.options.width) * 6000);
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
