import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getTeacherId} from "../../../../repositories/teacherRepository.js";
import {getLabGroups,getSubjectsFromGroup} from "../../../../repositories/labGroupRepository.js";
import {saveStudent} from "../../../../repositories/studentRepository.js";
import {ToastContainer, toast} from "react-toastify";

import StudentInfo from './StudentInfo.js';
import StudentGroup from './StudentGroup.js';
import CsvModal from './CsvModal.js';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './AddStudents.css';

function AddStudents({userData}) {
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


    useEffect(() => {
        const fetchInfo = async () => {
            const id = await getTeacherId(setTeacherID,userData.html_url);
            getLabGroups(setLabGroups,id);
            getSubjectsFromGroup(setSubjects,id);
        };
    
        fetchInfo();
      }, []);

    function saveCsv(){
        setModalOpen(true);
    }

    const handleSaveCsv = () => {
       
    };

    function saveStudentInfo(){
      if(name === "" || email === "" ||user === ""
          || repository === "" || group === ""){
        toast.error(t('addStudents.dataBlank'));
      }else{
           saveStudent(name,email,user,repository,group).then((res)=>{
              if(res.response){
                  toast.info(t('addStudents.studentSaved'));
                }else{
                  toast.error(res.error); 
                }
          });
      }
    }


  return (
    <div className='students-add-div'>
        <StudentInfo setName={setName} setEmail={setEmail} setUser={setUser} setRepository={setRepository}></StudentInfo>
        <StudentGroup labGroups={labGroups} setLabGroups={setLabGroups} subjects={subjects} 
            setSubject={setSubject} setGroup={setGroup} teacherID={teacherID}>
        </StudentGroup>
        <div className='students-add-buttons'>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" onClick={saveStudentInfo}>
                        {"Guardar"}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" onClick={saveCsv} >
                        {"Cargar CSV"}
                    </Button>
                </Grid>
                <Grid item xs={4}>
                </Grid>
            </Grid>
        </div>
        {modalOpen && (
          <CsvModal
            closeModal={() => {
              setModalOpen(false);
            }}
            onSubmit={handleSaveCsv}
          />
        )}
        <ToastContainer className="custom-toast-container"/>
    </div>
  );
}


export default AddStudents;
