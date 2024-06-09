import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";

import SelectableList from "./SelectableList.js";
import {createIssue} from "../../../../services/gitHubFunctions.js";
import {getTeacherLabGroups,getSubjectsFromGroup, getLabGroupsBySubject} from "../../../../services/labGroupService.js";
import {getStudents, getStudentsBySubject, getStudentsByWork} from "../../../../services/studentService.js";
import {getTeacherId, getTeacherToken} from "../../../../services/teacherService.js";
import {getSubjectsForComboBox,getRepositoryName} from "../../../../functions/genericFunctions.js";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {toast} from "react-toastify";

import strings from '../../../../assets/files/strings.json';
import './MakeIssue.css';
import CreateIssueModal from './CreateIssueModal.js';

function MakeIssue({userData}) {

  const [groups, setLabGroups] = useState();
  const [subjects, setSubjects] = useState();
  const [selectedLabGroup, setSelectedLabGroup] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
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
        const id = await getTeacherId(setTeacherID,userData.login);
        getTeacherLabGroups(setLabGroups,id);
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
            const filteredStudents = newStudents.filter(student => !selectedStudents.some(existingStudent => 
                                                                 existingStudent.labgroup === student.labgroup
                                                              && existingStudent.githubuser === student.githubuser));
            setAvailableStudents(filteredStudents);
            setSelectedSubject(selectedOption);
        };
        fetchFilterStudents();
    }else{
      const fetchAllStudents = async () => {
        getTeacherLabGroups(setLabGroups,teacherID);
        getStudents(setAvailableStudents,teacherID).then((newStudents)=>{
          const filteredStudents = newStudents.filter(student => !selectedStudents.some(existingStudent => 
                                                                                        existingStudent.labgroup === student.labgroup
                                                                                     && existingStudent.githubuser === student.githubuser));
          setAvailableStudents(filteredStudents);
          setSelectedSubject("");
        });
      };
      fetchAllStudents();
    }
  }

  const getGroupsOptions= () =>{
    let options = [];
    if(groups != undefined){
      groups.map((group,index) => {
            options[index] = {
                label: group.label,
                value: group.value
            };
      });
    }     

    return options;
}

  const handleGroupChange = (e, selectedOption) => {
    if (selectedOption) {
        const fetchFilterStudents = async () => {
          getStudentsByWork(selectedOption.label, setAvailableStudents, teacherID).then((newStudents)=>{
            const filteredStudents = newStudents.filter(student => !selectedStudents.some(existingStudent =>
                                                                                          existingStudent.labgroup === student.labgroup
                                                                                          && existingStudent.githubuser === student.githubuser));
            setAvailableStudents(filteredStudents);
            setSelectedLabGroup(selectedOption);
          });
        };
        fetchFilterStudents();
    }else{
      const fetchAllStudents = async () => {
        getStudents(setAvailableStudents,teacherID).then((newStudents)=>{
          const filteredStudents = newStudents.filter(student => !selectedStudents.some(existingStudent => existingStudent.labgroup === student.labgroup
                                                                                        && existingStudent.githubuser === student.githubuser));
          setAvailableStudents(filteredStudents);
          setSelectedLabGroup("");
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
      let problemWithToken=false;
      let issuesSended = [];
      for (let actualStudent of selectedStudents) {
        try {
          await createIssue(actualStudent.githubuser,getRepositoryName(actualStudent.repositoryURL),title,description,teacherToken).then((res) =>{
          if(res.response){
            issuesSended.push(strings.strings.sended);
            setModalOpen(false);
          }else{
            if(res.error === strings.errors.unauthorized){
              toast.error(t('makeIssue.tokenError'));
              problemWithToken = true;
            }else if(res.error ===  strings.errors.notfound){
              toast.error(t('makeIssue.errorRepository')+actualStudent.name);
            }else{
              toast.error(t('makeIssue.issueErrorSendStudent')+actualStudent.name);
            }
          }
        });
        } catch (error) {
          toast.error(t('makeIssue.issueErrorSend'));
        }finally{
          if(problemWithToken){
            return;
          }
        }
        
    };
    if(issuesSended.length != 0){
      toast.info(t('makeIssue.issueSended'));
      setSelectedLabGroup("");
      setSelectedSubject("");
      setTitle("");
      setDescription(""); 
      getStudents(setAvailableStudents,teacherID);
      setSelectedStudents([]);
    }
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
                  value={selectedSubject}
              />
          </div>
      </Grid>
      <Grid item xs={2}>
      </Grid>
      <Grid item xs={4}>
          <div className="filterLabGroup">
              <Autocomplete
                  disablePortal
                  id="group-combo-box"
                  options={getGroupsOptions()}
                  renderInput={(params) => <TextField {...params} label={t('makeIssue.group')} />}
                  onChange={handleGroupChange}
                  value={selectedLabGroup}
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
