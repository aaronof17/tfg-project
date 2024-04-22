import { saveEnrolled } from "./enrolledService";
import {extractId} from "../functions/genericFunctions"

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
        console.log("Students ",data.data);
        callback(data.data);
        return data.data;
      } catch (error) {
        console.error('Error getting students:', error);
      }
}

export async function getStudentsBySubject(teacherID, subject) {
  try {
      const response = await fetch('http://localhost:4000/students/teacher/subject', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ teacherID: teacherID,
                              subject:subject})
      })

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error getting students by subject:', error);
    }
}



export async function getStudentsWithoutRepo(callback, teacherID) {
  try {
      const response = await fetch('http://localhost:4000/students/teacher/repo', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ teacherID: teacherID})

      })

      const data = await response.json();
      console.log("students ", data.data);
      callback(data.data);
    } catch (error) {
      console.error('Error getting students:', error);
    }
}

  

export async function getStudentsByWork(group, callback, teacherID) {
    try {
      console.log("grupo", group);
        const response = await fetch('http://localhost:4000/students/work', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ teacherID: teacherID,
                            group: group})

        })

        const data = await response.json();
        callback(data.data);
        return data.data;
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


export async function deleteStudent(rowToDelete) {
  try {
    const response = await fetch('http://localhost:4000/students/delete', {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        },
        body:
            JSON.stringify({studentID: extractId(rowToDelete.id),
                            group: rowToDelete.group})
      });
    
      const data = await response.json(); 

      if(!data.success){
        console.log("An error occurred deleting student: ", data.error);
        return { response: false, error: data.error};
      }
      return { response: true, error: ""};

  } catch (error) {
      return { response: false, error: "Sorry, an error occurred deleting student"};
  }
}

export async function getIdByEmail(email) {
  try {
    const response = await fetch('http://localhost:4000/students/email', {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        "Content-Type": "application/json"
      },
      body:
          JSON.stringify({ email: email})
    });
      
      const data = await response.json();

      if(!data.success){
        console.log("An error occurred geting email: ", data.error);
        return { response: false, error: data.error};
      }
      if(data.data.length === 0){
        return { response: true, data:"undefined", error: ""};
      }else{
        return { response: true, data:data.data[0].studentsID, error: ""};
      }
      return data;
    } catch (error) {
      console.error('Error getting email:', error);
    }
}

export async function getStundentId(callback, githubUser) {
  try {
      const response = await fetch('http://localhost:4000/students/id', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ githubUser: githubUser })
        });
      
      const data = await response.json();
      callback(data.data[0].studentsID);
      return data.data[0].studentsID;
    } catch (error) {
      console.error('Error getting student id:', error);
    }
}

export async function editStudent(editRow) {
  try {
      const response = await fetch('http://localhost:4000/students/edit', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ studentId: extractId(editRow.id),
                            name: editRow.name,
                            email: editRow.email,
                            githubuser: editRow.githubuser,
                            repository: editRow.repository,
                            group: editRow.group
                          })
        });
      
    const data = await response.json(); 

    if(!data.success){
      console.log("An error occurred editing student: ", data.error);
      return { response: false, error: data.error};
    }
      
    return { response: true, error: ""};

    } catch (error) {
        return { response: false, error: "Sorry, an error occurred editing student"};
    }
}

