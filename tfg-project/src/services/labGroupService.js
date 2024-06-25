import strings from '../assets/files/strings.json';

export async function getTeacherLabGroups(callback, teacherID) {
  try {
      const response = await fetch(strings.strings.host+'groups/teacher', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
          JSON.stringify({ teacherID: teacherID})
      })

      const data = await response.json();

      if(!data.success){
        callback([]);
      }else{
        const groups = data.data.map(group => ({ value: group.idlabGroup, label: group.name }));
        callback(groups);
      }

    } catch (error) {
      console.error('Error getting lab groups:', error);
    }
}


export async function editLabGroup(editRow) {
  try {
      const response = await fetch(strings.strings.host+'groups/edit', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({
                            groupID: editRow.id,
                            name: editRow.name,
                            subject: editRow.subject,
                            teacherID: editRow.teacherName.value
                          })
        });
      
    const data = await response.json(); 

    if(!data.success){
      return { response: false, error: data.error, code:data.code};
    }
      
    return { response: true, error: ""};

    } catch (error) {
        return { response: false, error: "Sorry, an error occurred editing lab group"};
    }
}



export async function deleteLabGroup(rowToDelete) {
  try {
    const response = await fetch(strings.strings.host+'groups/delete', {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        },
        body:
            JSON.stringify({groupName: rowToDelete.name})
      });
    
      const data = await response.json(); 

      if(!data.success){
        return { response: false, error: data.error};
      }
      return { response: true, error: ""};

  } catch (error) {
      return { response: false, error: "Sorry, an error occurred deleting lab group"};
  }
}


export async function getLabGroups() {
  try {
      const response = await fetch(strings.strings.host+'groups', {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          }
      })

      const data = await response.json();

      if(!data.success){
        return [];
      }

      return data.data;
    } catch (error) {
      console.error('Error getting lab groups:', error);
    }
}


export async function getSubjectsFromGroup(callback, teacherID) {
    try {
        const response = await fetch(strings.strings.host+'subjects', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
            JSON.stringify({ teacherID: teacherID})
        })

        const data = await response.json();

        if(!data.success){
          callback([]);
        }else{
          callback(data.data);
        }
        
      } catch (error) {
        console.error('Error getting subjects:', error);
      }
}


export async function getSubjectsForStudent(callback, studentID) {
  try {
      const response = await fetch(strings.strings.host+'subjects/student', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
          JSON.stringify({ studentID: studentID})
      })

      const data = await response.json();

      if(!data.success){
        callback([]);
      }else{
        callback(data.data);
      }

    } catch (error) {
      console.error('Error getting subjects for student:', error);
    }
}


export async function getLabGroupsBySubject(actualSubject, teacherID, callback) {
  try {
      const response = await fetch(strings.strings.host+'groups/subject', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ actualSubject: actualSubject,
                               teacherID: teacherID})
      })

      const data = await response.json();

      if(!data.success){
        callback([]);
      }else{
        const groups = data.data.map(group => ({ value: group.idlabGroup, label: group.name }));
        callback(groups);
      }

    } catch (error) {
      console.error('Error getting groups from actual subject:', error);
    }
}

export async function getIdFromGroup(groupName) {
  try {
      const response = await fetch(strings.strings.host+'groups/name', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ groupName: groupName})
      })

      const data = await response.json();

      if(!data.success){
        return "error";
      }

      return data;
    } catch (error) {
      console.error('Error getting id from group:', error);
    }
}

export async function saveLabGroup(groupName, subject, teacherAssigned) {
  try {

    const response = await fetch(strings.strings.host+'groups/save', {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        },
        body:
            JSON.stringify({ name: groupName,
                            subject: subject,
                            teacherAssigned: teacherAssigned
                          })
      });
    
      const data = await response.json(); 
      if(!data.success){
        return { response: false, error: data.error, code:data.code};
      }else {
        return { response: true, error: "" };
      }
  } catch (error) {
      return { response: false, error: "Sorry, an error occurred saving lab group"};
  }
}
