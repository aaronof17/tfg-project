import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";

import SelectableList from "./SelectableList.js";
import {createIssue} from "../../../../functions/gitHubFunctions.js";
import {getLabGroups,getSubjectsFromGroup, getLabGroupsBySubject} from "../../../../service/labGroupService.js";
import {getStudents, getStudentsBySubject, getStudentsByWork} from "../../../../service/studentService.js";
import {getTeacherId, getTeacherToken} from "../../../../service/teacherService.js";
import {getSubjectsForComboBox,getRepositoryName} from "../../../../functions/genericFunctions.js";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {toast} from "react-toastify";

import './MakeIssue.css';
import CreateIssueModal from './CreateIssueModal.js';

function MakeIssue({userData}) {

  const [groups, setLabGroups] = useState();
  const [subjects, setSubjects] = useState();
  const [teacherID, setTeacherID] = useState("");
  const [t] = useTranslation();
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherToken, setTeacherToken] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
        const id = await getTeacherId(setTeacherID,userData.html_url);
        getLabGroups(setLabGroups,id);
        getSubjectsFromGroup(setSubjects,id);
        getStudents(setAvailableStudents,id);
        getTeacherToken(setTeacherToken,id);
    };

    fetchInfo();
  }, []);


  const handleSubjectChange = (e, selectedOption) => {
    if (selectedOption) {
        const fetchFilterStudents = async () => {
            getLabGroupsBySubject(selectedOption, teacherID, setLabGroups);
            const newStudents = await getStudentsBySubject(teacherID, selectedOption);
            const filteredStudents = newStudents.filter(student => !selectedStudents.some(existingStudent => existingStudent.githubuser === student.githubuser));
            setAvailableStudents(filteredStudents);
        };
        fetchFilterStudents();
    }else{
      const fetchAllStudents = async () => {
        getLabGroups(setLabGroups,teacherID);
        getStudents(setAvailableStudents,teacherID).then((newStudents)=>{
          const filteredStudents = newStudents.filter(student => !selectedStudents.some(existingStudent => existingStudent.githubuser === student.githubuser));
          setAvailableStudents(filteredStudents);
        });
      };
      fetchAllStudents();
    }
  }

  const handleGroupChange = (e, selectedOption) => {
    if (selectedOption) {
        const fetchFilterStudents = async () => {
          getStudentsByWork(selectedOption.label, setAvailableStudents, teacherID).then((newStudents)=>{
            const filteredStudents = newStudents.filter(student => !selectedStudents.some(existingStudent => existingStudent.githubuser === student.githubuser));
            setAvailableStudents(filteredStudents);
          });
        };
        fetchFilterStudents();
    }else{
      const fetchAllStudents = async () => {
        getStudents(setAvailableStudents,teacherID).then((newStudents)=>{
          const filteredStudents = newStudents.filter(student => !selectedStudents.some(existingStudent => existingStudent.githubuser === student.githubuser));
          setAvailableStudents(filteredStudents);
        });
      };
      fetchAllStudents();
    }
  }

  function getIssueForm(){
    if(selectedStudents.length > 0){
      setModalOpen(true)
    }else{
      toast.error(t('makeIssue.studentsEmpty'));
    }
    
  }

  const saveIssue = async () => {
    if(teacherToken === ""){
      toast.error(t('makeIssue.tokenEmpty'));
    }else{
      for (let actualStudent of selectedStudents) {
        try {
          await createIssue(actualStudent.githubuser,getRepositoryName(actualStudent.repositoryURL),title,description,teacherToken).then((res) =>{
          if(res.response){
            setModalOpen(false);
            toast.info(t('makeIssue.issueSended'));
          }else{
            if(res.error === 'Unauthorized'){
              toast.error(t('makeIssue.tokenError'));
            }else{
              toast.error(t('makeIssue.issueErrorSendStudent')+res.name);
            }
          }
        });
        } catch (error) {
          toast.error(t('makeIssue.issueErrorSend')+error);
        }
        
    };
  }
  };
  



return (
  <div className='make-issue-container'>
    <Grid container spacing={2}>
      <Grid item xs={1}>
      </Grid>
      <Grid item xs={4}>
          <div className="filterSubject">
              <Autocomplete
                  disablePortal
                  id="subject-combo-box"
                  options={getSubjectsForComboBox(subjects)}
                  renderInput={(params) => <TextField {...params} label={t('makeIssue.subject')} />}
                  onChange={handleSubjectChange}
              />
          </div>
      </Grid>
      <Grid item xs={1}>
      </Grid>
      <Grid item xs={5}>
          <div className="filterLabGroup">
              <Autocomplete
                  disablePortal
                  id="group-combo-box"
                  options={groups}
                  renderInput={(params) => <TextField {...params} label={t('makeIssue.group')} />}
                  onChange={handleGroupChange}
              />
          </div>
      </Grid>
      <Grid item xs={1}>
      </Grid>
    </Grid>
    <SelectableList
      availableStudents={availableStudents}
      setAvailableStudents={setAvailableStudents}
      selectedStudents={selectedStudents}
      setSelectedStudents={setSelectedStudents}
    ></SelectableList>
    <Button variant="contained" onClick={getIssueForm}>
      {t('makeIssue.fillOutForm')}
    </Button>
    {modalOpen && (
      <CreateIssueModal
        closeModal={() => {
          setModalOpen(false);
        }}
        onSubmit={saveIssue}
        setTitle={setTitle}
        title={title}
        setDescription={setDescription}
        description={description}
      />
    )}
  </div>
  
);
}


export default MakeIssue;
