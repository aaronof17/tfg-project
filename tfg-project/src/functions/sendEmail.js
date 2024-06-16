import strings from '../assets/files/strings.json';


export async function sendEmail(mark, comment, worklab, studentEmail) {
    const apiUrl = strings.strings.host+'sendemail';
    try {

        let subject = strings.emailInfo.subject+'"'+worklab+'"';
        
        let message = `
            <a href="http://156.35.98.77:3001">Puedes ver tu nota aquí</a>
            <br>
            <ul>
                <li>Práctica: ${worklab}</li>
                <li>Calificación: ${mark}</li>
                ${comment ? `<li>Comentario: "${comment}"</li>` : ''}
            </ul>
        `;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization" : "Bearer "+ localStorage.getItem("accessToken"),
                "Content-Type": "application/json"
            },
            body:
            JSON.stringify({ studentEmail: studentEmail,
                            subject: subject,
                            message:message
                            })
      });
    
        const data = await response.json(); 

        if(!data.success){
            return { response: false, error: data.error, code:data.code};
        }
            
        return { response: true, error: ""};
  } catch (error) {
      return { response: false, error: "Sorry, an error occurred sending email"};
  }
}
