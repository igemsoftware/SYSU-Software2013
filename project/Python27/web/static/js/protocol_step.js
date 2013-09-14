function preloadimages(arr){
    var newimages=[], loadedimages=0;
    var postaction = function(){}
    var arr=(typeof arr!="object")? [arr] : arr
    function imageloadpost() {
        loadedimages++
        if (loadedimages==arr.length){
            postaction(newimages)
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image()
        newimages[i].src=arr[i]
        newimages[i].onload=function(){
            imageloadpost()
        }
        newimages[i].onerror=function(){
            imageloadpost()
        }
    }
    return {
        done:function(f){
            postaction=f || postaction
        }
    }
}

function parse_data(data) {
  var img_path = [];
  for (var i = 0; i < data.circuit.length; i++)
  for (var j = 0; j < data.circuit[i].sbol.length; j++) {
    var img_name = 'Promoter.PNG';
    var pro_type = data.circuit[i].sbol[j].type;
    if      (pro_type == 'Promoter') img_name = 'Promoter.PNG';
    else if (pro_type == 'RBS') img_name = 'rbs.PNG';
    else if (pro_type == 'Protein') img_name = 'Coding.PNG';
    else if (pro_type == 'Repressor') img_name = 'Coding.PNG';
    else if (pro_type == 'Activator') img_name = 'Coding.PNG';
    else if (pro_type == 'Terminator') img_name = 'Terminator.PNG';
    img_path.push("../static/img/component/" + img_name);
  }
  return img_path;
}

function get_name(data) {
  var comp_name = [];
  for (var i = 0; i < data.circuit.length; i++)
  for (var j = 0; j < data.circuit[i].sbol.length; j++) {
    comp_name.push(data.circuit[i].sbol[j].name);
  }
  return comp_name;
}

var interval = 70;
var horizon = 70;
function draw(cxt, horizon) {
}
function handlerData(){
	if(sessionStorage.genecircuitSave!==undefined)
	{
		data = eval('(' + sessionStorage.genecircuitSave + ')'); 
		return data['genecircuit'];
	}
}
window.onload=function() {
  var data = handlerData();
  console.log(data);
  var img_path = parse_data(data);
  var comp_name = get_name(data);
  preloadimages(img_path).done( function(img) {
    var c=document.getElementById("myCanvas");
    c.width = interval * img.length * 2;
    var cxt=c.getContext("2d");
    var tot = img.length;
    var k = 2;
    var cur_hor = horizon;
    var step = 1;
    var text_pos = -1;
    for (var l = 0; l < Math.log(tot)/Math.LN2; l++) {
      var tot = img.length;
      var bgn = 30;
      cxt.font="20px Helvetica";
      cxt.textAlign="left";
      cxt.fillText("Step " + step, bgn, cur_hor);
      bgn += 100;


      for (var i = 0; i < tot; i++) {
        var height = img[i].height * interval / img[i].width;
        cxt.drawImage(img[i], bgn, cur_hor - height, interval, height);
        cxt.font="10px Helvetica";
        cxt.textAlign="center";
        cxt.fillText(comp_name[i], bgn + interval / 2, cur_hor + 10);
        var j = 2;
        if ((i+1) % k != 0 && i < tot - 1)
          j = 1;
        bgn += j * interval;
      }
      k *= 2;
      cur_hor += horizon;
      step++;
    }
  });
}
