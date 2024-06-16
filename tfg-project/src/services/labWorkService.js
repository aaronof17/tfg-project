import {formatDate} from '../functions/genericFunctions.js';
import strings from '../assets/files/strings.json';

export async function saveWorks(datesFromWorks, title, description, percentage,teacherID) {
    try {
      for(var i = 0; i < datesFromWorks.length; i++){
        const response = await fetch(strings.strings.host+'works/save', {
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
            return { response: false, error: data.error, code:data.code};
          }
      }
      return { response: true, error: ""};

      } catch (error) {
          return { response: false, error: "Sorry, an error occurred saving mark"};
      }
  }



export async function getLabWorks(callback, teacherID) {
    try {
        const response = await fetch(strings.strings.host+'works', {
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


export async function getActiveLabWorks(callback, teacherID) {
  try {
      const response = await fetch(strings.strings.host+'works/active', {
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
      console.error('Error getting active lab groups:', error);
    }
}
  

export async function getWorksByStudent(studentEmail, callback, teacherID) {
  try {
      const response = await fetch(strings.strings.host+'works/student', {
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
      console.error('Error getting works for student:', error);
    }
}


export async function getWorksByGroup(groupName, callback, teacherID) {
  try {
      const response = await fetch(strings.strings.host+'works/group', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ teacherID: teacherID,
                          groupName: groupName})

      })

      const data = await response.json();
      callback(data.data);
    } catch (error) {
      console.error('Error getting works by group:', error);
    }
}


export async function getWorksBySubject(subject, callback, teacherID) {
  try {
      const response = await fetch(strings.strings.host+'works/subject', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ teacherID: teacherID,
                          subject: subject})
      })

      const data = await response.json();
      callback(data.data);
    } catch (error) {
      console.error('Error getting works by subject:', error);
    }
}

export async function getWorksByStudentAndGroup(studentId, labgroupName, teacherID) {
  try {
      const response = await fetch(strings.strings.host+'works/student/group', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ teacherID: teacherID,
                              studentId: studentId,
                              group: labgroupName})

      })

      const data = await response.json();
      if(!data.success){
        return { response: false, error: data.error};
      }
        
      return { response: true, data:data.data , error: ""};
    } catch (error) {
      console.error('Error getting works for student:', error);
    }
}


export async function getWorksAndMarksByStudentAndGroup(studentId, labgroupName, teacherID) {
  try {
      const response = await fetch(strings.strings.host+'works/marks/student/group', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ teacherID: teacherID,
                              studentId: studentId,
                              group: labgroupName})

      })

      const data = await response.json();
      if(!data.success){
        return { response: false, error: data.error};
      }
        
      return { response: true, data:data.data , error: ""};
    } catch (error) {
      console.error('Error getting works and marks for student:', error);
    }
}

export async function getWorksByStudentId(callback, studentId) {
  try {
      const response = await fetch(strings.strings.host+'works/student/id', {
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

export async function getWorksBySubjectAndStudent(subject ,callback, studentId) {
  try {
      const response = await fetch(strings.strings.host+'works/student/subject', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ studentId: studentId,
                                subject: subject})
      })

      const data = await response.json();
      callback(data.data);
    } catch (error) {
      console.error('Error getting works by student id and subject:', error);
    }
}


export async function editWork(editRow) {
  try {
      const response = await fetch(strings.strings.host+'works/edit', {
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
                            finaldate: formatDate(editRow.finaldate),
                            active: editRow.active
                          })
        });
      
    const data = await response.json(); 

    if(!data.success){
      return { response: false, error: data.error, code:data.code};
    }
      
    return { response: true, error: ""};

    } catch (error) {
        return { response: false, error: "Sorry, an error occurred editing work"};
    }
}


export async function deleteWork(id) {
  try {
      const response = await fetch(strings.strings.host+'works/delete', {
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
      return { response: false, error: data.error};
    }
      
    return { response: true, error: ""};

    } catch (error) {
        return { response: false, error: "Sorry, an error occurred deleting work"};
    }
}
