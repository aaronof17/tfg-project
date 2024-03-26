export async function saveMark(work, student, comment, mark) {
    try {
        const response = await fetch('http://localhost:4000/marks/save', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ work: work,
                                student: student,
                                comment: comment,
                                mark: mark
                            })
          });

        const data = await response.json(); 

        if(!data.success){
          console.log("An error occurred saving mark: ", data.error);
          return { response: false, error: data.error};
        }
        
        return { response: true, error: ""};

      } catch (error) {
          return { response: false, error: "Sorry, an error occurred saving mark"};
      }
      
  }