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
        callback(data);
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
        callback(data);
      } catch (error) {
        console.error('Error getting students by work:', error);
      }
}