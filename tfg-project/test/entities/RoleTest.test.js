const mysql = require('mysql2/promise');
const {getRoleByGitHubUser,saveTeacher} = require('../../src/services/teacherService');
const {saveStudent} = require('../../src/services/studentService');
const {saveLabGroup} = require('../../src/services/labGroupService');
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

describe('Role Management', () => {
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
  });

  afterAll(async () => {
    await connection.end();
  });

  // Prueba de que se obtiene el rol correctamente
  it('should get correct roles for users', async () => {
    //añadimos un profesor
    const teacherName = `Test Teacher ${Date.now()}`;
    const emailName = `test@example.com ${Date.now()}`;
    const userName = `testgithubuser ${Date.now()}`;

    await saveTeacher(teacherName, emailName, userName);

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

    //comprobamos el rol del profesor
    const responseTeacher = await getRoleByGitHubUser(userName);
    expect(responseTeacher).toBe('teacher');
    
    //comprobamos el rol del estudiante
    const responseStudent = await getRoleByGitHubUser(studentUserName);
    expect(responseStudent).toBe('student');

    //comprobamos el rol del usuario no introducido en el sistema
    let userWithoutRole = `GitUser ${Date.now()}`
    const responseWithouRol = await getRoleByGitHubUser(userWithoutRole);
    expect(responseWithouRol).toBe('');
  });


});