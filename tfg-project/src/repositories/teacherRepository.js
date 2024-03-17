

export async function saveTeacherToken(teacherToken) {
    try {
        console.log(teacherToken);
        const response = await fetch('http://localhost:4000/teachers/token', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ token: teacherToken })
          });
   
      } catch (error) {
        console.error('Error saving token:', error);
      }
  }


  
// export async function saveTeacherToken(token) {
//     try {
//         const formData = new FormData();
//         formData.append("token",token);
//         fetch('http://localhost:4000/teachers/token',formData)
//         .then(res => res.json())
//         .then(data => console.log(data))
//         .catch(err => console.log("Error saving token", err))
    
   
//       } catch (error) {
//         console.error('Error saving token:', error);
//       }
//   }
