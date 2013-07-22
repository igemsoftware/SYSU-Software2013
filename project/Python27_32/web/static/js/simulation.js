var data =  [];
var raw_data=[];

$(document).ready(function () {
  if ("WebSocket" in window) {
    ws = new WebSocket("ws://" + document.domain + ":5000/ws");
    ws.onmessage = function (msg) {
      raw_data = JSON.parse(msg.data).result;
      run();
    };
  };

  // Bind send button to websocket
  ws.onopen = function() {
    ws.send(JSON.stringify({'request': 'getSimulationData'}));
  };

  // Cleanly close websocket when unload window
  window.onbeforeunload = function() {
    ws.onclose = function () {}; // disable onclose handler first
    ws.close()
  };
});

var size=0;
function turnRawDatatoData(raw)
{
  var ret = [];
  var LineNum = raw[0].length;
  var PointNum = raw.length;
  for (var i = 1; i < LineNum; i++) {
    ret[i-1] = {};
    ret[i-1].name = i;
    ret[i-1].value = [];
    ret[i-1].line_width = 2;
  }
  ret[0]["color"] = '#44f4f4';
  ret[1]["color"] = '#8fd8ef';
  ret[2]["color"] = '#237e90';
  ret[3]["color"] = '#80bd91';
  for (var i = 0; i < PointNum; i++)
  for (var j = 1; j < LineNum; j++)
  ret[j-1]["value"].push(raw[i][j]);
  return ret;
}

function getLabel(raw) {
  var PointNum = raw.length;
  var labels = [];
  for (var i = 0; i < PointNum; i++)
  if (i % 10 == 0)
    labels.push(raw[i][0]);
  return labels;
}

//$(function(){
function run(){
  //ws.send(JSON.stringify({'request': 'getSimulationData'}));
  data = turnRawDatatoData(raw_data);
  labels = getLabel(raw_data);
  var chart = new iChart.LineBasic2D({
    animation:true,
    render : 'canvasDiv',//图表渲染的HTML DOM的id
    data: data,//图表的数据源
    labels: labels,
    offsetx:-60,
    shadow:true,
    background_color:'#f4f4f4',
    separate_angle:10,//分离角度
    tip:{
      enable:true,
      showType:'fixed',
      animation:true,
      //fade_duration:700,
      listeners:{
        parseText:function(tip,name,value,text){
          var str= name;
          return str;
        }
      }
    },
    sub_option:{
      label: false,
      color_factor: 0.3,
      intersection: false,
      smooth: true,
    },
    showpercent:true,
    decimalsnum:2,
    width : 800,
    height : 400,
    radius:140
  });
  chart.draw();
};
