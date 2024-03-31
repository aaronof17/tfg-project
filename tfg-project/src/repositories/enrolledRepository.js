export async function saveEnrolled(studentId, groupId, repository) {
    try {
        const response = await fetch('http://localhost:4000/enrolled/save', {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ studentId: studentId,
                                groupId: groupId,
                                repository: repository
                            })
        });
    
        const data = await response.json(); 

        if(!data.success){
            console.log("An error occurred saving enrolled: ", data.error);
            return { response: false, error: data.error};
        }
        return { response: true, error: ""};

      } catch (error) {
          return { response: false, error: "Sorry, an error occurred saving enrolled"};
      }
  }
