export async function getLabGroups(callback) {
    try {
        const response = await fetch('http://localhost:4000/labGroups', {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            }

        })
        console.log(response);

        const data = await response.json();
        console.log(data);
        callback(data);
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
        console.log(response);

        const data = await response.json();
        console.log(data);
        callback(data);
      } catch (error) {
        console.error('Error getting subjects:', error);
      }
}
