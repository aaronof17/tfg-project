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


  export async function editMark(work, student, comment, mark) {
    try {
        const response = await fetch('http://localhost:4000/marks/edit', {
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
          console.log("An error occurred editing mark: ", data.error);
          return { response: false, error: data.error};
        }
        
        return { response: true, error: ""};

      } catch (error) {
          return { response: false, error: "Sorry, an error occurred editing mark"};
      }
      
  }


export async function getMarkByWorkAndStudent(work, student) {
  try {
    const response = await fetch('http://localhost:4000/marks/work/student', {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        "Content-Type": "application/json"
      },
      body:
          JSON.stringify({ work: work,
                          student: student
                      })
    });
      
      const data = await response.json();

      if(!data.success){
        console.log("An error occurred geting mark id: ", data.error);
        return { response: false, error: data.error};
      }
      
      return { response: true, data:data.data[0].count, error: ""};
      return data;
    } catch (error) {
      console.error('Error getting marks from student:', error);
    }
}
