import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";


import './AddTeachers.css';

function AddTeachers({userData}) {
    const [t] = useTranslation();
    const [teacherID, setTeacherID] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState("");
    const [repository, setRepository] = useState("");
    const [subject, setSubject] = useState("");
    const [group, setGroup] = useState("");
    const [labGroups, setLabGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [rewriteModalOpen, setRewriteModalOpen] = useState(false);
    const [studentId, setStudentId] = useState(null);


    useEffect(() => {
        const fetchInfo = async () => {
          console.log(userData);
            // const id = await getTeacherId(setTeacherID,userData.login);
            // getLabGroups(setLabGroups,id);
            // getSubjectsFromGroup(setSubjects,id);
        };
    
        fetchInfo();
      }, []);



  return (
    <div className='teachers-add-div'>
      <p>Teachers</p>
    </div>
  );
}


export default AddTeachers;
