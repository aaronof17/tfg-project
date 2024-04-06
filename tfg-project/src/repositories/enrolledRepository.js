import { getIdFromGroup } from "./labGroupRepository";


export async function saveEnrolled(studentId, groupId, repository) {
    try {
        let id = groupId;
        if(isNaN(groupId)){
            const groupIdResponse = await getIdFromGroup(groupId);
            if (!groupIdResponse.success) {
                return { response: false, error: groupIdResponse.error };
            } else {
                id = groupIdResponse.data[0].idlabgroup;
            }
        }

        const response = await fetch('http://localhost:4000/enrolled/save', {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                "Content-Type": "application/json"
            },
            body:
                JSON.stringify({ studentId: studentId,
                                groupId: id,
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
          return { response: false, error: "Sorry, an error occurred saving enrolled "+error};
      }
  }
