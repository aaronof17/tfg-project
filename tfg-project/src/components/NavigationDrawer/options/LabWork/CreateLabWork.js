import * as React from 'react';
import './CreateLabWork.css';

import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getLabGroups,getSubjectsFromGroup,getLabGroupsBySubject} from "../../../../repositories/labGroupRepository.js";
import {getTeacherId} from "../../../../repositories/teacherRepository.js";
import {saveWorks} from "../../../../repositories/labWorkRepository.js";
import {getSubjectsForComboBox} from "../../../../functions/genericFunctions.js";
import GroupTable from "./GroupTable.js";
import InfoWork from "./InfoWork.js";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {ToastContainer, toast} from "react-toastify";

import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { getTableInformation } from '../../../../functions/genericFunctions.js';

function CreateLabWork({userData}) {
    const [teacherID, setTeacherID] = useState("");
    const [labGroups, setLabGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [actualGroups, setActualGroups] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [percentage, setPercentage] = useState("");
    const [t] = useTranslation();
    const animatedComponents = makeAnimated();

    useEffect(() => {
        const fetchGroups = async () => {
          const id = await getTeacherId(setTeacherID,userData.html_url);
          getLabGroups(setLabGroups,id);
          getSubjectsFromGroup(setSubjects,id);
        };
    
        fetchGroups();
      }, []);

      function saveLabWorks(){
        if(title === "" || description === "" || percentage === "" || isNaN(percentage)){
          toast.error(t('createLabWork.dataBlankError'));
        }else{
          var datesFromGroups = getTableInformation();
          if(datesFromGroups.length === 0){
            toast.error(t('createLabWork.datesBlankError'));
          }else{
            saveWorks(datesFromGroups, title, description, percentage, teacherID).then((res) => {
              if(res){
                toast.info(t('createLabWork.worksSaved'));
              }else{
                toast.error(t('createLabWork.error'));
              }
          });
            
          }
        }
    }



      const handleSubjectChange = (e, selectedOption) => {
        if (selectedOption) {
            const fetchFilterGroups = async () => {
                getLabGroupsBySubject(selectedOption, teacherID, setLabGroups);
            };
            fetchFilterGroups();
        }else{
          const fetchAllGroups = async () => {
            getLabGroups(setLabGroups,teacherID);
          };
          fetchAllGroups();
        }
      }

      const handleGroupsSelector = async (selectedOptions) => {
        if (selectedOptions) {
            const selectedGroups = selectedOptions.map(option => option.label);
            setActualGroups(selectedGroups);
        }
      }
    



  return (
    
    <div className='createLabWorkDiv'>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <div className="filterSubject">
            <Autocomplete
                disablePortal
                id="subject-combo-box"
                options={getSubjectsForComboBox(subjects)}
                renderInput={(params) => <TextField {...params} label={t('createLabWork.subjectFilter')} />}
                onChange={handleSubjectChange}
            />
            </div>
        </Grid>
        <Grid item xs={9}>
            <div className="filterGroup">
              <Select styles={{
                menu: (base, state) => ({
                  ...base,
                  zIndex: 15
                })
              }} 
              options={labGroups} components={animatedComponents} onChange={handleGroupsSelector} isMulti/>
            </div>
        </Grid>
      </Grid>

        <div className="labGroups">
            <GroupTable labGroups={actualGroups}></GroupTable>
        </div>
        <div className="infoWork">
          <InfoWork setTitle={setTitle} setDescription={setDescription} setPercentage={setPercentage}></InfoWork>
        </div>
        <div className="saveLabWorks" >
            <Button variant="contained" onClick={saveLabWorks}>
              {t('createLabWork.saveWorks')}
            </Button>
        </div>
        <ToastContainer className="custom-toast-container"/>
    </div>
  );
}


export default CreateLabWork;
