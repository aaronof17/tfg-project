import React, { useState } from 'react';
import { useTranslation } from "react-i18next";

import "./SelectableList.css";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import IconButton from '@mui/material/IconButton';

function SelectableList({ availableStudents, setAvailableStudents, selectedStudents, setSelectedStudents }) {
    const [t] = useTranslation();

    const truncateName = (name, maxLength = 30) => {
        if (name.length > maxLength) {
            return name.substring(0, maxLength) + '...';
        }
        return name;
    };

    const handleToggleSelect = (student) => {
        const isSelected = selectedStudents.some((s) => (s.name+"-"+s.labgroup) === (student.name+"-"+student.labgroup));

        if (isSelected) {
            setSelectedStudents(selectedStudents.filter((s) => (s.name+"-"+s.labgroup)!== (student.name+"-"+student.labgroup)));
            setAvailableStudents([...availableStudents, student]);
        } else {
            setSelectedStudents([...selectedStudents, student]);
            setAvailableStudents(availableStudents.filter((s) => (s.name+"-"+s.labgroup) !== (student.name+"-"+student.labgroup)));
        }
    };

    const handleMoveAllStudents = (fromList) => {
        if (fromList === 'available') {
            setSelectedStudents([...selectedStudents, ...availableStudents]);
            setAvailableStudents([]);
        } else {
            setAvailableStudents([...availableStudents, ...selectedStudents]);
            setSelectedStudents([]);
        }
    };

    return (
        <div className='selectable-lists-container'>
            <div className="selectable-list-container">
            <h2>{t('makeIssue.availableStudents')}</h2>
                <div className="selectable-list"  style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <ul>
                        {availableStudents.map((student) => (
                            <li key={student.name+"-"+student.labgroup}>
                                {truncateName(student.name)+"-"+student.labgroup}
                                <IconButton 
                                    aria-label="move-right" 
                                    className="move-right"
                                    onClick={() => handleToggleSelect(student)}
                                >
                                    {selectedStudents.some((s) => (s.name+"-"+s.labgroup) === (student.name+"-"+student.labgroup)) ? <ArrowBackIcon/> : <ArrowForwardIcon/>}
                                </IconButton>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="move-buttons">
                <IconButton 
                    aria-label="move-all-right" 
                    className="move-all-right"
                    onClick={() => handleMoveAllStudents('available')}
                >
                    <KeyboardDoubleArrowRightIcon/>
                </IconButton>
                <IconButton 
                    aria-label="move-all-left" 
                    className="move-all-left"
                    onClick={() => handleMoveAllStudents('selected')}
                >
                    <KeyboardDoubleArrowLeftIcon/>
                </IconButton>
            </div>
            <div className="selectable-list-container">
                <h2>{t('makeIssue.selectedStudents')}</h2>
                <div className="selectable-list"  style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <ul>
                        {selectedStudents.map((student) => (
                            <li key={student.name+"-"+student.labgroup}>
                                {truncateName(student.name)+"-"+student.labgroup}
                                <IconButton 
                                    aria-label="move-left" 
                                    className="move-left"
                                    onClick={() => handleToggleSelect(student)}
                                >
                                    {selectedStudents.some((s) => (s.name+"-"+s.labgroup) === (student.name+"-"+student.labgroup)) ? <ArrowBackIcon/> : <ArrowForwardIcon/>}
                                </IconButton>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SelectableList;
