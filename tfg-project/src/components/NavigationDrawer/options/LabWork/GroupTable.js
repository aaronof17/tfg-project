import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./GroupTable.css";

function TableRow({ rowData, setDates }) {
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());

    useEffect(() => {
        setDates(rowData, initialDate, finalDate);
    }, [initialDate, finalDate, rowData, setDates]);

    const handleInitialDateChange = (date) => {
        setInitialDate(date);
        if (date >= finalDate) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setFinalDate(nextDay);
        }
        console.log("Fecha de inicio ",initialDate.getMonth());
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
                    dateFormat="dd/MM/yyyy"
                />
            </td>
            <td>
                <DatePicker
                    selected={finalDate}
                    onChange={handleFinalDateChange}
                    dateFormat="dd/MM/yyyy"
                />
            </td>
        </tr>
    );
}

function GroupTable({ setDates, labGroups }) {
    const [t] = useTranslation();

    return (
        <div className='table-wrapper'>
            <table className="table">
                <thead style={{position:"sticky", top:0}}>
                    <tr>
                        <th>Lab Group Name</th>
                        <th>Initial Date</th>
                        <th>Final Date</th>
                    </tr>
                </thead>
                <tbody style={{max_height:"300px", overflow_y:"auto"}}>
                    {labGroups.map((row, idx) => (
                        <TableRow key={idx} rowData={row} setDates={setDates} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GroupTable;
