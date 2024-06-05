const mysql = require('mysql2/promise');
const {saveStudent, editStudent, deleteStudent} = require('../../../src/services/studentService');
const {saveTeacher} = require('../../../src/services/teacherService');
const {saveLabGroup} = require('../../../src/services/labGroupService');
require('dotenv').config();
require('../../setupFetch');

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

describe('Student Management', () => {
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
    await connection.execute('DELETE FROM students');
    await connection.execute('DELETE FROM teachers');
    await connection.execute('DELETE FROM labgroups');
    await connection.execute('DELETE FROM enrolled');

  });


  afterAll(async () => {
    await connection.end();
  });

  //Prueba para agregar un estudiante a la base de datos
    it('should add a student to the database and enroll him', async () => {

        //añadimos un profesor
        const teacherName = `Test Teacher ${Date.now()}`; ;
        const teaacherEmail = `original@example.com ${Date.now()}`;
        const teacherlUserName = `originalgithubuser ${Date.now()}`;
        await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

        const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

        //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
        const groupName = `Group Name ${Date.now()}`;
        const groupSubject = `SUBJECT ${Date.now()}`;

        await saveLabGroup(groupName, groupSubject, teacherRows[0].TeacherID);

        const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName]);
       
        //añadimos un estudiante
        const studentName = `Student ${Date.now()}`;
        const studentEmail = `student@example.com ${Date.now()}`;
        const studentUserName = `studentGitUser ${Date.now()}`;
        const studentRepository = `http://studentRepository ${Date.now()}`;
        await saveStudent(studentName, studentEmail, studentUserName, studentRepository, groupRows[0].idlabGroup);


        const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail]);

        expect(studentRows.length).toBe(1);
        expect(studentRows[0].name).toBe(studentName);
        expect(studentRows[0].email).toBe(studentEmail);
        expect(studentRows[0].githubuser).toBe(studentUserName);

        const [enrollRows] = await connection.execute('SELECT * FROM enrolled WHERE studentFK = ?', [studentRows[0].studentsID]);
       
        expect(enrollRows.length).toBe(1);
        expect(enrollRows[0].studentFK).toBe(studentRows[0].studentsID);
        expect(enrollRows[0].labgroupFK).toBe( groupRows[0].idlabGroup);
        expect(enrollRows[0].repositoryURL).toBe(studentRepository);
    });

  // Prueba para editar un estudiante
    it('should edit a student', async () => {

        //añadimos un profesor
        const teacherName = `New Teacher ${Date.now()}`;
        const teaacherEmail = `originalNew@example.com ${Date.now()}`;
        const teacherlUserName = `originalNewgithubuser ${Date.now()}`;
        await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

        const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

        //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
        const groupName = `Group Name New ${Date.now()}`;
        const groupSubject = `SUBJECT New ${Date.now()}`;

        await saveLabGroup(groupName, groupSubject, teacherRows[0].TeacherID);

        const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName]);
       
        //añadimos un estudiante
        const studentName = `Original Student ${Date.now()}`;
        const studentEmail = `studentOriginal@example.com ${Date.now()}` ;
        const studentUserName = `studentOriginalGitUser ${Date.now()}`;
        const studentRepository = `http://studentOriginalRepository ${Date.now()}`;
        await saveStudent(studentName, studentEmail, studentUserName, studentRepository, groupRows[0].idlabGroup);


        const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail]);


        //editamos el estudiante
        const editStudentName = `Edit Student ${Date.now()}`;
        const editStudentEmail = `studentEdit@example.com ${Date.now()}`;
        const editStudentUserName = `studentEditGitUser ${Date.now()}`;
        const editStudentRepository = `http://studentEditRepository ${Date.now()}`;

        const studentInfo = {
            id: studentRows[0].studentsID+groupName,
            name: editStudentName,
            email: editStudentEmail,
            githubuser: editStudentUserName,
            repository : editStudentRepository,
            group : groupName
        }

        await editStudent(studentInfo);
       
        const [studentEDitRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [editStudentEmail]);

        expect(studentEDitRows.length).toBe(1);
        expect(studentEDitRows[0].name).toBe(editStudentName);
        expect(studentEDitRows[0].email).toBe(editStudentEmail);
        expect(studentEDitRows[0].githubuser).toBe(editStudentUserName);
  });

  // Prueba para eliminar un estudiante
    it('should edit a student', async () => {

        //añadimos un profesor
        const teacherName = `Delete Teacher ${Date.now()}`;
        const teacherEmail = `originalDelete@example.com ${Date.now()}`;
        const teacherlUserName =`originalDeletegithubuser ${Date.now()}`;
        await saveTeacher(teacherName, teacherEmail, teacherlUserName);

        const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

        //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
        const groupName = `Group Name Delete ${Date.now()}`;
        const groupSubject = `SUBJECT Delete ${Date.now()}`;

        await saveLabGroup(groupName, groupSubject, teacherRows[0].TeacherID);

        const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName]);
       
        //añadimos un estudiante
        const studentName = `Delete Student ${Date.now()}`;
        const studentEmail = `studentDelete@example.com ${Date.now()}`;
        const studentUserName = `studentDeleteGitUser ${Date.now()}`;
        const studentRepository = `http://studentDeleteRepository ${Date.now()}`;
        await saveStudent(studentName, studentEmail, studentUserName, studentRepository, groupRows[0].idlabGroup);


        const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail]);

        const studentInfo = {
            id: studentRows[0].studentsID+groupName,
            group : groupName
        }

        await deleteStudent(studentInfo);
       
        const [studentDeleteRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail]);

        expect(studentDeleteRows.length).toBe(0);
  });

 });