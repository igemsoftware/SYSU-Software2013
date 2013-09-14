var data=null;
function parse_data() {  
  var img = new Array();
  for (var i = 0; i < data.DnaComponent.annotaions.length; i++) {
    img[i] = new Image();
    img[i].src =
      "../static/img/component/"+data.DnaComponent.annotaions[i].SequenceAnnotation.subComponent.DnaComponent.type+".PNG" 
  }
  return img;
}

var interval = 50;
var horizon = 50;
//var img = parse_data();
function draw(cxt, horizon) {
}
function handlerData(){
	if(sessionStorage.genecircuitSave!==undefined)
	{
		data = eval('(' + sessionStorage.genecircuitSave + ')'); 
		console.log(data['genecircuit']);
		data=data['genecircuit'];
	}
}
window.onload=function() {
  handlerData();
  var c=document.getElementById("myCanvas");
  var cxt=c.getContext("2d");
  var tot = img.length;
  var k = 2;
  var hor = 50;
  var step = 1;
  var text_pos = -1;
  for (var l = 0; l < Math.log(tot)/Math.LN2; l++) {
    var tot = img.length;
    var bgn = 30;
    for (var i = 0; i < tot; i++) {
      var height = img[i].height * interval /img[i].width;
      cxt.drawImage(img[i], bgn, hor - height, interval, height);
      var j = 2;
      if ((i+1)%k != 0 && i < tot - 1)
        j = 1;
      bgn += j * interval;
    }
    if (text_pos == -1)
      text_pos = bgn;
    cxt.font="20px Arial";
    cxt.fillText("Step " + step, text_pos, hor);
    var pos = interval;
    /*
       for (var j = 0; j < tot - 1; j++) {
       if ((j+1) % k != 0) {
       cxt.fillStyle="#000000";
       cxt.fillRect(pos, hor - 8, interval, 2);
       }
       pos += interval * 2;
       }
       */
    k *= 2;
    hor += horizon;
    step++;
  }
}
