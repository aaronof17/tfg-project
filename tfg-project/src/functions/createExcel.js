import * as XLSX from 'xlsx';
import strings from '../assets/files/strings.json';
import { extractId } from './genericFunctions';
import { getWorksAndMarksByStudentAndGroup } from '../services/labWorkService';


export async function createExcelAndDownload(studentsList,teacherID,group) {
    const studentIds = studentsList.map((s) => extractId(s.id));
    const promises  = [];
    for(let studentid of studentIds ){
        const promise = getWorksAndMarksByStudentAndGroup(studentid, group, teacherID);
        promises.push(promise);
    }

    const marks = await Promise.all(promises);

    const studentsInfo = [];
    for(let s of studentsList){
        const studentInfo = [s.name,s.email,group];
        if(marks.length > 0) {
            const studentMarks = marks.find(mark => mark.data.some(item => item.studentID === extractId(s.id)))?.data || [];
            for(let studentMark of studentMarks){
                studentInfo.push(studentMark.mark);
            }
        }
        studentsInfo.push(studentInfo);
    }

    const columns = [strings.excel.name, strings.excel.email, strings.excel.group];
    if (marks.length > 0) {
        const numWork = marks[0].data;
        for (let work of numWork) {
            columns.push(work.title);
        }
    }

    let dataForExcel = [
        columns,
        ...studentsInfo
      ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
    XLSX.utils.book_append_sheet(workbook, worksheet, group);
    XLSX.writeFile(workbook, strings.excel.archive);
}

