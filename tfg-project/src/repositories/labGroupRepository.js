export async function getLabGroups(callback) {
    try {
        const response = await fetch('http://localhost:4000/labGroups', {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            }

        })

        const data = await response.json();
        const groups = data.map(group => ({ value: group.name, label: group.name }));
        callback(groups);
      } catch (error) {
        console.error('Error getting lab groups:', error);
      }
}


export async function getSubjectsFromGroup(callback) {
    try {
        const response = await fetch('http://localhost:4000/subjects', {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            }

        })

        const data = await response.json();
        callback(data);
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
      const groups = data.map(group => ({ value: group.name, label: group.name }));
      callback(groups);
    } catch (error) {
      console.error('Error getting groups from actual subject:', error);
    }
}