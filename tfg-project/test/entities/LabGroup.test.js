const mysql = require('mysql2/promise');
const {saveTeacher} = require('../../src/services/teacherService');
const {saveLabGroup,editLabGroup,deleteLabGroup} = require('../../src/services/labGroupService');
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

});