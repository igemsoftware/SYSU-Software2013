var plasmidPainter = {
	canvas: null,
	canvasId: null,
	data: null,
	text: null,
	init: function(JSONdata) {
		data = JSONdata;
	},
	bindCanvas: function(canvasId) {
		var canvas = document.getElementById(canvasId);
		if (canvas == null) {
			console.log("canvas not found!");
			return false;
		}
		this.canvas = canvas;
		this.canvasId = canvasId;
	},
	drawSegment: function(bioStart, bioEnd, name, type, seq) {
		var color;
		switch (type) {
			case 'type1':
				color = "#9e33cc";
				break;
			case 'type2':
				color = "#00FF00";
				break;
		}
		var marginLeft = 0, 
			marginTop = 12.5;
		jc.start(this.canvasId, true);
		jc.rect((marginLeft + bioStart), marginTop, (bioEnd - bioStart), 25, color, true).id(name);
		// add shadow
		jc('#'+name).shadow({
            x:3,
            y:3,
            blur:5,
            color:'rgba(100, 100, 100, 0.5)'
        });
		// bind mouseover event
		jc("#"+name).mouseover(function() {
			this.color("#FF0000");
			jc("#seq").string("seq: " + seq);
		});
		// bind mouseout event
		jc("#"+name).mouseout(function() {
			this.color(color);
			jc("#seq").string("seq: select a segment to show its sequence");
		});
		//jc.start(this.canvasId, true);
	},
	drawAll: function() {
		jc.start(this.canvasId);
		jc.rect(0, 0, 1100, 50, "#EEEEFF", true);
		jc.text("seq: select a segment to show its sequence", 400, 60).id("seq");
		this.text = jc("#seq");
		jc.start(this.canvasId);		
		// 把JSONdata里的每一个元素画出来
		var temp=0;
		for(i=0;i<data.length;i++)
		{			
			if(typeof(data[i].name)!=="number")
			{
				this.drawSegment(data[i].start/size*1100,data[i].end/size*1100,parseInt(temp,10),(temp%2==0)?"type1":"type2",seq.substring(data[i].start,data[i].end));	
				temp++;
			}
		}
		//this.drawSegment(0, 40, '1','type1', 'AAATTACGA');
		//this.drawSegment(60, 200, '2', 'type2', 'TAGCAGTA');
		//this.drawSegment(280, 500, '3', 'type2', 'CGATATGATC');
		//this.drawSegment(700, 800, '4', 'type1', 'GACTAACT');
		//this.drawSegment(850, 870, '5', 'type2', 'ATTACGATACGA');
	}
};
function show(id) {
	plasmidPainter.bindCanvas(id);
	plasmidPainter.init(data);
	plasmidPainter.drawAll();
}
var data =  [];
var size=0;//整个序列的长度
var colors=['#afcc22','#82d8ef','#80bd91'];//环形图有色色块的颜色
var raw_data={
    "DnaComponent": {
        "description": "undefined",
        "annotaions": [{"SequenceAnnotation": {"bioStart": "49",
                    "subComponent": {
                        "DnaComponent": {
                            "displayId": "4932",
                            "uri": "http: //partsregistry.org/Part: BBa_E1010",
                            "type": "Coding",
                            "description": "**highly**engineeredmutantofredfluorescentproteinfromDiscosomastriata(coral)",
                            "name": "BBa_E1010"
                        }
                    },
                    "uri": "http: //sbols.org/",
                    "strand": "+",
                    "bioEnd": "730"
                }
            },{
                "SequenceAnnotation": {
                    "bioStart": "736",
                    "subComponent": {
                        "DnaComponent": {
                            "displayId": "144",
                            "uri": "http: //partsregistry.org/Part: BBa_B0011",
                            "type": "Terminator",
                            "description": "LuxICDABEG(+/-)",
                            "name": "BBa_B0011"
                        }
                    },
                    "uri": "http: //sbols.org/",
                    "strand": "+",
                    "bioEnd": "782"
                }
            }
        ],
        "uri": "http: //sbol.org/",
        "DnaSequence": {
            "nucleotides": "GAATTCGCGGCCGCTTCTAGATGGCCGGCGAATTCGCGGCCGCTTCTAGatggcttcctccgaagacgttatcaaagagttcatgcgtttcaaagttcgtatggaaggttccgttaacggtcacgagttcgaaatcgaaggtgaaggtgaaggtcgtccgtacgaaggtacccagaccgctaaactgaaagttaccaaaggtggtccgctgccgttcgcttgggacatcctgtccccgcagttccagtacggttccaaagcttacgttaaacacccggctgacatcccggactacctgaaactgtccttcccggaaggtttcaaatgggaacgtgttatgaacttcgaagacggtggtgttgttaccgttacccaggactcctccctgcaagacggtgagttcatctacaaagttaaactgcgtggtaccaacttcccgtccgacggtccggttatgcagaaaaaaaccatgggttgggaagcttccaccgaacgtatgtacccggaagacggtgctctgaaaggtgaaatcaaaatgcgtctgaaactgaaagacggtggtcactacgacgctgaagttaaaaccacctacatggctaaaaaaccggttcagctgccgggtgcttacaaaaccgacatcaaactggacatcacctcccacaacgaagactacaccatcgttgaacagtacgaacgtgctgaaggtcgtcactccaccggtgcttaataaACCGGCagagaatataaaaagccagattattaatccggcttttttattatttACCGGTTAATACTAGTAGCGGCCGCTGCAG",
            "uri": "http: //sbols.org/"
        },
        "displayId": "undefined",
        "name": "undefined"
    }
};
var seq=raw_data.DnaComponent.DnaSequence.nucleotides;
function sortNumber(a, b)//用于数组排序的函数
{
	return a.start - b.start;
}

