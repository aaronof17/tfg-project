import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";

import {getStundentId} from "../../../../services/studentService.js";
import {getWorksByStudentId} from "../../../../services/labWorkService.js";

import WorkView from './WorkView.js';
import './StudentWorks.css';

function StudentWorks({userData}) {
    const [t] = useTranslation();
    const [works, setWorks] = useState([]);
    const [studentID, setStudentId] = useState("");
   

    useEffect(() => {
        const fetchInfo = async () => {
             const id = await getStundentId(setStudentId,userData.login);
             getWorksByStudentId(setWorks,id);
            // getSubjectsFromGroup(setSubjects,id);
        };
    
        fetchInfo();
      }, []);

  

  return (
    <div className='student-works-container'>
        {works.length !== 0 ? 
        works.map((work) => {
          return <WorkView key={work.id} work={work}></WorkView>
        })
        :
        <h3>{t('studentWorks.worksBlank')}</h3>
        }
    </div>
  );
}


export default StudentWorks;
