import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./GroupTable.css";
 
const today = new Date();
today.setDate(today.getDate() + 1);

function TableRow({ rowData  }) {
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(today);
    const [t] = useTranslation();

    const handleInitialDateChange = (date) => {
        setInitialDate(date);
        if (date >= finalDate) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setFinalDate(nextDay);
        }
    };

    const handleFinalDateChange = (date) => {
        setFinalDate(date);
        if (initialDate >= date) {
            const previousDay = new Date(date);
            previousDay.setDate(previousDay.getDate() - 1);
            setInitialDate(previousDay);
        }
    };


    return (
        <tr>
            <td>{rowData}</td>
            <td>
                <DatePicker
                    selected={initialDate}
                    onChange={handleInitialDateChange}
                    dateFormat="yyyy-MM-dd HH:mm"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15} 
                />
            </td>
            <td>
                <DatePicker
                    selected={finalDate}
                    onChange={handleFinalDateChange}
                    dateFormat="yyyy-MM-dd HH:mm"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15} 
                />
            </td>
        </tr>
    );
}

function GroupTable({ labGroups }) {
    const [t] = useTranslation();

    

    return (
        <div className='table-wrapper'>
            <table className="table">
                <thead style={{position:"sticky", top:0}}>
                    <tr>
                        <th>{t('createLabWork.labGroup')}</th>
                        <th>{t('createLabWork.initialDate')}</th>
                        <th>{t('createLabWork.finalDate')}</th>
                    </tr>
                </thead>
                <tbody style={{max_height:"300px", overflow_y:"auto"}}>
                    {labGroups.map((row, idx) => (
                        <TableRow key={idx} rowData={row}/>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GroupTable;
