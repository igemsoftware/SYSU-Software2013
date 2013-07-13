var data =  [];
var size=0;
var colors=['#afcc22','#82d8ef','#80bd91'];
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
function getRawData()//to get the raw data of plasmid
{
		
}
$(function(){
	getRawData();
	data=turnRawDatatoData(raw_data);	
	var chart = new iChart.Donut2D({
		animation:true,
		render : 'canvasDiv',//图表渲染的HTML DOM的id
		center:{
			text:raw_data["DnaComponent"]['name']+'\n'+seq.length+'bp',
			shadow:true,
			shadow_offsetx:0,
			shadow_offsety:2,
			shadow_blur:2,
			shadow_color:'#b7b7b7',
			color:'#6f6f6f'
		},
		//offset_angle: 270,
		data: data,//图表的数据源
		offsetx:0,
		shadow:false,
		background_color:'#f4f4f4',
		separate_angle:0,//分离角度
		tip:{
			enable:true,
			showType:'fixed',
			animation:true,
			listeners:{
				parseText:function(tip,name,value,text){
					if(typeof(name)=="number"){
						var str= "";
					}else{
						var str=name+"<br\/>";
					}						
					for(i=0;i<data.length;i++){
						if(data[i]["name"]==name){
							str=str+data[i]["start"]+" to "+data[i]["end"];
							str=str+"<br\/>"+seq.substring(data[i]["start"]-1,data[i]["end"]-1);
							break;
						}
					}
					return str;
				}
			}
		},
		sub_option:{
			/*mini_label_threshold_angle : 40,//迷你label的阀值,单位:角度
			mini_label:{//迷你label配置项
				fontsize:20,
				fontweight:600,
				color : '#ffffff'				
			},*/
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
					if(e["event"]["button"]==0&&typeof(l.get('name'))!="number")
					{
						for(i=0;i<data.length;i++){
							if(data[i]["name"]==l.get('name')){
								window.clipboardData.setData("Text",seq.substring(data[i]["start"]-1,data[i]["end"]-1)); 
								alert(seq.substring(data[i]["start"]-1,data[i]["end"]-1));
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
		decimalsnum:0,
		width : 700,
		height : 400,
		radius:140
	});
	chart.draw();
	//console.log($("#sequenceTxt").val());	
	//console.log(document.getElementById('sequenceTxt').value);
	document.getElementById('sequenceTxt').value=seq;
});