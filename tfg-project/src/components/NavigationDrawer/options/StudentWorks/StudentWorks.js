import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";

import WorkView from './WorkView.js';
import './StudentWorks.css';

function StudentWorks({userData}) {
    const [t] = useTranslation();
    const [works, setWorks] = useState([]);

    useEffect(() => {
        // const fetchInfo = async () => {
        //     const id = await getTeacherId(setTeacherID,userData.html_url);
        //     getLabGroups(setLabGroups,id);
        //     getSubjectsFromGroup(setSubjects,id);
        // };
    
        // fetchInfo();
        setWorks([
          {
              "id":1,
              "title": "Practica 1",
              "group": "ASL_L1",
              "percentage" : 90,
              "description" : "mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto ",
              "mark":  {
                "nota": 9,
                "comentario": "Excelente trabajo, muy bien investigado y presentado. ¡Sigue así!"
              }
          },
          {
            "id":2,
            "title": "Practica 2",
            "group": "ASL_L2",
            "percentage" : 44,
            "description" : "mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa ",
            "mark":  ""
          },
          {
            "id":1,
            "title": "Practica 3",
            "group": "ASL_L1",
            "percentage" : 90,
            "description" : "mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto mucho texto y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa y mas cosa ",
            "mark":  {
              "nota": 9,
              "comentario": "Excelente trabajo, muy bien investigado y presentado. ¡Sigue así!"
            }
          },
          {
            "id":1,
            "title": "Practica 4",
            "group": "ASL_3",
            "percentage" : 90,
            "description" : "mucho texto mucho texto ",
            "mark":  {
              "nota": 9,
              "comentario": "Excelente trabajo, muy bien investigado y presentado. ¡Sigue así!"
            }
          }
        ]);
      }, []);

  

  return (
    <div className='student-works-div'>
        {works.length !== 0 ? 
        works.map((work) => {
          return <WorkView work={work}></WorkView>
        })
        :
        <h3>{t('studentWorks.worksBlank')}</h3>
        }
    </div>
  );
}


export default StudentWorks;
