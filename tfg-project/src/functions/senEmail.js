import strings from '../assets/files/strings.json';


export async function sendEmail(mark, comment, worklab, studentEmail) {
    const apiUrl = 'http://localhost:4000/sendemail';
    try {

        let subject = strings.emailInfo.subject+'"'+worklab+'"';
        let message = strings.emailInfo.text1+worklab+strings.emailInfo.text2+mark;
        if(comment !== "" || comment !== undefined){
            message = message+strings.emailInfo.text3+'"'+comment+'"';
        }
        
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
            console.log("An error occurred sending email: ", data.error);
            return { response: false, error: data.error, code:data.code};
        }
            
        return { response: true, error: ""};
  } catch (error) {
      return { response: false, error: "Sorry, an error occurred sending email"};
  }
}
