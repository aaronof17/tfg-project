const mysql = require('mysql2/promise');
const {saveStudent, editStudent, deleteStudent, getStudents, getAllStudents, getStudentsBySubject, getStudentsByWork} = require('../../src/services/studentService');
const {saveTeacher} = require('../../src/services/teacherService');
const {saveLabGroup} = require('../../src/services/labGroupService');
const {saveEnrolled} = require('../../src/services/enrolledService');
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
    it('should delete a student', async () => {

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

  // Prueba para probar a añadir un estudiante que tiene datos que ya están en la base de datos
  it('should not add a student due to same data', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`;
    const teacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName =`teachergithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teacherEmail, teacherlUserName);

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


    //añadimos otro estudiante con datos ya existentes, por lo que debería dar error
    const studentNotName = `Not Student ${Date.now()}`;
    const studentNotRepository = `http://studentNotRepository ${Date.now()}`;
    const response = await saveStudent(studentNotName, studentEmail, studentUserName, studentNotRepository, groupRows[0].idlabGroup);

    expect(response.response).toBe(false);
    expect(response.code).toBe('ER_DUP_ENTRY');

  });


  // Prueba para probar a añadir un estudiante a un grupo de laboratorio en el que ya está
  it('should not add a student at the same lab group', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`;
    const teacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName =`teachergithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teacherEmail, teacherlUserName);

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

    //incluimos un estudiante en grupo en el que ya está
    const response = await saveEnrolled(studentRows[0].studentsID, groupRows[0].idlabGroup, studentRepository);

    expect(response.response).toBe(false);
    expect(response.code).toBe('ER_DUP_ENTRY');
  });

  // Prueba para obtener los estudiantes de un profesor
  it('should get all students for teacher', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`;
    const teacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName =`teachergithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
    const groupName = `Group Name ${Date.now()}`;
    const groupSubject = `SUBJECT ${Date.now()}`;

    await saveLabGroup(groupName, groupSubject, teacherRows[0].TeacherID);

    const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName]);

    //añadimos varios estudiantes
    const studentName1 = `Student ${Date.now()}`;
    const studentEmail1 = `student@example.com ${Date.now()}`;
    const studentUserName1 = `studentGitUser ${Date.now()}`;
    const studentRepository1 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName1, studentEmail1, studentUserName1, studentRepository1, groupRows[0].idlabGroup);

    const studentName2 = `Student ${Date.now()}`;
    const studentEmail2 = `student@example.com ${Date.now()}`;
    const studentUserName2 = `studentGitUser ${Date.now()}`;
    const studentRepository2 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName2, studentEmail2, studentUserName2, studentRepository2, groupRows[0].idlabGroup);

    const studentName3 = `Student ${Date.now()}`;
    const studentEmail3 = `student@example.com ${Date.now()}`;
    const studentUserName3 = `studentGitUser ${Date.now()}`;
    const studentRepository3 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName3, studentEmail3, studentUserName3, studentRepository3, groupRows[0].idlabGroup);

    //obtenemos los estudiantes del profesor
    let studentsList;
    await getStudents((sl)=>{studentsList=sl}, teacherRows[0].TeacherID);

    expect(studentsList.length).toBe(3);
    expect(studentsList[0].name).toBe(studentName1);
    expect(studentsList[0].email).toBe(studentEmail1);
    expect(studentsList[0].githubuser).toBe(studentUserName1);
    expect(studentsList[0].repositoryURL).toBe(studentRepository1);
    expect(studentsList[1].name).toBe(studentName2);
    expect(studentsList[1].email).toBe(studentEmail2);
    expect(studentsList[1].githubuser).toBe(studentUserName2);
    expect(studentsList[1].repositoryURL).toBe(studentRepository2);
    expect(studentsList[2].name).toBe(studentName3);
    expect(studentsList[2].email).toBe(studentEmail3);
    expect(studentsList[2].githubuser).toBe(studentUserName3);
    expect(studentsList[2].repositoryURL).toBe(studentRepository3);
  });


  // Prueba para obtener todos los estudiantes
  it('should get all students', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`;
    const teacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName =`teachergithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
    const groupName = `Group Name ${Date.now()}`;
    const groupSubject = `SUBJECT ${Date.now()}`;

    await saveLabGroup(groupName, groupSubject, teacherRows[0].TeacherID);

    const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName]);

    //añadimos varios estudiantes
    const studentName1 = `Student ${Date.now()}`;
    const studentEmail1 = `student@example.com ${Date.now()}`;
    const studentUserName1 = `studentGitUser ${Date.now()}`;
    const studentRepository1 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName1, studentEmail1, studentUserName1, studentRepository1, groupRows[0].idlabGroup);

    const studentName2 = `Student ${Date.now()}`;
    const studentEmail2 = `student@example.com ${Date.now()}`;
    const studentUserName2 = `studentGitUser ${Date.now()}`;
    const studentRepository2 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName2, studentEmail2, studentUserName2, studentRepository2, groupRows[0].idlabGroup);

    const studentName3 = `Student ${Date.now()}`;
    const studentEmail3 = `student@example.com ${Date.now()}`;
    const studentUserName3 = `studentGitUser ${Date.now()}`;
    const studentRepository3 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName3, studentEmail3, studentUserName3, studentRepository3, groupRows[0].idlabGroup);

    //obtenemos todos los estudiantes
    let studentsList;
    await getAllStudents((sl)=>{studentsList=sl});

    expect(studentsList.length).toBe(3);
    expect(studentsList[0].name).toBe(studentName1);
    expect(studentsList[0].email).toBe(studentEmail1);
    expect(studentsList[0].githubuser).toBe(studentUserName1);
    expect(studentsList[1].name).toBe(studentName2);
    expect(studentsList[1].email).toBe(studentEmail2);
    expect(studentsList[1].githubuser).toBe(studentUserName2);
    expect(studentsList[2].name).toBe(studentName3);
    expect(studentsList[2].email).toBe(studentEmail3);
    expect(studentsList[2].githubuser).toBe(studentUserName3);
  });


  // Prueba para obtener los estudiantes por asignatura
  it('should get all students by subject', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`;
    const teacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName =`teachergithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio y se los asignamos al profesor añadido anteriormente
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;

    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

    const [groupRows1] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);
    const [groupRows2] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);

    //añadimos varios estudiantes, dos al grupo 1 y el otro al grupo 2
    const studentName1 = `Student ${Date.now()}`;
    const studentEmail1 = `student@example.com ${Date.now()}`;
    const studentUserName1 = `studentGitUser ${Date.now()}`;
    const studentRepository1 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName1, studentEmail1, studentUserName1, studentRepository1, groupRows1[0].idlabGroup);

    const studentName2 = `Student ${Date.now()}`;
    const studentEmail2 = `student@example.com ${Date.now()}`;
    const studentUserName2 = `studentGitUser ${Date.now()}`;
    const studentRepository2 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName2, studentEmail2, studentUserName2, studentRepository2, groupRows2[0].idlabGroup);

    const studentName3 = `Student ${Date.now()}`;
    const studentEmail3 = `student@example.com ${Date.now()}`;
    const studentUserName3 = `studentGitUser ${Date.now()}`;
    const studentRepository3 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName3, studentEmail3, studentUserName3, studentRepository3, groupRows1[0].idlabGroup);

    //obtenemos los estudiantes de la asignatura del grupo 1
    const studentsList = await getStudentsBySubject(teacherRows[0].TeacherID,groupSubject1);

    expect(studentsList.length).toBe(2);
    expect(studentsList[0].name).toBe(studentName1);
    expect(studentsList[0].email).toBe(studentEmail1);
    expect(studentsList[0].githubuser).toBe(studentUserName1);
    expect(studentsList[1].name).toBe(studentName3);
    expect(studentsList[1].email).toBe(studentEmail3);
    expect(studentsList[1].githubuser).toBe(studentUserName3);
  });


  // Prueba para obtener los estudiantes por grupo
  it('should get all students by group', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`;
    const teacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName =`teachergithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio y se los asignamos al profesor añadido anteriormente
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;

    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

    const [groupRows1] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);
    const [groupRows2] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);

    //añadimos varios estudiantes, dos al grupo 1 y el otro al grupo 2
    const studentName1 = `Student ${Date.now()}`;
    const studentEmail1 = `student@example.com ${Date.now()}`;
    const studentUserName1 = `studentGitUser ${Date.now()}`;
    const studentRepository1 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName1, studentEmail1, studentUserName1, studentRepository1, groupRows1[0].idlabGroup);

    const studentName2 = `Student ${Date.now()}`;
    const studentEmail2 = `student@example.com ${Date.now()}`;
    const studentUserName2 = `studentGitUser ${Date.now()}`;
    const studentRepository2 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName2, studentEmail2, studentUserName2, studentRepository2, groupRows2[0].idlabGroup);

    const studentName3 = `Student ${Date.now()}`;
    const studentEmail3 = `student@example.com ${Date.now()}`;
    const studentUserName3 = `studentGitUser ${Date.now()}`;
    const studentRepository3 = `http://studentRepository ${Date.now()}`;
    await saveStudent(studentName3, studentEmail3, studentUserName3, studentRepository3, groupRows1[0].idlabGroup);

    //obtenemos los estudiantes del grupo 1
    let studentsList;
    await getStudentsByWork(groupName1,(sl)=>{studentsList=sl},teacherRows[0].TeacherID);

    expect(studentsList.length).toBe(2);
    expect(studentsList[0].name).toBe(studentName1);
    expect(studentsList[0].email).toBe(studentEmail1);
    expect(studentsList[0].githubuser).toBe(studentUserName1);
    expect(studentsList[1].name).toBe(studentName3);
    expect(studentsList[1].email).toBe(studentEmail3);
    expect(studentsList[1].githubuser).toBe(studentUserName3);
  });

 });

