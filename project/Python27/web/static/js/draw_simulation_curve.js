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
    //ret[iter]["line_width"]  = 2;
    iter++;
  }
  return ret;
}

function getLabel(time, dt) {
  var labels = [];
  for (var i = 0; i <= time; i += dt * 4)
  labels.push((Math.round(i*10)/10.0).toFixed(0));
  return labels;
}

var chart=null;

function saveGraph()
{
  var _canvas=document.getElementById(chart.canvasid);
  Canvas2Image.AsPNG(_canvas);
}

function run(data, canvasId, width1, height1, time, dt) {
  //ws.send(JSON.stringify({'request': 'getSimulationData'}));
  labels = getLabel(time, dt);
  chart = new iChart.LineBasic2D({
    animation:false,
    render : 'canvasDiv',//图表渲染的HTML DOM的id
    data: data,//图表的数据源
    labels: labels,
    offsetx:10,//-60,
    shadow:true,
    background_color:'#f4f4f4',
    separate_angle:10,//分离角度
    tip: {
      enable: true,
      showType: 'fixed',
      animation: true,
      //fade_duration:700,
      listeners: {
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
        click:function(r,e,m) {
          if($("input[name='inducerRadio']:checked").val()!==undefined) {
            corepind[$("input[name='inducerRadio']:checked").attr('id')]={"time": (e.x-r.x)/(r.options.width) * 6000};
            gene_circuit = sessionStorage.gene_circuit;
            isStochastic = $('#stochastic')[0].checked;
            isDelay = $('#delay')[0].checked;
            $("#Curve").empty();
            $("#Inducer").empty();
            ws.send(JSON.stringify({'request'    : 'Simulate',
                                   'isStochastic': isStochastic,
                                   'isDelay'     : isDelay,
                                   'gene_circuit': gene_circuit,
                                   'corepind'    : corepind
            }));
          }
        }
      }
    },
    coordinate:{
      width: width1 * 0.85,
      height: height1 * 0.85,
      striped_factor : 0.18,
      axis:{
        color:'#252525',
        width:[0,0,4,4]
      },
    },
    width : width1,
    height : height1,
    radius:140
  });
  chart.plugin(new iChart.Custom({
    drawFn: function() {
      var coo = chart.getCoordinate(),
          x = coo.get('originX'),
          y = coo.get('originY'),
          w = coo.width,
          h = coo.height;
      chart.target.textAlign('start')
      .textBaseline('bottom')
      .textFont('600 11px')
      .fillText('Concen',x-40,y-12,false,'#9d987a')
      .textBaseline('top')
      .fillText('Time',x+w+12,y+h+10,false,'#9d987a');
    }
  }));
  chart.draw();
  document.body.style.zoom=1.5;
  chart.draw();
  document.body.style.zoom=1;
};

function genecircuitRun(data, canvasId, width1, height1, time, dt) {
  //ws.send(JSON.stringify({'request': 'getSimulationData'}));
  labels = getLabel(time, dt);
  chart= new iChart.LineBasic2D({
    animation:false,
    render : 'canvasDiv',//图表渲染的HTML DOM的id
    data: data,//图表的数据源
    labels: labels,
    offsetx:20,//-60,
    shadow:true,
    background_color:'#ebebeb',
    separate_angle:10,//分离角度
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
          if($("input[name='inducerRadio']:checked").val()!==undefined) {
            corepind[$("input[name='inducerRadio']:checked").attr('id')]={"time": (e.x-r.x)/(r.options.width) * 6000};
            gene_circuit = sessionStorage.gene_circuit;
            isStochastic = $('#stochastic')[0].checked;
            isDelay = $('#delay')[0].checked;
            $("#Curve").empty();
            $("#Inducer").empty();
            ws.send(JSON.stringify({'request'     : 'Simulate',
                                   'isStochastic': isStochastic,
                                   'isDelay'     : isDelay,
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
