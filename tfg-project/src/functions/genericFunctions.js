

export function getJSON(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

export function calculateWidth(list, lower=false){
    const longestOption = Math.max(...list.map(option => option.length));
    const approximateCharWidth = 9; 
    if(lower){
        return longestOption * approximateCharWidth * 1.5;
    }else{
        return longestOption * approximateCharWidth;
    }
    
  };
 

