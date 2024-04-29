import * as CryptoJS from 'crypto-js';

const encryptToken = (token) => {
  const encryptedToken = CryptoJS.AES.encrypt(token, 'z8Y#rT@6Mv!yP$qX').toString();
  return encryptedToken;
}

const decryptToken = (encryptedToken) => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, 'z8Y#rT@6Mv!yP$qX');
  const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedToken;
}

export async function saveTeacherToken(teacherToken, userProfileName) {
    try {
        const encryptedToken = await encryptToken(teacherToken);
        const response = await fetch('http://localhost:4000/teachers/token', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ token: encryptedToken,
                                  profileName: userProfileName})
          });
          
          const data = await response.json(); 

          if(!data.success){
            console.log("An error occurred saving token: ", data.error);
            return { response: false, error: data.error, code:data.code};
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
        const decryptedToken = await decryptToken(data.data[0].githubToken);
        console.log("TOKEN ",decryptedToken);
        callback(decryptedToken);
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

  export async function saveTeacher(name, email, user) {
    try {
  
      const response = await fetch('http://localhost:4000/teachers/save', {
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
        console.log("data ",data);
        if(!data.success){
          console.log("An error occurred saving teacher: ", data.error);
          return { response: false, error: data.error, code:data.code};
        }else {
          return { response: true, error: "" };
        }
    } catch (error) {
        return { response: false, error: "Sorry, an error occurred saving teacher"};
    }
  }


  export async function deleteTeacher(rowToDelete) {
    try {
      const response = await fetch('http://localhost:4000/teachers/delete', {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          },
          body:
              JSON.stringify({email: rowToDelete.email})
        });
      
        const data = await response.json(); 
  
        if(!data.success){
          console.log("An error occurred deleting teacher: ", data.error);
          return { response: false, error: data.error};
        }
        return { response: true, error: ""};
  
    } catch (error) {
        return { response: false, error: "Sorry, an error occurred deleting teacher"};
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
  
  export async function editTeacher(editRow) {
    try {
        const response = await fetch('http://localhost:4000/teachers/edit', {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json"
            },
            body:
                JSON.stringify({
                              teacherID: editRow.id,
                              name: editRow.name,
                              email: editRow.email,
                              githubuser: editRow.githubProfile
                            })
          });
        
      const data = await response.json(); 
  
      if(!data.success){
        console.log("An error occurred editing teacher: ", data.error);
        return { response: false, error: data.error, code:data.code};
      }
        
      return { response: true, error: ""};
  
      } catch (error) {
          return { response: false, error: "Sorry, an error occurred editing teacher"};
      }
}
  