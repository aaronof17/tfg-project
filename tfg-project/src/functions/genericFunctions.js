

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

  export function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return `${year}-${month}-${day} ${hours}:${minutes}`;
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
    

export function extractId(cadena){
    const match = cadena.match(/\d+/);
    if (match) {
        return parseInt(match[0]);
    } else {
        return null;
    }
}


export function extractDuplicateEntry(text) {
    const regex = /Error saving: Duplicate entry '([^']+)'/;
    const match = text.match(regex);
    if (match && match.length > 1) {
      return match[1];
    } else {
      return null;
    }
  }