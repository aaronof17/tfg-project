

export async function saveTeacherToken(teacherToken, userProfileName) {
    try {
        const response = await fetch('http://localhost:4000/teachers/token', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ token: teacherToken,
                                  profileName: userProfileName})
          });
          
          const data = await response.json(); 

          if(!data.success){
            console.log("An error occurred saving token: ", data.error);
            return { response: false, error: data.error};
          }
          
          return { response: true, error: ""};
  
        } catch (error) {
            return { response: false, error: "Sorry, an error occurred saving token"};
        }
  }


  export async function getTeacherId(callback, profileURL) {
    try {
      console.log("perfil ", profileURL);
        const response = await fetch('http://localhost:4000/teachers/id', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ profileURL: profileURL })
          });
        
        const data = await response.json();
        callback(data.data[0].teacherID);
        return data.data[0].teacherID;
      } catch (error) {
        console.error('Error getting teacher id:', error);
      }
  }


  export async function getTeacherToken(callback, teacherId) {
    try {
        const response = await fetch('http://localhost:4000/teachers/token/id', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ teacherId: teacherId })
          });
        
        const data = await response.json();
        callback(data.data[0].githubToken);
      } catch (error) {
        console.error('Error getting teacher token:', error);
      }
  }


  export async function getTeachers() {
    try {
        const response = await fetch('http://localhost:4000/teachers', {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            }
          });
        
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Error getting teachers:', error);
      }
  }

  export async function getTeacherByGitHubUser(gituser) {
    try {
        const response = await fetch('http://localhost:4000/teachers/gituser', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ gituser: gituser })
        });
      
        
        const data = await response.json();
        return data.data[0].count;
      } catch (error) {
        console.error('Error getting teachers:', error);
      }
  }


  
  export async function getRoleByGitHubUser(gituser) {
    console.log("user ",gituser);
    try {
        const response = await fetch('http://localhost:4000/role/gituser', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ gituser: gituser })
        });
      
        
        const data = await response.json();
        if(data.data.length != 0){
          return data.data[0].user_type
        }else{
          return "";
        }
      } catch (error) {
        console.error('Error getting teachers:', error);
      }
  }