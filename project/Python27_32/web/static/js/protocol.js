//get element's id with '$(id)' method
function $(){
    var elements = new Array();
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == 'string') 
            element = document.getElementById(element);
        if (arguments.length == 1) 
            return element;
        elements.push(element);
    }
    return elements;
}
//get ele's className
function getElementsByClassName(className, tagName){
    var ele = [], all = document.getElementsByTagName(tagName || '*');
    for (var i = 0; i < all.length; i++) {
        if (all[i].className == className) {
            ele[ele.length] = all[i];
        }
    }
    return ele;
}
var category=$('J_category'),popCategory=$('J_popCategory'),
cateLi=category.getElementsByTagName('li'),subItems=getElementsByClassName('sub-item','div');

category.onclick=function(){
   popCategory.style.display='block';
};

for(var i=0; i<cateLi.length; i++){
  cateLi[i].index=i;
  cateLi[i].onclick=function(){
   for(var j=0; j<subItems.length; j++){
     subItems[j].style.display='none';
     cateLi[j].style.background='#66CCFF';
   }
   cateLi[this.index].style.background='#ECECEC';
   subItems[this.index].style.display='block';
  };
}
