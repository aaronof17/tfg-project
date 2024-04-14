

export function getJSON(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

export function calculateWidth(list, uppercase=false, itsURL=false){
    const longestOption = Math.max(...list.map(option => option.length));
    let approximateCharWidth = 9; 
    if(uppercase){
        return longestOption * approximateCharWidth * 2;
    }else if(itsURL){
        approximateCharWidth = 5;
        return longestOption * approximateCharWidth;
    }else{
        return longestOption * approximateCharWidth;
    }
    
  };

  export function formatDate (dateString){
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  };
 

  export function getDateFormat(day,month,year){
    return year+"-"+month+"-"+day;
  }


  export function getTableInformation() {
    const tableRows = document.querySelectorAll('.table tbody tr');
    const labWorkDetails = [];

    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const labGroupName = cells[0].textContent;
        const initialDate = cells[1].querySelector('input').value;
        const finalDate = cells[2].querySelector('input').value;

        labWorkDetails.push({
            labGroupName,
            initialDate,
            finalDate
        });
    });

    return labWorkDetails;
}


export function getInfoFromFilterMark(str) {
    var partes = str.split('-');
    var segundaCadena = partes[1].trim();
    return segundaCadena;
}


export function getRepositoryName(url) {
    const partes = url.split('/');
    console.log("repositorio ",partes[partes.length - 1]);
    return partes[partes.length - 1];
}


export function getSubjectsForComboBox(subjects) {
    let options = [];
    if(subjects != undefined){
        subjects.map((subject,index) => {
            options[index] = subject.subject;
      });
    }     
    return options;
}
    