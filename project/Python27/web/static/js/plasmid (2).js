var colors=['#afcc22','#82d8ef','#80bd91'];//环形图有色色块的颜色
var plasmidPainter = {
	canvas: null,
	canvasId: null,
	data2: null,
	text: null,
	datasize:null,
	init: function(JSONdata,dataSize) {
		data2 = JSONdata;
		datasize=dataSize;
		this.clearAll();
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
	clearAll:function() {
		jc.clear();
	},
	drawSegment: function(bioStart, bioEnd, name, color, seq) {
		//var color=colors[typeCount];
		/*switch (type) {
			case 'type1':
				color = "#9e33cc";
				break;
			case 'type2':
				color = "#00FF00";
				break;
		}*/
		var marginLeft = 0, 
			marginTop = 12.5;
		jc.start(this.canvasId, true);
		console.log(bioStart, bioEnd, name, color, seq);
		jc.rect((marginLeft + bioStart), marginTop, (bioEnd - bioStart), 25, color, true).id(name);
		// add shadow
		jc('#'+name).shadow({
            x:3,
            y:3,
            blur:5,
            color:'rgba(100, 100, 100, 0.5)'
        });
		// bind mouseover event
		/*jc("#"+name).mouseover(function() {
			this.color("#FF0000");
			jc("#seq").string("seq: " + seq);
		});
		// bind mouseout event
		jc("#"+name).mouseout(function() {
			this.color(color);
			jc("#seq").string("seq: select a segment to show its sequence");
		});*/
		jc.start(this.canvasId, true);
	},
	drawAll: function() {
		jc.start(this.canvasId);
		jc.rect(0, 0, 1189, 50, "#EEEEFF", true);
		//jc.text("seq: select a segment to show its sequence", 400, 60).id("seq");
		//this.text = jc("#seq");		
		jc.start(this.canvasId);
		for(var i=0;i<data2.length;i++)
		{		
			if(!/[A-Z]/.test(data2[i].seq[0]))//typeof(data[i].name)!=="number")
			{				
				var st=data2[i].start*1189/datasize;
				var en=data2[i].end*1189/datasize;
				if(data2[i].name=== undefined)
				{				
					this.drawSegment(st,en,i,data2[i].color,data2[i].seq);
				}else
				{
					this.drawSegment(st,en,i,data2[i].color,data2[i].seq);	
				}
				console.log(st,en,i,data2[i].color,data2[i].seq);
			}
		}
	}
};
function show(id,tempdata,datasize) {
	plasmidPainter.bindCanvas(id);
	plasmidPainter.init(tempdata,datasize);
	//plasmidPainter.clearAll();
	plasmidPainter.drawAll();
}
function createTempDataForCanvas(seqText,leftTemp)
{  
	var tempdata=[];
	var tempsize=0;
	var templeft=0;
	for(var i=0;i<seqText.length;i++)
	{
		//var patt1 = new RegExp("/[A-Z]/");
		if(/[A-Z]/.test(seqText[i])&&!/[A-Z]/.test(seqText[i+1])&&templeft!=i+1)
		{
			tempdata[tempsize]={};
			tempdata[tempsize].start=templeft;
			tempdata[tempsize].end=i+1;
			tempdata[tempsize].seq=seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end);
			console.log(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
			tempdata[tempsize].name=findNameInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
			tempdata[tempsize].color=findColorInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
			tempsize=tempsize+1;
			templeft=i+1;
			for(var j=templeft;j<seqText.length;j++)
			{
				if(!/[A-Z]/.test(seqText[j])&&/[A-Z]/.test(seqText[j+1])&&j+1!=templeft)
				{
					tempdata[tempsize]={};
					tempdata[tempsize].start=templeft;
					tempdata[tempsize].end=j+1;
					tempdata[tempsize].seq=seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end);
					console.log(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempdata[tempsize].name=findNameInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempdata[tempsize].color=findColorInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempsize=tempsize+1;
					templeft=j+1;
					i=j-1;					
				}else if(j==seqText.length-1&&j+1!=templeft)
				{					
					tempdata[tempsize]={};
					tempdata[tempsize].start=templeft;
					tempdata[tempsize].end=j+1;
					tempdata[tempsize].seq=seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end);
					//console.log(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempdata[tempsize].name=findNameInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempdata[tempsize].color=findColorInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempsize=tempsize+1;
					templeft=j+1;
					i=seqText.length;					
				}
			}
		}else if(!/[A-Z]/.test(seqText[i])&&/[A-Z]/.test(seqText[i+1])&&templeft!=i+1)
		{
			tempdata[tempsize]={};
			tempdata[tempsize].start=templeft;
			tempdata[tempsize].end=i+1;
			tempdata[tempsize].seq=seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end);
			console.log(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
			tempdata[tempsize].name=findNameInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
			tempdata[tempsize].color=findColorInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
			tempsize=tempsize+1;
			templeft=i+1;
			for(var j=templeft;j<seqText.length;j++)
			{
				if(/[A-Z]/.test(seqText[j])&&!/[A-Z]/.test(seqText[j+1])&&j+1!=templeft)
				{
					tempdata[tempsize]={};
					tempdata[tempsize].start=templeft;
					tempdata[tempsize].end=j+1;
					tempdata[tempsize].seq=seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end);
					//console.log(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempdata[tempsize].name=findNameInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempdata[tempsize].color=findColorInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempsize=tempsize+1;
					templeft=j+1;
					i=j-1;
					
				}else if(j==seqText.length-1&&j+1!=templeft)
				{
					tempdata[tempsize]={};
					tempdata[tempsize].start=templeft;
					tempdata[tempsize].end=j+1;
					tempdata[tempsize].seq=seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end);
					//console.log(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempdata[tempsize].name=findNameInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempdata[tempsize].color=findColorInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
					tempsize=tempsize+1;
					templeft=j+1;
					i=seqText.length;					
				}
			}
		}		
	}
	if(templeft===0)
	{
		tempdata[0]={};
		tempdata[0].start=templeft;
		tempdata[0].end=seqText.length+1;
		tempdata[0].seq=seqText.substring(tempdata[0].start,tempdata[0].end);
		//console.log(seqText.substring(tempdata[0].start,tempdata[0].end));
		tempdata[tempsize].name=findNameInDataBySeq(seqText.substring(tempdata[0].start,tempdata[0].end));
		tempdata[tempsize].color=findColorInDataBySeq(seqText.substring(tempdata[tempsize].start,tempdata[tempsize].end));
		tempsize=tempsize+1;
	}
	return tempdata;
}
function findNameInDataBySeq(seqIn)
{
	for(var i=0;i<data.length;i++)
	{
		var str="";
		if(typeof(data[i].name)=="number")
		{
			if(i===0)
			{
				str=seq.substring(data[i].start,data[i].end+1);
			}else
			{
				str=seq.substring(data[i-1].end,data[i].end+1);
			}
		}else{			
			str=seq.substring(data[i].start,data[i].end);
		}
		var reg=new RegExp(seqIn);	
		//console.log(str);	
		if(reg.test(str))
		{			
			return data[i].name;
		}
	}
}
function findColorInDataBySeq(seqIn)
{
	for(var i=0;i<data.length;i++)
	{
		var str="";
		if(typeof(data[i].name)=="number")
		{
			if(i===0)
			{
				str=seq.substring(data[i].start,data[i].end+1);
			}else
			{
				str=seq.substring(data[i-1].end,data[i].end+1);
			}
		}else{			
			str=seq.substring(data[i].start,data[i].end);
		}
		var reg=new RegExp(seqIn);	
		if(reg.test(str))
		{			
			return data[i].color;
		}
	}
}
jQuery.fn.toolTip = function() { 
this.unbind().hover( 
function(e) { 
this.t = this.title; 
this.title = ''; 
$('body').append( '<p id="p_toolTip" style="display:none; max-width:320px;text-align:left;">' + this.t + '</p>' ); 
var tip = $('p#p_toolTip').css({ "position": "absolute", "padding": "10px 5px 5px 10px", "left": "5px", "font-size": "14px", "background-color": "white", "border": "1px solid #a6c9e2","line-height":"160%", "-moz-border-radius": "5px", "-webkit-border-radius": "5px", "z-index": "9999"}); 
var target = $(this); 
var position = target.position(); 
this.top = (position.top - 8); this.left = (position.left + target.width() + 5); 
$('p#p_toolTip').css({"position": "absolute", "top": "8px", "left": "-6px" }); 
tip.css({"top": this.top+"px","left":this.left+"px"}); 
tip.fadeIn("slow"); 
}, 
	function() { 
		this.title = this.t; 
		$("p#p_toolTip").fadeOut("slow").remove(); 
		} 
	); 
};
var data =  [];
var size=0;//整个序列的长度
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
var chart=null;
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
		tempArray[i].desp=raw.DnaComponent.annotaions[i].SequenceAnnotation.subComponent.DnaComponent.description;
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
		real_data[index].desp=tempArray[i].desp;
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
	tempArray=null;
	return real_data;	
}
function getRawData()//to get the raw data of plasmid
{
		
}
function initDrawChart(){	
	//if(sessionStorage._offsetAngle===undefined)
	//{
		sessionStorage._offsetAngle=270;
	//}
	getRawData();
	data=turnRawDatatoData(raw_data);		
	chart = new iChart.Donut2D({
		id:"ichartjs2013",
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
		offset_angle: parseInt(sessionStorage._offsetAngle,10),
		data: data,//图表的数据源 //Chart data source
		offsetx:0,
		shadow:false,
		background_color:'#f4f4f4',
		separate_angle:0,//分离角度 //Separation angle
		tip:{
			enable:true,
			showType:'follow',
			animation:false,
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
								str=str+"From:"+data[i].start+" To:"+data[i].end;								
								/*if(i!==0){
									str=str+"<br\/>"+seq.substring(data[i].start-1,data[i].end+1);
								}
								else
								{
									str=str+"<br\/>"+seq.substring(data[i].start,data[i].end+1);
								}*/
								return '';								
							}else
							{
								str=str+"From:"+data[i].start+" To:"+data[i].end;
								//str=str+"<br\/>"+seq.substring(data[i].start,data[i].end);
								str=str+"<br\/>Description:"+data[i].desp;
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
			color_factor : 0.3
		},
			/*,			listeners:{
				click:function(l,e,m){
					if(e["event"]["button"]===0)//&&typeof(l.get('name'))!="number")
					{
						for(i=0;i<data.length;i++){
							if(data[i].name==l.get('name')){
								//window.clipboardData.setData("Text",seq.substring(data[0].start-1,data[i].end+1)); 
								if(i==0)
									break;
								turnTheData(i);
								//var chart2 = document.getElementById("ichartjs2013");//$.get('ichartjs2013');//根据ID获取图表对象
								chart.load(data);//载入新数据
								break;
							}
						}
					}					

				}
			}*/
		
		showpercent:true,
		decimalsnum:0,
		width : 783,
		height : 400,
		radius:140
		
	});	
	chart.plugin(createRight(chart));
	chart.plugin(createBottom(chart));
	chart.plugin(createLeft(chart));
	chart.plugin(createTop(chart));
	chart.draw();	
}
function createRight(chart){
	return new iChart.Custom({
		drawFn:function(){	
			var radius=140;
			var str=parseInt(size/4,10)+"bp";
			var x=	chart.getDrawingArea().x+chart.getDrawingArea().width/2+radius;
			var y=  chart.getDrawingArea().height/2;	
			chart.target.textAlign('left')
			.textBaseline('top')
			.textFont('600 12px 微软雅黑')
			.fillText(str,x,y,false,'#6d869f', 'lr',26,false,0,'middle');
			addDegreeScale();
		}		
	});
}
function addDegreeScale()
{
	//console.log(chart);
	var centerx=parseInt(chart.getDrawingArea().width/2);
	var centery=chart.getDrawingArea().height/2;
	chart.target.line(centerx+13,centery+140,centerx+13,centery+140+30,3,"black",false);
	chart.target.line(centerx+140,centery,centerx+140+30,centery,3,"black",false);
	chart.target.line(centerx-120-30,centery,centerx-120,centery,3,"black",false);
	chart.target.line(centerx+13,centery-120,centerx+13,centery-120-30,3,"black",false);
}
function createBottom(chart){
	return new iChart.Custom({
		drawFn:function(){	
			var radius=140;
			var str=parseInt(size/2,10)+"bp";
			var x=	chart.getDrawingArea().x+chart.getDrawingArea().width/2;
			var y=  chart.getDrawingArea().height/2+radius;	
			chart.target.textAlign('left')
			.textBaseline('top')
			.textFont('600 12px 微软雅黑')
			.fillText(str,x,y,false,'#6d869f', 'lr',26,false,0,'middle');
		}		
	});
}
function createLeft(chart){
	return new iChart.Custom({
		drawFn:function(){	
			var radius=140;
			var str=parseInt(size*3/4,10)+"bp";
			var x=	chart.getDrawingArea().x+chart.getDrawingArea().width/2-radius-40;
			var y=  chart.getDrawingArea().height/2;
			chart.target.textAlign('left')
			.textBaseline('top')
			.textFont('600 12px 微软雅黑')
			.fillText(str,x,y,false,'#6d869f', 'lr',26,false,0,'middle');
		}		
	});
}
function createTop(chart){
	return new iChart.Custom({
		drawFn:function(){	
			var radius=140;			
			var x=	chart.getDrawingArea().x+chart.getDrawingArea().width/2;
			var y=  chart.getDrawingArea().height/2-radius;
			chart.target.textAlign('left')
			.textBaseline('top')
			.textFont('600 12px 微软雅黑')
			.fillText("0BP",x,y,false,'#6d869f', 'lr',26,false,0,'middle');
		}		
	});
}
var left=1;//the int to record seq's left position
/*function seqTextOnClickHandler(obj){	
	left=parseInt((document.getElementById('seqCurrentText').scrollLeft/document.getElementById('seqCurrentText').scrollWidth)*size,10)+1;
	updateSeqPosText();
}*/
function copyBtnOnClick(obj)
{
	if(window.clipboardData) {   
              window.clipboardData.clearData();   
              window.clipboardData.setData("Text", seq);
            alert("Copy success");   
      } else if(navigator.userAgent.indexOf("Opera") != -1) {   
           window.location = seq;   
      } else if (window.netscape) {   
           try {   
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");   
           } catch (e) {   
                alert("如果您正在使用FireFox！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");   
           }   
           var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);   
           if (!clip)   
                return;   
           var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);   
           if (!trans)   
                return;   
           trans.addDataFlavor('text/unicode');   
           var str = new Object();   
           var len = new Object();   
           var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);   
           var copytext = seq;   
           str.data = copytext;   
           trans.setTransferData("text/unicode",str,copytext.length*2);   
           var clipid = Components.interfaces.nsIClipboard;   
           if (!clip)   
                return false;   
           clip.setData(trans,null,clipid.kGlobalClipboard);   
           alert("Copy success！")   
      }   

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
	document.getElementById('x2').innerText=left+20;
	document.getElementById('x3').innerText=left+40;
	document.getElementById('x4').innerText=left+60;
	document.getElementById('seqCurrentText').innerHTML=seq.substring(left,left+60);
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
function testWebSocket(){
	if ("WebSocket" in window) {
		ws = new WebSocket("ws://" + document.domain + ":5000/ws");
		ws.onmessage = function(msg) {
		   var message = JSON.parse(msg.data);
		   console.log(message.result);
		   if(message.request==="getLoginedUserName")
		   {			  
			   sessionStorage.LoginedUserName=message.result;
		   }
		};
	}
	ws.onopen = function() {
		//ws.send(JSON.stringify({'request': 'getUserFileList'}));
		ws.send(JSON.stringify({'request': 'loadUserFile','fileName':'default1','fileType':'default'}));
		//ws.send(JSON.stringify({'request': 'getXmlJson','path':'web/biobrick/Terminators/BBa_B0010.xml'}));
		//ws.send(JSON.stringify({'request': 'getUserFileList','path':'web/biobrick/Terminators/BBa_B0010.xml'}));
	}
}
function CircleClass(drawArea,drawAreaToBody)
{
	var _this = this ; 
	_this.x = 0 ;
	_this.y = 0 ;
	_this.r=140;
	_this.innerR=70;
	_this.center=null;
	var init = function ()
	{ 
		_this.x = parseInt(drawAreaToBody.left+drawArea.width/2);
		_this.y = parseInt(drawAreaToBody.top+drawArea.height/2);
		_this.center=new PointClass(_this.x,_this.y);
	};
	_this.getRadius=function(){return _this.r;};
	_this.getInnerRadius=function(){return _this.innerR;};
	_this.getX=function(){return _this.x;};
	_this.getY=function(){return _this.y;};
	init();
}
function PointClass(x,y)
{
	var _this=this;
	_this.x = 0 ;
	_this.y = 0 ;
	var init = function ()
	{ 
		_this.x = x;
		_this.y = y;
	};
	init();
}
function setUpDrag(){
	$("#divBody").draggable({
		containment: "parent" ,
		drag: function(event,ui) {			
		},
		stop:function(event,ui){
			var circle=new CircleClass(ui,chart.getDrawingArea(),$('#drawCanvasDiv').offset());
			var x=ui.offset.left;//+ui.helper.context.clientWidth/2;
			var y=ui.offset.top;//+ui.helper.context.clientWidth/2;
			if(isPointInCircle(circle,x,y)){
				left=parseInt(getAngleFromLineToXAxis(circle,x,y)/360*size);
				updateSeqPosText();
			}
			//console.log(parseInt(getAngleFromLineToXAxis(circle,x,y)/360*size));
			var ang=parseInt(sessionStorage._offsetAngle);
			sessionStorage._offsetAngle=ang+20;
			chart.push("offset_angle",ang+20);
			chart.push("")
			chart.setUp();	
		}
	});
}
 /**
     * vector from (x1,y1) to (x2,y2) To Y Axis's cos value
     * @param x1
     * @param y1 
     * @param x2
     * @param y2 
     * @return cosValue between vector(x2-x1,y2-y1)and positive Y axis
*/
function cosValueBetweenALineAndPositiveX(x1,y1,x2,y2) {
   var cosValue = 0;
   var realx = x2 - x1;
   var realy = y2 - y1;
   cosValue = (realx * 0 + realy * (-1)) / (1 * Math.sqrt(realx * realx + realy * realy));
   return cosValue;
}
/**
     * Get angle from Line:(circle's center to(x,y)) To Y Axis's positive side
     * @param circle
     * @param x 
     * @param y
     * @return an angle from 0 to 360
     */
