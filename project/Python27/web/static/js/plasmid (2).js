var data =  [];
function getData()//to get the real data of plasmid
{
	data = [
		{name : 'HTML5&CSS3',value : 30,color:'#fedd74',rna:'ab1'},
		{name : 'JavaScript',value : 25,color:'#82d8ef',rna:'ab2'},
		{name : 'Java',value : 15,color:'#f76864',rna:'ab3'},
		{name : 'XML',value : 20,color:'#80bd91',rna:'ab4e'},
		{name : 'PhotoShop',value : 10,color:'#fd9fc1',rna:'ab5'}
	];
}
$(function(){
	getData();
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
		data: data,//图表的数据源
		offsetx:-60,
		shadow:true,
		background_color:'#f4f4f4',
		separate_angle:10,//分离角度
		tip:{
			enable:true,
			showType:'fixed',
			animation:true,
			fade_duration:700,
			listeners:{
				parseText:function(tip,name,value,text){
					var str= name;						
					for(i=0;i<data.length;i++){
						if(data[i]["name"]==name){
							str=str+"<br\/>"+data[i]["rna"];
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