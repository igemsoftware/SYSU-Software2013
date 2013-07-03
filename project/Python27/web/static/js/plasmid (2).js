var data =  [];
var size=0;
var colors=['#82d8ef','#80bd91'];
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
var seq=raw_data["DnaComponent"]["DnaSequence"]["nucleotides"];
function sortNumber(a, b)
{
	return a["start"] - b["start"];
}
/*
* 长字符串换行
* @ bigString 长字符串
* @ m   换行长度
* @ b   分隔符
* @ c   是否强制换行
*
*/
function divBigString(bigString, m, b, c){
	var i, j, s, r = bigString.split("\n");
	if(m > 0) for(i in r){
		for(s = r[i], r[i] = ""; s.length > m;
			j = c ? m : (j = s.substr(0, m).match(/\S*$/)).input.length - j[0].length
			|| m,
			r[i] += s.substr(0, j) + ((s = s.substr(j)).length ? b : "")
		);
		r[i] += s;
	}
	return r.join("\n");
}
function turnRawDatatoData(raw)
{
	var tempArray=[];
	size=raw["DnaComponent"]["DnaSequence"]["nucleotides"].length;
	for(i=0;i<raw["DnaComponent"]["annotaions"].length;i++)
	{
		tempArray[i]={};
		tempArray[i]["start"]=parseInt(raw["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioStart"]);
		tempArray[i]["name"]=raw["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["subComponent"]["DnaComponent"]["name"];
		tempArray[i]["end"]=parseInt(raw["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioEnd"]);
		tempArray[i]["value"]=parseInt((tempArray[i]["end"]-tempArray[i]["start"])/size*100);
	}		
	tempArray=tempArray.sort(sortNumber);
	var real_data=[];
	var start=1;
	var index=0;
	for(i=0;i<tempArray.length;i++)
	{
		real_data[index]={name:index,color:"#f4f4f4"};
		real_data[index]["start"]=start;
		real_data[index]["end"]=tempArray[i]["start"]-1;		
		real_data[index]["value"]=parseInt((real_data[real_data.length-1]["end"]-real_data[real_data.length-1]["start"])/size*100);
		if(real_data[index]["value"]==0)
			real_data[index]["value"]=1;
		index=index+1;
		real_data[index]=tempArray[i];
		real_data[index]["color"]=colors[i%2];
		index=index+1;
		start=tempArray[i]["end"]+1;
		if(i==tempArray.length-1)
		{
			real_data[index]={name:index,color:"#f4f4f4"};
			real_data[index]["start"]=start;
			real_data[index]["end"]=size-1;
			real_data[index]["value"]=parseInt((real_data[real_data.length-1]["end"]-real_data[real_data.length-1]["start"])/size*100);
		}
	}	
	console.log(real_data);
	tempArray=null;
	return real_data;
}
function copy(text2copy) 
{ 
    var flashcopier = 'flashcopier'; 
	if(!document.getElementById(flashcopier)) 
    { 
        var divholder = document.createElement('div'); 
        divholder.id = flashcopier; 
        document.body.appendChild(divholder); 
    } 
	document.getElementById(flashcopier).innerHTML = ''; 
	var divinfo = '<embed src="http://files.jb51.net/demoimg/200910/_clipboard.swf" FlashVars="clipboard='+text2copy+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';//这里是关键 
	document.getElementById(flashcopier).innerHTML = divinfo;     
} 
function getData()//to get the real data of plasmid
{
	data = [
		{name : 'HTML5&CSS3',value : 6,color:'#f4f4f4',rna:'0 to 48'},
		{name : 'JavaScript',value : 83,color:'#82d8ef',rna:'49 to 730'},
		{name : 'Java',value : 1,color:'#f4f4f4',rna:'731 to 735'},
		{name : 'XML',value : 6,color:'#80bd91',rna:'736 to 782'},
		{name : 'PhotoShop',value : 4,color:'#f4f4f4',rna:'783 to 812'}
	];
	
}
$(function(){
	getData();
	data=turnRawDatatoData(raw_data);
	console.log(data);
	var chart = new iChart.Donut2D({
		animation:true,
		render : 'canvasDiv',//图表渲染的HTML DOM的id
		/*center:{
			text:'CORE\nSKILLS',
			shadow:true,
			shadow_offsetx:0,
			shadow_offsety:2,
			shadow_blur:2,
			shadow_color:'#b7b7b7',
			color:'#6f6f6f'
		},*/
		//offset_angle: 270,
		data: data,//图表的数据源
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
					if(typeof(name)=="number"){
						var str= "";
					}else{
						var str=name;
					}						
					for(i=0;i<data.length;i++){
						if(data[i]["name"]==name){
							str=str+"<br\/>"+data[i]["start"]+" to "+data[i]["end"];
							str=str+"<br\/>"+seq.substring(data[i]["start"],data[i]["end"]);
							break;
						}
					}
					return str;
				}
			}
		},
		/*legend : {
			enable : true,
			shadow:true,
			background_color:null,
			border:false,
			legend_space:30,//图例间距
			line_height:34,//设置行高
			sign_space:10,//小图标与文本间距
			sign_size:30,//小图标大小
			color:'#6f6f6f',
			fontsize:30//文本大小
		},*/
		sub_option:{
			label:false,
			color_factor : 0.3,
			listeners:{
				/*beforedraw:function(l){
					if(l.bcd){
						return false;
					}
					return true;
				},*/
				click:function(l,e,m){
					//console.log(typeof(l.get('name')));
					if(e["event"]["button"]==0&&typeof(l.get('name'))!="number")
					{
						for(i=0;i<data.length;i++){
							if(data[i]["name"]==l.get('name')){
								//copy(seq.substring(data[i]["start"],data[i]["end"]));
								window.clipboardData.setData("Text",seq.substring(data[i]["start"],data[i]["end"])); 
								//CopyToClipBoard(seq.substring(data[i]["start"],data[i]["end"]));
								alert(seq.substring(data[i]["start"],data[i]["end"]));
								break;
							}
						}
					}
					//console.log(e);
					//手动调用重绘
					//chart.draw();
				}
			}
		},
		showpercent:true,
		decimalsnum:2,
		width : 800,
		height : 400,
		radius:140
	});
	chart.draw();
});