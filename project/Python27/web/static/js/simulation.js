var data =  [];
var raw =
{"proteins": {1: {"RiPS": 11.49, "name": "BBa_C0060", "before_regulated": 28023.305700000004, "concen": 0.1, "grp_id": 4, "pos": 2, "PoPS": 33.410000000000004, "repress_rate": 0.0, "K1": null, "induce_rate": 0.0, "copy": 73.0, "display": "True"}, 2: {"RiPS": 11.49, "name": "BBa_C0060", "before_regulated": 28023.305700000004, "concen": 0.1, "grp_id": 4, "pos": 4, "PoPS": 33.410000000000004, "repress_rate": 0.0, "K1": null, "induce_rate": 0.0, "copy": 73.0, "display": "True"}, 3: {"RiPS": 11.49, "name": "BBa_K518003", "before_regulated": 28023.305700000004, "concen": 0.1, "grp_id": 4, "pos": 6, "PoPS": 33.410000000000004, "repress_rate": 0.0, "K1": null, "induce_rate": 0.0, "copy": 73.0, "display": "False"}, 4: {"RiPS": 11.49, "name": "BBa_K142002", "before_regulated": 28023.305700000004, "concen": 0.1, "grp_id": 4, "pos": 8, "PoPS": 33.410000000000004, "repress_rate": 0.0, "K1": null, "induce_rate": 0.0, "copy": 73.0, "display": "False"}, 5: {"RiPS": 11.49, "name": "BBa_C0160", "before_regulated": 28711.097099999995, "concen": 0.1, "grp_id": 5, "pos": 2, "PoPS": 34.23, "repress_rate": 0.44281337550618577, "K1": 3.041392685158225, "induce_rate": 0.44281337550618577, "copy": 73.0, "display": "True"}, 6: {"RiPS": 11.49, "name": "BBa_C0178", "before_regulated": 79590.88530000001, "concen": 0.1, "grp_id": 7, "pos": 2, "PoPS": 94.89, "repress_rate": -0.4428135474975077, "K1": -2.451703061628793, "induce_rate": -0.44281354749735624, "copy": 73.0, "display": "True"}, 7: {"RiPS": 11.49, "name": "BBa_C0178", "before_regulated": 79590.88530000001, "concen": 0.1, "grp_id": 7, "pos": 4, "PoPS": 94.89, "repress_rate": -0.4428135474975077, "K1": -2.451703061628793, "induce_rate": -0.44281354749735624, "copy": 73.0, "display": "True"}}, "plasmids": [[4, 5, 7]], "groups": {4: {"from": -1, "state": "cis", "corep_ind_type": "null", "to": [5, 6], "sbol": [{"type": "Promoter", "name": "BBa_I14033"}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0060", "id": 1}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0060", "id": 2}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Activator", "name": "BBa_K518003", "id": 3}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Repressor", "name": "BBa_K142002", "id": 4}, {"type": "Terminator", "name": "BBa_B0013"}], "type": "Constitutive"}, 5: {"from": 3, "state": "cis", "corep_ind_type": "null", "to": [], "sbol": [{"type": "Promoter", "name": "BBa_I712074"}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0160", "id": 5}, {"type": "Terminator", "name": "BBa_B0013"}], "type": "Positive"}, 7: {"from": 4, "state": "cis", "corep_ind_type": "Inducer", "to": [], "sbol": [{"type": "Promoter", "name": "BBa_I712074"}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0178", "id": 6}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0178", "id": 7}, {"type": "Terminator", "name": "BBa_B0013"}], "corep_ind": "Ind_0140", "type": "Negative"}}};
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
          var w=document.getElementById('Curve').clientWidth/data.length/2.5;
          var h=document.getElementById('Curve').clientHeight;
          document.getElementById('Curve').appendChild(createAnInputCheckBox(i,w,h,proteinNames[i]));
          document.getElementById('Curve').appendChild(document.createTextNode(proteinNames[i]));
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
    isStochastic = true;
    //gene_circuit = sessionStorage.gene_circuit;
    gene_circuit = raw;
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
	var o=document.createElement("input");
    o.type="checkbox";
    o.id=proteinName;
    o.name="aa";
	o.value=proteinName;
	o.style.width=width+'px';
	o.style.height=height+'px';
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
	return o;
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
          console.log(e.x-r.x);
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
