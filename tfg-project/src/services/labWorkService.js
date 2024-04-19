import {formatDate} from '../functions/genericFunctions.js';

export async function saveWorks(datesFromWorks, title, description, percentage,teacherID) {
    try {
      for(var i = 0; i < datesFromWorks.length; i++){
        const response = await fetch('http://localhost:4000/works/save', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ teacherID: teacherID,
                                name: datesFromWorks[i].labGroupName,
                                initialDate: datesFromWorks[i].initialDate,
                                finalDate: datesFromWorks[i].finalDate,
                                title: title,
                                description: description,
                                percentage: percentage
                            })
          });
        
          const data = await response.json(); 

          if(!data.success){
            console.log("An error occurred saving mark: ", data.error);
            return { response: false, error: data.error};
          }
      }
      return { response: true, error: ""};

      } catch (error) {
          return { response: false, error: "Sorry, an error occurred saving mark"};
      }
  }



export async function getLabWorks(callback, teacherID) {
    try {
        const response = await fetch('http://localhost:4000/works', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ teacherID: teacherID})

        })

        const data = await response.json();
        callback(data.data);
      } catch (error) {
        console.error('Error getting lab groups:', error);
      }
}
  

export async function getWorksByStudent(studentEmail, callback, teacherID) {
  try {
      const response = await fetch('http://localhost:4000/works/student', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ teacherID: teacherID,
                      studentEmail: studentEmail})

      })

      const data = await response.json();
      callback(data.data);
    } catch (error) {
      console.error('Error getting works by student:', error);
    }
}


export async function getWorksByStudentId(callback, studentId) {
  try {
      const response = await fetch('http://localhost:4000/works/student/id', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ studentId: studentId})
      })

      const data = await response.json();
      callback(data.data);
    } catch (error) {
      console.error('Error getting works by student id:', error);
    }
}


export async function editWork(editRow) {
  try {
      const response = await fetch('http://localhost:4000/works/edit', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ worklabID: editRow.worklabID,
                            title: editRow.title,
                            description: editRow.description,
                            percentage: editRow.percentage,
                            initialdate: formatDate(editRow.initialdate),
                            finaldate: formatDate(editRow.finaldate)
                          })
        });
      
    const data = await response.json(); 

    if(!data.success){
      console.log("An error occurred editing work: ", data.error);
      return { response: false, error: data.error};
    }
      
    return { response: true, error: ""};

    } catch (error) {
        return { response: false, error: "Sorry, an error occurred editing work"};
    }
}


export async function deleteWork(id) {
  try {
      const response = await fetch('http://localhost:4000/works/delete', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ worklabID: id})
        });
      
    const data = await response.json(); 

    if(!data.success){
      console.log("An error occurred deleting work: ", data.error);
      return { response: false, error: data.error};
    }
      
    return { response: true, error: ""};

    } catch (error) {
        return { response: false, error: "Sorry, an error occurred deleting work"};
    }
}
