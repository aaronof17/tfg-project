import { saveEnrolled } from "./enrolledRepository";

export async function getStudents(callback, teacherID) {
    try {
        const response = await fetch('http://localhost:4000/students/teacher', {
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
        console.error('Error getting students:', error);
      }
}
  

export async function getStudentsByWork(actualWork, callback, teacherID) {
    try {
        console.log(actualWork);
        const response = await fetch('http://localhost:4000/students/work', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ teacherID: teacherID,
                            actualWork: actualWork})

        })

        const data = await response.json();
        callback(data.data);
      } catch (error) {
        console.error('Error getting students by work:', error);
      }
}



export async function saveStudent(name, email, user, repository, groupId) {
  try {

    const response = await fetch('http://localhost:4000/students/save', {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        },
        body:
            JSON.stringify({ name: name,
                            email: email,
                            user: user
                        })
      });
    
      const data = await response.json(); 

      if(!data.success){
        console.log("An error occurred saving student: ", data.error);
        return { response: false, error: data.error};
      }else {
        const enrolledResponse = await saveEnrolled(data.data.insertId, groupId, repository);
        if (enrolledResponse.response) {
          return { response: true, error: "" };
        } else {
          return { response: false, error: enrolledResponse.error };
        }
      }
  } catch (error) {
      return { response: false, error: "Sorry, an error occurred saving student"};
  }
}

