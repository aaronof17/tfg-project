const strings = require('../assets/files/strings.json');
const CryptoJS = require('crypto-js');

const encryptToken = (token) => {
  const encryptedToken = CryptoJS.AES.encrypt(token, strings.strings.encrypt).toString();
  return encryptedToken;
}

const decryptToken = (encryptedToken) => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, strings.strings.encrypt);
  const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedToken;
}

export async function saveTeacherToken(teacherToken, userProfileName) {
    try {
        const encryptedToken = await encryptToken(teacherToken);
        const response = await fetch(strings.strings.host+'teachers/token', {
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
        const response = await fetch(strings.strings.host+'teachers/id', {
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
        const response = await fetch(strings.strings.host+'teachers/token/id', {
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
        callback(decryptedToken);
      } catch (error) {
        console.error('Error getting teacher token:', error);
      }
  }


  export async function getTeachers() {
    try {
        const response = await fetch(strings.strings.host+'teachers', {
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
        const response = await fetch(strings.strings.host+'teachers/gituser', {
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
    try {
        const response = await fetch(strings.strings.host+'role/gituser', {
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
      console.log("yeih ", localStorage.getItem("accessToken"));
      const response = await fetch(strings.strings.host+'teachers/save', {
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
          console.log("An error occurred saving teacher: ", data.error);
          return { response: false, error: data.error, code:data.code};
        }else {
          return { response: true, error: "" };
        }
    } catch (error) {
        return { response: false, error: "Sorry, an error occurred saving teacher "+error, };
    }
  }


  export async function deleteTeacher(rowToDelete) {
    try {
      const response = await fetch(strings.strings.host+'teachers/delete', {
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
        const response = await fetch(strings.strings.host+'students/id', {
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
        const response = await fetch(strings.strings.host+'teachers/edit', {
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
  