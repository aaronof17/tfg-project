const mysql = require('mysql2/promise');
const {saveTeacher} = require('../../src/services/teacherService');
const {saveStudent} = require('../../src/services/studentService');
const {saveLabGroup,editLabGroup,deleteLabGroup,getTeacherLabGroups,getLabGroups,getSubjectsFromGroup,getSubjectsForStudent,getLabGroupsBySubject} = require('../../src/services/labGroupService');
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

describe('Lab Group Management', () => {
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
    await connection.execute('DELETE FROM teachers');
    await connection.execute('DELETE FROM labgroups');
    await connection.execute('DELETE FROM students');
  });


  afterAll(async () => {
    await connection.end();
  });

  //Prueba para agregar un grupo de laboratorio a la base de datos
    it('should add a lab group to the database', async () => {

        //añadimos un profesor
        const teacherName = `Teacher ${Date.now()}`; ;
        const teaacherEmail = `teacher@example.com ${Date.now()}`;
        const teacherlUserName = `teacherGithubuser ${Date.now()}`;
        await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

        const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

        //añadimos un grupo de laboratorio y se lo asignamos al profesor añadido anteriormente
        const groupName = `Group Name ${Date.now()}`;
        const groupSubject = `SUBJECT ${Date.now()}`;

        await saveLabGroup(groupName, groupSubject, teacherRows[0].TeacherID);

        const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName]);

        expect(groupRows.length).toBe(1);
        expect(groupRows[0].Name).toBe(groupName);
        expect(groupRows[0].Subject).toBe(groupSubject);
        expect(groupRows[0].TeacherIDFK).toBe(teacherRows[0].TeacherID);
    });

  // Prueba para editar un grupo de laboratorio
    it('should edit a lab group', async () => {

        //añadimos dos profesores
        const teacherName1 = `Teacher ${Date.now()}`; ;
        const teaacherEmail1 = `teacher@example.com ${Date.now()}`;
        const teacherlUserName1 = `teacherGithubuser ${Date.now()}`;
        await saveTeacher(teacherName1, teaacherEmail1, teacherlUserName1);

        const [teacherRows1] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName1]);

        const teacherName2 = `Teacher ${Date.now()}`; ;
        const teaacherEmail2 = `teacher@example.com ${Date.now()}`;
        const teacherlUserName2 = `teacherGithubuser ${Date.now()}`;
        await saveTeacher(teacherName2, teaacherEmail2, teacherlUserName2);

        const [teacherRows2] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName2]);

        //añadimos un grupo de laboratorio y se lo asignamos al primer profesor añadido anteriormente
        const groupName = `Group Name ${Date.now()}`;
        const groupSubject = `SUBJECT ${Date.now()}`;

        await saveLabGroup(groupName, groupSubject, teacherRows1[0].TeacherID);

        const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName]);

       
        //editamos el grupo
        const groupEditName = `Group Edit Name ${Date.now()}`;
        const groupEditSubject = `SUBJECT Edit ${Date.now()}`;

        const groupInfo = {
          id: groupRows[0].idlabGroup,
          name: groupEditName,
          subject: groupEditSubject,
          teacherName: {
            value: teacherRows2[0].TeacherID
          }
        }

        await editLabGroup(groupInfo);

        const [editedGroupRows] = await connection.execute('SELECT * FROM labgroups WHERE idlabGroup = ?', [groupRows[0].idlabGroup]);

        expect(editedGroupRows.length).toBe(1);
        expect(editedGroupRows[0].Name).toBe(groupEditName);
        expect(editedGroupRows[0].Subject).toBe(groupEditSubject);
        expect(editedGroupRows[0].TeacherIDFK).toBe(teacherRows2[0].TeacherID);
  });

  // Prueba para eliminar un grupo de laboratorio
  it('should delete a lab group', async () => {

    //añadimos dos profesores
    const teacherName1 = `Teacher ${Date.now()}`; ;
    const teaacherEmail1 = `teacher@example.com ${Date.now()}`;
    const teacherlUserName1 = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName1, teaacherEmail1, teacherlUserName1);

    const [teacherRows1] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName1]);

    //añadimos un grupo de laboratorio y se lo asignamos al primer profesor añadido anteriormente
    const groupName = `Group Name ${Date.now()}`;
    const groupSubject = `SUBJECT ${Date.now()}`;

    await saveLabGroup(groupName, groupSubject, teacherRows1[0].TeacherID);

    //eliminamos un grupo
    const groupInfo = {
      name: groupName,
    }
    await deleteLabGroup(groupInfo);

    const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName]);

    expect(groupRows.length).toBe(0);
  });


  // Prueba de intentar un grupo de laboratorio con titulo ya existente
  it('should not add a lab group because title exist', async () => {

    //añadimos dos profesores
    const teacherName1 = `Teacher ${Date.now()}`; ;
    const teaacherEmail1 = `teacher@example.com ${Date.now()}`;
    const teacherlUserName1 = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName1, teaacherEmail1, teacherlUserName1);

    const [teacherRows1] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName1]);

    //añadimos un grupo de laboratorio y se lo asignamos al primer profesor añadido anteriormente
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;

    await saveLabGroup(groupName1, groupSubject1, teacherRows1[0].TeacherID);

    //intentamos añadir otro grupo con el mismo nombre
    const groupSubject2 = `SUBJECT ${Date.now()}`;

    const response = await saveLabGroup(groupName1, groupSubject2, teacherRows1[0].TeacherID);

    expect(response.response).toBe(false);
    expect(response.code).toBe('ER_DUP_ENTRY');
  });

  //Prueba para obtener los grupos de un profesor
  it('should get lab groups for teacher', async () => {

    //añadimos dos profesores
    const teacherName1 = `Teacher ${Date.now()}`; ;
    const teacherEmail1 = `teacher@example.com ${Date.now()}`;
    const teacherlUserName1 = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName1, teacherEmail1, teacherlUserName1);

    const teacherName2 = `Teacher ${Date.now()}`; ;
    const teacherEmail2 = `teacher@example.com ${Date.now()}`;
    const teacherlUserName2 = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName2, teacherEmail2, teacherlUserName2);

    const [teacherRows1] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName1]);
    const [teacherRows2] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName2]);

    //añadimos un grupo de laboratorio para cada profesor
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows1[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName2, groupSubject2, teacherRows2[0].TeacherID);

    const [groupRows] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);

    //obtenemos los grupos para el profesor 2
    let groupsList;
    await getTeacherLabGroups((gl)=>{groupsList=gl},teacherRows2[0].TeacherID);

    expect(groupsList.length).toBe(1);
    expect(groupsList[0].value).toBe(groupRows[0].idlabGroup);
    expect(groupsList[0].label).toBe(groupName2);
  });

  //Prueba para obtener todos los grupos de laboratorio
    it('should get all groups', async () => {

        //añadimos un profesor
        const teacherName = `Teacher ${Date.now()}`; ;
        const teaacherEmail = `teacher@example.com ${Date.now()}`;
        const teacherlUserName = `teacherGithubuser ${Date.now()}`;
        await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

        const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

        //añadimos varios grupos de laboratorio
        const groupName1 = `Group Name ${Date.now()}`;
        const groupSubject1 = `SUBJECT ${Date.now()}`;
        await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

        const groupName2 = `Group Name ${Date.now()}`;
        const groupSubject2 = `SUBJECT ${Date.now()}`;
        await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

        const groupName3 = `Group Name ${Date.now()}`;
        const groupSubject3 = `SUBJECT ${Date.now()}`;
        await saveLabGroup(groupName3, groupSubject3, teacherRows[0].TeacherID);

        //obtenemos todos los grupos
        const response = await getLabGroups();

        expect(response.length).toBe(3);
        expect(response[0].name).toBe(groupName1);
        expect(response[0].subject).toBe(groupSubject1);
        expect(response[0].teacherID).toBe(teacherRows[0].TeacherID);
        expect(response[1].name).toBe(groupName2);
        expect(response[1].subject).toBe(groupSubject2);
        expect(response[1].teacherID).toBe(teacherRows[0].TeacherID);
        expect(response[2].name).toBe(groupName3);
        expect(response[2].subject).toBe(groupSubject3);
        expect(response[2].teacherID).toBe(teacherRows[0].TeacherID);
    });


    //Prueba para obtener las asignaturas de un profesor
    it('should get all subjects for teacher', async () => {

      //añadimos un profesor
      const teacherName = `Teacher ${Date.now()}`; ;
      const teaacherEmail = `teacher@example.com ${Date.now()}`;
      const teacherlUserName = `teacherGithubuser ${Date.now()}`;
      await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

      const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

      //añadimos varios grupos de laboratorio con tres asignaturas diferentes
      const groupName1 = `Group Name ${Date.now()}`;
      const groupSubject1 = `SUBJECT ${Date.now()}`;
      await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

      const groupName2 = `Group Name ${Date.now()}`;
      const groupSubject2 = `SUBJECT ${Date.now()}`;
      await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

      const groupName3 = `Group Name ${Date.now()}`;
      const groupSubject3 = `SUBJECT ${Date.now()}`;
      await saveLabGroup(groupName3, groupSubject3, teacherRows[0].TeacherID);

      //obtenemos las asignaturas del profesor
      let subjectsList;
      await getSubjectsFromGroup((sl)=>{subjectsList=sl},teacherRows[0].TeacherID);

      expect(subjectsList.length).toBe(3);
      expect(subjectsList[0].subject).toBe(groupSubject1);
      expect(subjectsList[1].subject).toBe(groupSubject2);
      expect(subjectsList[2].subject).toBe(groupSubject3);
  });


  //Prueba para obtener las asignaturas de un alumno
  it('should get all subjects for student', async () => {
    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio con tres asignaturas diferentes
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

    const groupName3 = `Group Name ${Date.now()}`;
    const groupSubject3 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName3, groupSubject3, teacherRows[0].TeacherID);

    const [groupRows1] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);
    const [groupRows2] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);
    const [groupRows3] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName3]);

    //añadimos un estudiante a cada grupo de laboratorio
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
    await saveStudent(studentName3, studentEmail3, studentUserName3, studentRepository3, groupRows3[0].idlabGroup);

    const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail2]);

    //obtenemos las asignaturas del estudiante 2
    let subjectsList;
    await getSubjectsForStudent((sl)=>{subjectsList=sl},studentRows[0].studentsID);

    expect(subjectsList.length).toBe(1);
    expect(subjectsList[0].subject).toBe(groupSubject2);
});