function turnRawDatatoData(raw)//把原始数据json转化为可以生成环形图的数组的函数
{                               //The function that can turn raw json data to array that can generate donut
	var tempArray=[];
	size=raw.DnaComponent.DnaSequence.nucleotides.length;
	for(i=0;i<raw.DnaComponent.annotaions.length;i++)
	{
		tempArray[i]={};
		tempArray[i].start=parseInt(raw.DnaComponent.annotaions[i].SequenceAnnotation.bioStart,10);
		tempArray[i].name=raw.DnaComponent.annotaions[i].SequenceAnnotation.subComponent.DnaComponent.name;
		tempArray[i].end=parseInt(raw.DnaComponent.annotaions[i].SequenceAnnotation.bioEnd,10);
		tempArray[i].value=parseInt((tempArray[i].end-tempArray[i].start)/size*100,10);
	}		
	tempArray=tempArray.sort(sortNumber);
	
	var real_data=[];
	var start=0;
	var index=0;
	for(i=0;i<tempArray.length;i++)
	{
		real_data[index]={name:index,color:"#f4f4f4"};
		real_data[index].start=start;
		real_data[index].end=tempArray[i].start-1;		
		real_data[index].value=parseInt((real_data[real_data.length-1].end-real_data[real_data.length-1].start)/size*100,10);
		if(real_data[index].value===0)
			real_data[index].value=1;
		index=index+1;
		real_data[index]=tempArray[i];
		real_data[index].color=colors[i%2];
		index=index+1;
		start=tempArray[i].end+1;
		if(i==tempArray.length-1)
		{
			real_data[index]={name:index,color:"#f4f4f4"};
			real_data[index].start=start;
			real_data[index].end=size-1;
			real_data[index].value=parseInt((real_data[real_data.length-1].end-real_data[real_data.length-1].start)/size*100,10);
		}
	}		
	//console.log(real_data);
	tempArray=null;
	return real_data;	
}
function getRawData()//to get the raw data of plasmid
{
		
}
function initDrawChart(){
	getRawData();
	data=turnRawDatatoData(raw_data);		
	var chart = new iChart.Donut2D({
		id:'ichartjs2013',
		animation:true,
		render : 'canvasDiv',//图表渲染的HTML DOM的id //Chart rendering the HTML DOM id
		center:{
			text:raw_data.DnaComponent.name+'\n'+seq.length+'bp',
			shadow:true,
			shadow_offsetx:0,
			shadow_offsety:2,
			shadow_blur:2,
			shadow_color:'#b7b7b7',
			color:'#6f6f6f'
		},
		//offset_angle: 270,
		data: data,//图表的数据源 //Chart data source
		offsetx:0,
		shadow:false,
		background_color:'#f4f4f4',
		separate_angle:0,//分离角度 //Separation angle
		tip:{
			enable:true,
			showType:'fixed',
			animation:true,
			listeners:{
				parseText:function(tip,name,value,text){
                    var str= "";
					if(typeof(name)!="number"){						
						str=name+"<br\/>";
					}
					for(i=0;i<data.length;i++){
						if(data[i].name==name){
							if(typeof(data[i].name)=="number")
							{
								str=str+data[i].start+" to "+data[i].end;
								if(i!==0){
									str=str+"<br\/>"+seq.substring(data[i].start-1,data[i].end+1);
								}
								else
								{
									str=str+"<br\/>"+seq.substring(data[i].start,data[i].end+1);
								}
							}else
							{
								str=str+data[i].start+" to "+data[i].end;
								str=str+"<br\/>"+seq.substring(data[i].start,data[i].end);
							}							
							break;
						}
					}
					return str;
				}
			}
		},
		sub_option:{			
			label : {
				background_color:null,
				sign:true,//设置禁用label的小图标
				padding:'0 4',
				border:{
					enable:false,
					color:'#666666'
				},
				fontsize:11,
				fontweight:600,
				color : '#4572a7',		
			},
			color_factor : 0.3,
			listeners:{
				click:function(l,e,m){
					if(e["event"]["button"]===0)//&&typeof(l.get('name'))!="number")
					{
						for(i=0;i<data.length;i++){
							if(data[i].name==l.get('name')){
								//window.clipboardData.setData("Text",seq.substring(data[0].start-1,data[i].end+1)); 
								if(i==0)
									break;
								turnTheData(i);
								var chart2 = $.get('ichartjs2013');//根据ID获取图表对象
								chart2.load(data);//载入新数据
								break;
							}
						}
					}					

				}
			}
		},
		showpercent:true,
		decimalsnum:0,
		width : 783,
		height : 400,
		radius:140
		
	});	
	chart.plugin(create0BP(chart));
	chart.plugin(create14sBP(chart));
	chart.plugin(createhalfBP(chart));
	chart.plugin(create34BP(chart));
	chart.draw();	
}
function create0BP(chart){
	return new iChart.Custom({
		drawFn:function(){	
			var radius=140;
			var x=	chart.getDrawingArea().x+chart.getDrawingArea().width/2+radius;
			var y=  chart.getDrawingArea().height/2;
			//console.log(chart.radius);
			//在左侧的位置，设置竖排模式渲染文字			
			chart.target.textAlign('left')
			.textBaseline('top')
			.textFont('600 12px 微软雅黑')
			.fillText('0bp',x,y,false,'#6d869f', 'lr',26,false,0,'middle');
		}		
	});
}
function create14sBP(chart){
	return new iChart.Custom({
		drawFn:function(){	
			var radius=140;
			var str=parseInt(size/4,10)+"bp";
			var x=	chart.getDrawingArea().x+chart.getDrawingArea().width/2-20;
			var y=  chart.getDrawingArea().height/2+radius;
			//在左侧的位置，设置竖排模式渲染文字			
			chart.target.textAlign('left')
			.textBaseline('top')
			.textFont('600 12px 微软雅黑')
			.fillText(str,x,y,false,'#6d869f', 'lr',26,false,0,'middle');
		}		
	});
}
function createhalfBP(chart){
	return new iChart.Custom({
		drawFn:function(){	
			var radius=140;
			var str=parseInt(size/2,10)+"bp";
			var x=	chart.getDrawingArea().x+chart.getDrawingArea().width/2-radius-35;
			var y=  chart.getDrawingArea().height/2;
			//console.log(chart.radius);
			//在左侧的位置，设置竖排模式渲染文字			
			chart.target.textAlign('left')
			.textBaseline('top')
			.textFont('600 12px 微软雅黑')
			.fillText(str,x,y,false,'#6d869f', 'lr',26,false,0,'middle');
		}		
	});
}
function create34BP(chart){
	return new iChart.Custom({
		drawFn:function(){	
			var radius=140;
			var str=parseInt(size*3/4,10)+"bp";
			var x=	chart.getDrawingArea().x+chart.getDrawingArea().width/2-15;
			var y=  chart.getDrawingArea().height/2-radius;
			chart.target.textAlign('left')
			.textBaseline('top')
			.textFont('600 12px 微软雅黑')
			.fillText(str,x,y,false,'#6d869f', 'lr',26,false,0,'middle');
		}		
	});
}
var left=1;//the int to record seq's left position
function seqTextOnClickHandler(obj){	
	left=parseInt((document.getElementById('seqCurrentText').scrollLeft/document.getElementById('seqCurrentText').scrollWidth)*size,10)+1;
	updateSeqPosText();
}
function copyBtnOnClick(obj)
{
	
}
//accrording to the data array 's colors to add the color to the seq
function createDivStrByData()
{
	var str='';
	var temp=0;
	for(i=0;i<data.length;i++){
		if(typeof(data[i].name)=="number")
		{
			if(i===0)
			{
				str=str+'<span style="color:black;">'+seq.substring(data[i].start,data[i].end+1)+"</span>";
			}else
			{
				str=str+'<span style="color:black;">'+seq.substring(data[i-1].end,data[i].end+1)+"</span>";
			}
		}else{			
			str=str+'<span style="color:'+colors[temp%2]+';">'+seq.substring(data[i].start,data[i].end)+"</span>";
			temp=temp+1;
		}
	}
	return str;
}
function updateSeqPosText(){
	document.getElementById('x1').innerText=left;
	document.getElementById('x2').innerText=left+45;
	document.getElementById('x3').innerText=left+90;
	document.getElementById('x4').innerText=left+135;
}
//turn the data array to another index at the first place
function turnTheData(indexToBeFirst)
{
	newData=[];
	newDataSize=0;
	for(i=indexToBeFirst;i<data.length;i++)
	{
		newData[newDataSize]=data[i];
		newDataSize++;
	}
	for(j=0;j<indexToBeFirst;j++)
	{
		newData[newDataSize]=data[j];
		newDataSize++;
	}
	data=newData;
	newData=null;
}
function InitAjax()
{
var ajax=false;
try {
   ajax = new ActiveXObject("Msxml2.XMLHTTP");
} catch (e) {
   try {
    ajax = new ActiveXObject("Microsoft.XMLHTTP");
   } catch (E) {
    ajax = false;
   }
}
if (!ajax && typeof XMLHttpRequest!='undefined') {
   ajax = new XMLHttpRequest();
}
         return ajax;
}
function testWebSocket(){
	if ("WebSocket" in window) {
		ws = new WebSocket("ws://" + document.domain + ":5000/ws");
		ws.onmessage = function(msg) {
		   var message = JSON.parse(msg.data);
		   console.log(message.result);
		};
	}
	ws.onopen = function() {
		//ws.send(JSON.stringify({'request': 'getLoginedUserName'}));
		//ws.send(JSON.stringify({'request': 'getXmlJson','path':'web/biobrick/Terminators/BBa_B0010.xml'}));
		ws.send(JSON.stringify({'request': 'getUserFileList','path':'web/biobrick/Terminators/BBa_B0010.xml'}));
	}
}
$(function(){
	initDrawChart();	
	document.getElementById('seqCurrentText').value=seq;
	document.getElementById('sequenceDiv').innerHTML=createDivStrByData();	
	show('plasmid-canvas');
	//InitAjax();
	testWebSocket();
});
