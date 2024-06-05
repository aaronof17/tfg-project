const mysql = require('mysql2/promise');
const { saveTeacher, editTeacher, deleteTeacher } = require('../../../src/services/teacherService');
require('dotenv').config();
require('../../setupFetch');

global.localStorage = {
  getItem: (key) => {
    if (key === 'accessToken') {
      return 'mockAccessToken'; // Token de acceso de prueba
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

  // Limpiar la tabla de teachers antes de cada prueba
  beforeEach(async () => {
    await connection.execute('DELETE FROM teachers');
  });

  // Cerrar la conexión a la base de datos después de todas las pruebas
  afterAll(async () => {
    await connection.end();
  });

  // Prueba para agregar un profesor a la base de datos
  describe('addTeacher', () => {
    it('should add a teacher to the database', async () => {
      const teacherName = 'Test Teacher';
      const emailName = 'test@example.com';
      const userName = 'testgithubuser';

      await saveTeacher(teacherName, emailName, userName);

      const [rows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

      expect(rows.length).toBe(1);
      expect(rows[0].name).toBe(teacherName);
      expect(rows[0].email).toBe(emailName);
      expect(rows[0].githubProfile).toBe(userName);
    });
  });

  // Prueba para editar un profesor en la base de datos
  describe('editTeacher', () => {
    it('should edit a teacher in the database', async () => {
      const originalName = 'Original Teacher';
      const originalEmail = 'original@example.com';
      const originalUserName = 'originalgithubuser';
      await saveTeacher(originalName, originalEmail, originalUserName);

      const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [originalName]);
      
      const teacherId = teacherRows[0].TeacherID;
      const editedName = 'Edited Teacher';
      const editedEmail = 'edited@example.com';
      const editedUserName = 'editedgithubuser';

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
  });


   // Prueba para borrar un profesor de la base de datos
   describe('deleteTeacher', () => {
    it('should delete a teacher in the database', async () => {
      const originalName = 'Original Teacher to Delete';
      const originalEmail = 'originalDelete@example.com';
      const originalUserName = 'originalDeletegithubuser';
      await saveTeacher(originalName, originalEmail, originalUserName);

      const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [originalName]);
      
      const teacherId = teacherRows[0].TeacherID;

      const teacherInfo = {
        email: originalEmail,
      }
      
      await deleteTeacher(teacherInfo);

      const [rows] = await connection.execute('SELECT * FROM teachers WHERE email = ?', [teacherId]);

      expect(rows.length).toBe(0);
    });
  });
});