//Prueba para obtener los grupos de una asignatura
it('should get all lab groups by subject', async () => {

  //añadimos un profesor
  const teacherName = `Teacher ${Date.now()}`; ;
  const teaacherEmail = `teacher@example.com ${Date.now()}`;
  const teacherlUserName = `teacherGithubuser ${Date.now()}`;
  await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

  const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

  //añadimos varios grupos de laboratorio siendo el 1 y el 2 con la misma asignatura
  const groupName1 = `Group Name ${Date.now()}`;
  const groupSubject1 = `SUBJECT ${Date.now()}`;
  await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

  const groupName2 = `Group Name ${Date.now()}`;
  await saveLabGroup(groupName2, groupSubject1, teacherRows[0].TeacherID);

  const groupName3 = `Group Name ${Date.now()}`;
  const groupSubject3 = `SUBJECT ${Date.now()}`;
  await saveLabGroup(groupName3, groupSubject3, teacherRows[0].TeacherID);

  const [groupRows1] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);
  const [groupRows2] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);

  //obtenemos los grupos de la asignatura 1
  let groupsList;
  await getLabGroupsBySubject(groupSubject1,teacherRows[0].TeacherID,(sl)=>{groupsList=sl});

  expect(groupsList.length).toBe(2);
  expect(groupsList[0].value).toBe(groupRows1[0].idlabGroup);
  expect(groupsList[0].label).toBe(groupName1);
  expect(groupsList[1].value).toBe(groupRows2[0].idlabGroup);
  expect(groupsList[1].label).toBe(groupName2);

});


});