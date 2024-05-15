import React, { useState } from "react";

import DatePicker from "react-datepicker";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import { useTranslation } from "react-i18next";
import {toast} from "react-toastify";

import "./Modal.css";
import "react-datepicker/dist/react-datepicker.css";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Modal ({ closeModal, onSubmit, defaultValue }){
  const [formState, setFormState] = useState(
    defaultValue || {
      title: "",
      description: "",
      percentage: "",
      initialdate: new Date(),
      finaldate: new Date(),
      active: 0,
    }
  );
  const [t] = useTranslation();

  const handleInitialDateChange = (date) => {
    const newDate = new Date(date);
    setFormState(prevState => ({
        ...prevState,
        initialdate: newDate
    }));
    if (newDate >= formState.finaldate) {
        const nextDay = new Date(newDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setFormState(prevState => ({
            ...prevState,
            finaldate: nextDay
        }));
    }
  };

  
const handleFinalDateChange = (date) => {
    const newDate = new Date(date);
    setFormState(prevState => ({
        ...prevState,
        finaldate: newDate
    }));
    if (formState.initialdate >= newDate) {
        const previousDay = new Date(newDate);
        previousDay.setDate(previousDay.getDate() - 1);
        setFormState(prevState => ({
            ...prevState,
            initialdate: previousDay
        }));
    }
};

const handleActiveChange = (event) => {
  setFormState(prevState => ({
    ...prevState,
    active: event.target.checked ? 1 : 0 
}));

}


const handleKeyPress = (event) => {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
    }
};

const handlePercentageChange = (event) => {
    let value = event.target.value;
    let intValue = parseInt(value, 10);
    if (intValue > 100) {
        intValue = 100;
    }
    setFormState(prevState => ({
        ...prevState,
        percentage: intValue
    }));
};

  const validateForm = () => {
    if(formState.title === "" || formState.description === "" ||
        isNaN(formState.percentage) || formState.initialdate === ""||
        formState.finaldate === ""){
        toast.error(t('worksList.blankInfo'));
        return false;    
    }else if(Date.parse(formState.initialdate) >= Date.parse(formState.finaldate)){
        toast.error(t('worksList.dateError'));
        return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formState);
    closeModal();
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form>
          <div className="form-group">
            <label htmlFor="title">{t('worksList.title')}</label>
            <input 
                name="title" 
                onChange={handleChange} 
                value={formState.title}
                maxLength={45}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">{t('worksList.description')}</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={formState.description}
              maxLength={1000}
            />
          </div>
          <div className="form-group">
            <label htmlFor="percentage">{t('worksList.percentage')}</label>
                <TextField
                        id="outlined-required"
                        className="percentageWork"
                        type="number"
                        value={formState.percentage}
                        inputProps={{
                            min: 0,
                            max: 100,
                            onKeyPress: handleKeyPress,
                            onInput: handlePercentageChange
                        }}
                    />
          </div>
          <div className="form-group">
            <label htmlFor="initialDate">{t('worksList.initialDate')}</label>
            <DatePicker
                    selected={new Date(formState.initialdate)}
                    onChange={handleInitialDateChange}
                    dateFormat="yyyy-MM-dd HH:mm"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15} 
                />
          </div>
          <div className="form-group">
            <label htmlFor="finalDate">{t('worksList.finalDate')}</label>
            <DatePicker
                    selected={new Date(formState.finaldate)}
                    onChange={handleFinalDateChange}
                    dateFormat="yyyy-MM-dd HH:mm"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15} 
                />
          </div>
          <div className="form-group">
            <label htmlFor="active">{t('worksList.active')}</label>
              <Checkbox {...label} checked={formState.active === 1} onChange={handleActiveChange}/>
          </div>
          <Button className="confirm-btn" variant="contained" onClick={handleSubmit}>
                    {t('worksList.confirm')}
          </Button>
          <Button className="cancel-btn" variant="contained" onClick={closeModal}>
                    {t('worksList.cancel')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
