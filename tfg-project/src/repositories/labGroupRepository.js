export async function getLabGroups(callback, teacherID) {
    try {
        const response = await fetch('http://localhost:4000/labGroups', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
            JSON.stringify({ teacherID: teacherID})
        })

        const data = await response.json();
        const groups = data.data.map(group => ({ value: group.idlabGroup, label: group.name }));
        callback(groups);
      } catch (error) {
        console.error('Error getting lab groups:', error);
      }
}


export async function getSubjectsFromGroup(callback, teacherID) {
    try {
        const response = await fetch('http://localhost:4000/subjects', {
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
        console.error('Error getting subjects:', error);
      }
}


export async function getLabGroupsBySubject(actualSubject, teacherID, callback) {
  try {
      const response = await fetch('http://localhost:4000/groups/subject', {
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
      const groups = data.data.map(group => ({ value: group.name, label: group.name }));
      callback(groups);
    } catch (error) {
      console.error('Error getting groups from actual subject:', error);
    }
}

export async function getIdFromGroup(groupName) {
  try {
      const response = await fetch('http://localhost:4000/groups/name', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ groupName: groupName})
      })

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting id from group:', error);
    }
}
