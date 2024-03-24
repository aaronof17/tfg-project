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
        }
        return true;
      } catch (error) {
        console.error('Error saving labWorks:', error);
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
        callback(data);
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
      callback(data);
    } catch (error) {
      console.error('Error getting works by student:', error);
    }
}