function getAngleFromLineToYAxis(circle,x,y) {
	var angle = 0;
	angle = cosValueBetweenALineAndPositiveX(circle.getX(), circle.getY(), x, y);
	var pai=2*Math.asin(1);
	angle = 180*Math.acos(angle)/pai;
    if (circle.getX() > x) {
    	return 360 - angle;
	}
    return angle;
}
/**
     * Get angle from Line:(circle's center to(x,y)) To X Axis's positive side
     * @param circle
     * @param x 
     * @param y
     * @return an angle from 0 to 360
     */
function getAngleFromLineToXAxis(circle,x,y) {
	return (getAngleFromLineToYAxis(circle,x,y)-90<0)?getAngleFromLineToYAxis(circle,x,y)-90+360:getAngleFromLineToYAxis(circle,x,y)-90;
}
function lengthBetweenTwoPoint(x1,y1,x2,y2) {
  return Math.sqrt((x1-x2)*(x1-x2)+ (y1-y2)*(y1-y2));
}
function canvasMouseDown(obj,e)
{
	 sessionStorage.x1=e.clientX;
	 sessionStorage.y1=e.clientY;
	 obj.style.cursor = "hand";
}
function canvasMouseUp(obj,e)
{
	obj.style.cursor = "default";
	sessionStorage.x2=e.clientX;
	sessionStorage.y2=e.clientY;
	if (Math.abs(sessionStorage.x1-sessionStorage.x2)<3&& Math.abs(sessionStorage.y1-sessionStorage.y2)<3)
	{
		return;
	}
	var circle=new CircleClass(chart.getDrawingArea(),$('#drawCanvasDiv').offset());	
	a2=parseInt(getAngleFromLineToXAxis(circle,e.clientX,e.clientY));
	a1=parseInt(getAngleFromLineToXAxis(circle,parseInt(sessionStorage.x1),parseInt(sessionStorage.y1)));		
	var offsetang=parseInt(sessionStorage._offsetAngle)+a2-a1;
	if(offsetang<0)
	{
		offsetang=offsetang+360;
	}else if(offsetang>360)
	{
		offsetang=offsetang-360;
	}	
	sessionStorage._offsetAngle=offsetang;
	chart.push("offset_angle",offsetang);
	chart.push("animation","false");
	chart.resize(783,400);
	var ang=270-offsetang;
	if(ang<0)
	{
		ang=ang+360;
	}
	left=parseInt(ang/360*size);
	updateSeqPosText();
	show('plasmid-canvas',createTempDataForCanvas(seq.substring(left,left+60),left),60);
}
function saveGraph(){
	var _canvas=document.getElementById(chart.canvasid);
	var data = _canvas.toDataURL("image/png"); 
	var b64 = data.substring(22); 
	//console.log(b64);
	//console.log(document.getElementById("standardSelect").value);
	var w=window.open('about:blank','image from canvas','location=0,directories=0'); 
	w.window.onclose=function(){
		parent.refresh;
	}
	w.document.write("<img src='"+data+"' alt='from canvas'/>");	
}
function isPointInCircle(circle,x,y)
{
	var lengthTemp = lengthBetweenTwoPoint(circle.x, circle.y, x, y);
	console.log(lengthTemp,circle.getInnerRadius(),circle.getRadius());
	if (lengthTemp >= circle.getInnerRadius() && lengthTemp <= circle.getRadius()) {
		return true;
    }
    return false;
}
$(function(){
	window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
	initDrawChart();	
	document.getElementById('seqCurrentText').value=seq.substring(1,61);
	document.getElementById('sequenceDiv').innerHTML=createDivStrByData();		
	//InitAjax();
	testWebSocket();
	//$("#divBody").toolTip();
	//setUpDrag();
	//console.log(document.getElementById());
	//var canvas = document.getElementById(chart.canvasid);
//	var context = chart.target.getContext();
//	//console.log(context);
//	//context.beginPath();
//    //context.strokeStyle = "#000";
//	//context.rect(150, 300, 500, 600);
//	//context.stroke();
//	var img=new Image();
//	img.src="../static/img/glass.jpg";
//	context.drawImage(img,0,0);
//	console.log(context);	
});