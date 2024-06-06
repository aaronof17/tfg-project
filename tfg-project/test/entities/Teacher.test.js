const mysql = require('mysql2/promise');
const { saveTeacher, editTeacher, deleteTeacher, saveTeacherToken, getTeacherToken, getTeachers, getTeacherByGitHubUser} = require('../../src/services/teacherService');
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

describe('Teacher Management', () => {
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

  // Prueba para agregar un profesor a la base de datos
  it('should add a teacher to the database', async () => {
    //añadimos el profesor
    const teacherName = `Test Teacher ${Date.now()}`;
    const emailName = `test@example.com ${Date.now()}`;
    const userName = `testgithubuser ${Date.now()}`;

    await saveTeacher(teacherName, emailName, userName);

    const [rows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe(teacherName);
    expect(rows[0].email).toBe(emailName);
    expect(rows[0].githubProfile).toBe(userName);
  });

  // Prueba para editar un profesor en la base de datos
  it('should edit a teacher in the database', async () => {
    //añadimos el profesor
    const originalName = `Original Teacher ${Date.now()}`;
    const originalEmail = `original@example.com ${Date.now()}`;
    const originalUserName = `originalgithubuser ${Date.now()}`;
    await saveTeacher(originalName, originalEmail, originalUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [originalName]);

    //editamos el profesor
    const teacherId = teacherRows[0].TeacherID;
    const editedName = `Edited Teacher ${Date.now()}`;
    const editedEmail = `edited@example.com ${Date.now()}`;
    const editedUserName = `editedgithubuser ${Date.now()}`;

    const teacherInfo = {
      id: originalEmail,
      name: editedName,
      email: editedEmail,
      githubProfile: editedUserName
    }

    await editTeacher(teacherInfo);

    const [rows] = await connection.execute('SELECT * FROM teachers WHERE TeacherID = ?', [teacherId]);

    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe(editedName);
    expect(rows[0].email).toBe(editedEmail);
    expect(rows[0].githubProfile).toBe(editedUserName);
  });


   // Prueba para borrar un profesor de la base de datos
  it('should delete a teacher in the database', async () => {
    //añadimos el profesor
    const originalName = `Original Teacher to Delete ${Date.now()}`;
    const originalEmail = `originalDelete@example.com ${Date.now()}`;
    const originalUserName = `originalDeletegithubuser ${Date.now()}`;
    await saveTeacher(originalName, originalEmail, originalUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [originalName]);

    const teacherId = teacherRows[0].TeacherID;

    //borramos el profesor
    const teacherInfo = {
      email: originalEmail,
    }

    await deleteTeacher(teacherInfo);

    const [rows] = await connection.execute('SELECT * FROM teachers WHERE email = ?', [teacherId]);

    expect(rows.length).toBe(0);
  });


  // Prueba de intentar añadir un profesor con email ya existente
  it('should not add a teacher because email exist', async () => {
    //añadimos el profesor
    const teacherName1 = `Teacher ${Date.now()}`;
    const teacherEmail1 = `email@example.com ${Date.now()}`;
    const teacherUserName1 = `githubuser ${Date.now()}`;
    await saveTeacher(teacherName1, teacherEmail1, teacherUserName1);

    //intentamos añadir otro con el mismo email
    const teacherName2 = `Teacher ${Date.now()}`;
    const teacherUserName2 = `githubuser ${Date.now()}`;
    const response = await saveTeacher(teacherName2, teacherEmail1, teacherUserName2);

    expect(response.response).toBe(false);
    expect(response.code).toBe('ER_DUP_ENTRY');

  });


  // Prueba de intentar añadir un profesor con usuario de github ya existente
  it('should not add a teacher because githubuser exist', async () => {
    //añadimos el profesor
    const teacherName1 = `Teacher ${Date.now()}`;
    const teacherEmail1 = `email@example.com ${Date.now()}`;
    const teacherUserName1 = `githubuser ${Date.now()}`;
    await saveTeacher(teacherName1, teacherEmail1, teacherUserName1);

    //intentamos añadir otro con el mismo usuario de github
    const teacherName2 = `Teacher ${Date.now()}`;
    const teacherEmail2 = `email@example.com ${Date.now()}`;
    const response = await saveTeacher(teacherName2, teacherEmail2, teacherUserName1);

    expect(response.response).toBe(false);
    expect(response.code).toBe('ER_DUP_ENTRY');

  });


  // Prueba de guardar y recuperar el token de un profesor
  it('should add encrypt token', async () => {

    //añadimos el profesor
    const teacherName = `Teacher ${Date.now()}`;
    const teacherEmail = `email@example.com ${Date.now()}`;
    const teacherUserName = `githubuser ${Date.now()}`;
    await saveTeacher(teacherName, teacherEmail, teacherUserName);


    //añadimos el token
    const teacherToken = "teacherToken";
    await saveTeacherToken(teacherToken, teacherUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE email = ?', [teacherEmail]);


    // Obtenemos el token
    let responseToken;
    await getTeacherToken((dt)=>{responseToken=dt}, teacherRows[0].TeacherID);

    expect(responseToken).toBe(teacherToken);

  });


  // Prueba de obtener todos los profesores
  it('should get all teachers', async () => {

    //añadimos varios profesores
    const teacherName1 = `Teacher ${Date.now()}`;
    const teacherEmail1 = `email@example.com ${Date.now()}`;
    const teacherUserName1 = `githubuser ${Date.now()}`;
    await saveTeacher(teacherName1, teacherEmail1, teacherUserName1);

    const teacherName2 = `Teacher ${Date.now()}`;
    const teacherEmail2 = `email@example.com ${Date.now()}`;
    const teacherUserName2 = `githubuser ${Date.now()}`;
    await saveTeacher(teacherName2, teacherEmail2, teacherUserName2);

    const teacherName3 = `Teacher ${Date.now()}`;
    const teacherEmail3 = `email@example.com ${Date.now()}`;
    const teacherUserName3 = `githubuser ${Date.now()}`;
    await saveTeacher(teacherName3, teacherEmail3, teacherUserName3);


    //obtenemos los profesores
    const response = await getTeachers();

    expect(response.length).toBe(3);
    expect(response[0].name).toBe(teacherName1);
    expect(response[0].email).toBe(teacherEmail1);
    expect(response[0].githubProfile).toBe(teacherUserName1);
    expect(response[1].name).toBe(teacherName2);
    expect(response[1].email).toBe(teacherEmail2);
    expect(response[1].githubProfile).toBe(teacherUserName2);
    expect(response[2].name).toBe(teacherName3);
    expect(response[2].email).toBe(teacherEmail3);
    expect(response[2].githubProfile).toBe(teacherUserName3);
  });

  // Prueba de obtener un profesor por su usuario de GitHub
  it('should get teacher by his github user', async () => {

    //añadimos varios profesores
    const teacherName = `Teacher ${Date.now()}`;
    const teacherEmail = `email@example.com ${Date.now()}`;
    const teacherUserName = `githubuser ${Date.now()}`;
    await saveTeacher(teacherName, teacherEmail, teacherUserName);

    //obtenemos los profesores
    const response = await getTeacherByGitHubUser(teacherUserName);

    expect(response).toBe(1);
  });
});