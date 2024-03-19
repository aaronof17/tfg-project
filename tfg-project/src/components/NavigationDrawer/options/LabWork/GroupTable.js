import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./GroupTable.css";

function TableRow({ rowData }) {
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());

    return (
        <tr>
            <td>{rowData}</td>
            <td>
                <DatePicker
                    selected={initialDate}
                    onChange={(date) => setInitialDate(date)}
                    dateFormat="dd/MM/yyyy"
                />
            </td>
            <td>
                <DatePicker
                    selected={finalDate}
                    onChange={(date) => setFinalDate(date)}
                    dateFormat="dd/MM/yyyy"
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
                <thead>
                    <tr>
                        <th>Lab Group Name</th>
                        <th>Initial Date</th>
                        <th>Final Date</th>
                    </tr>
                </thead>
                <tbody>
                    {labGroups.map((row, idx) => (
                        <TableRow key={idx} rowData={row} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GroupTable;
