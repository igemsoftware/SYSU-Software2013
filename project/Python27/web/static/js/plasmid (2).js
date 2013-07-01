var data =  [];
var size=0;
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
function turnRawDatatoData(raw)
{
	//var i=raw["DnaComponent"]["annotaions"].length;
	var tempArray=[];
	size=raw["DnaComponent"]["DnaSequence"]["nucleotides"].length;
	for(i=0;i<raw["DnaComponent"]["annotaions"].length;i++)
	{
		tempArray[i]={start:raw["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioStart"]};
		tempArray[i]["name"]=raw["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["subComponent"]["DnaComponent"]["name"];
		tempArray[i]["end"]=raw["DnaComponent"]["annotaions"][i]["SequenceAnnotation"]["bioEnd"];
		tempArray[i]["value"]=parseInt((tempArray[i]["end"]-tempArray[i]["start"])/size*100);
	}	
	console.log(tempArray);
	console.log(size);
	return tempArray;
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
	turnRawDatatoData(raw_data);
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
					var str= name;						
					for(i=0;i<data.length;i++){
						if(data[i]["name"]==name){
							str=str+"<br\/>"+data[i]["rna"];
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
			/*listeners:{
				beforedraw:function(l){
					if(l.bcd){
						return false;
					}
					return true;
				},
				click:function(l,e,m){
					l.bcd=true;
					//手动调用重绘
					chart.draw();
				}
			}*/
		},
		showpercent:true,
		decimalsnum:2,
		width : 800,
		height : 400,
		radius:140
	});
	chart.draw();
});