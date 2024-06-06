const mysql = require('mysql2/promise');
const {saveTeacher} = require('../../src/services/teacherService');
const {saveLabGroup} = require('../../src/services/labGroupService');
const {saveWorks} = require('../../src/services/labWorkService');
const {saveStudent} = require('../../src/services/studentService');
const {saveMark,editMark, getMarkByWorkAndStudent} = require('../../src/services/markService');
const {createRandomNumber} = require('../functionsForTests');
require('dotenv').config();
require('../setupFetch');

global.localStorage = {
  getItem: (key) => {
    if (key === 'accessToken') {
      return 'mockAccessToken';
    }
    return null;
  },
  setItem: () => {},
  removeItem: () => {}
};

describe('Mark Management', () => {
  let connection;

  // Conectar a la base de datos antes de todas las pruebas
  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
  });

  beforeEach(async () => {
    await connection.execute('DELETE FROM worklabs');
    await connection.execute('DELETE FROM teachers');
    await connection.execute('DELETE FROM labgroups');
    await connection.execute('DELETE FROM worklabs');
    await connection.execute('DELETE FROM marks');
  });


  afterAll(async () => {
    await connection.end();
  });

  //Prueba para agregar una calificación a la base de datos
    it('should add a mark to the database', async () => {

        //añadimos un profesor
        const teacherName = `Teacher ${Date.now()}`; ;
        const teaacherEmail = `teacher@example.com ${Date.now()}`;
        const teacherlUserName = `teacherGithubuser ${Date.now()}`;
        await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

        const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

        //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
        const groupName1 = `Group Name ${Date.now()}`;
        const groupSubject1 = `SUBJECT ${Date.now()}`;

        await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

        const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);

        //añadimos una práctica de laboratorio
        const workTitle = `Title ${Date.now()}`;
        const workPercentage = createRandomNumber(5);
        const workDescription = `Description ${Date.now()}`;
        const datesForWorks = [
          {
            "labGroupName": groupName1,
            "initialDate": "2024-01-10 19:00",
            "finalDate": "2024-01-11 19:45"
          }
        ]

        await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

        const [workRows] = await connection.execute('SELECT * FROM worklabs WHERE title = ?', [workTitle]);

        //añadimos un estudiante
        const studentName = `Student ${Date.now()}`;
        const studentEmail = `student@example.com ${Date.now()}`;
        const studentUserName = `studentGitUser ${Date.now()}`;
        const studentRepository = `http://studentRepository ${Date.now()}`;
        await saveStudent(studentName, studentEmail, studentUserName, studentRepository, groupRows[0].idlabGroup);

        const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail]);

        //calificamos al alumno en la práctica de laboratorio
        const markNumber = createRandomNumber(1);
        const markComment = `Comment ${Date.now()}`;
        await saveMark(workRows[0].worklabID, studentRows[0].studentsID, markComment, markNumber);

        const [markRows] = await connection.execute('SELECT * FROM marks WHERE studentIDFK = ?', [studentRows[0].studentsID]);

        expect(markRows.length).toBe(1);
        expect(markRows[0].mark).toBe(markNumber);
        expect(markRows[0].comment).toBe(markComment);
        expect(markRows[0].studentIDFK).toBe(studentRows[0].studentsID);
        expect(markRows[0].worklabIDFK).toBe(workRows[0].worklabID);

    });

    //Prueba para editar una calificación
    it('should edit a mark to the database', async () => {

      //añadimos un profesor
      const teacherName = `Teacher ${Date.now()}`; ;
      const teaacherEmail = `teacher@example.com ${Date.now()}`;
      const teacherlUserName = `teacherGithubuser ${Date.now()}`;
      await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

      const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

      //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
      const groupName1 = `Group Name ${Date.now()}`;
      const groupSubject1 = `SUBJECT ${Date.now()}`;

      await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

      const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);

      //añadimos una práctica de laboratorio
      const workTitle = `Title ${Date.now()}`;
      const workPercentage = createRandomNumber(5);
      const workDescription = `Description ${Date.now()}`;
      const datesForWorks = [
        {
          "labGroupName": groupName1,
          "initialDate": "2024-01-10 19:00",
          "finalDate": "2024-01-11 19:45"
        }
      ]

      await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

      const [workRows] = await connection.execute('SELECT * FROM worklabs WHERE title = ?', [workTitle]);

      //añadimos un estudiante
      const studentName = `Student ${Date.now()}`;
      const studentEmail = `student@example.com ${Date.now()}`;
      const studentUserName = `studentGitUser ${Date.now()}`;
      const studentRepository = `http://studentRepository ${Date.now()}`;
      await saveStudent(studentName, studentEmail, studentUserName, studentRepository, groupRows[0].idlabGroup);

      const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail]);

      //calificamos al alumno en la práctica de laboratorio
      const markNumber = createRandomNumber(1);
      const markComment = `Comment ${Date.now()}`;
      await saveMark(workRows[0].worklabID, studentRows[0].studentsID, markComment, markNumber);


      //editamos la calificación
      const editMarkNumber = createRandomNumber(1);
      const editMarkComment = `Comment ${Date.now()}`;
      await editMark(workRows[0].worklabID, studentRows[0].studentsID, editMarkComment, editMarkNumber);
      
      const [markRows] = await connection.execute('SELECT * FROM marks WHERE studentIDFK = ?', [studentRows[0].studentsID]);

      expect(markRows.length).toBe(1);
      expect(markRows[0].mark).toBe(editMarkNumber);
      expect(markRows[0].comment).toBe(editMarkComment);
      expect(markRows[0].studentIDFK).toBe(studentRows[0].studentsID);
      expect(markRows[0].worklabIDFK).toBe(workRows[0].worklabID);

  });


  //Prueba para saber si una práctica está calificada o no
  it('should get mark by lab work and student', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;

    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);

    //añadimos una práctica de laboratorio
    const workTitle = `Title ${Date.now()}`;
    const workPercentage = createRandomNumber(5);
    const workDescription = `Description ${Date.now()}`;
    const datesForWorks = [
      {
        "labGroupName": groupName1,
        "initialDate": "2024-01-10 19:00",
        "finalDate": "2024-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

    const [workRows] = await connection.execute('SELECT * FROM worklabs WHERE title = ?', [workTitle]);

    //añadimos un estudiante
    const studentName = `Student ${Date.now()}`;
    const studentEmail = `student@example.com ${Date.now()}`;
    const studentUserName = `studentGitUser ${Date.now()}`;
    const studentRepository = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName, studentEmail, studentUserName, studentRepository, groupRows[0].idlabGroup);

    const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail]);

    //calificamos al alumno en la práctica de laboratorio
    const markNumber = createRandomNumber(1);
    const markComment = `Comment ${Date.now()}`;
    await saveMark(workRows[0].worklabID, studentRows[0].studentsID, markComment, markNumber);


    //com`probamos si está calificada
    const response = await getMarkByWorkAndStudent(workRows[0].worklabID, studentRows[0].studentsID);

    expect(response.data).toBe(1);

});


});