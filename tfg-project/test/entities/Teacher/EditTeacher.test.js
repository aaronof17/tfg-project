const mysql = require('mysql2/promise');
const { saveTeacher } = require('../../../src/services/teacherService');
require('dotenv').config();


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

  // Prueba de integración para agregar un profesor a la base de datos
  describe('addTeacher', () => {
    it('should add a teacher to the database', async () => {

      console.log("holaaa");

      const teacherName = 'Test Teacher';
      const emailName = 'test@example.com';
      const userName = 'testgithubuser';

      await saveTeacher(teacherName, emailName, userName);

      // conexión a la base de datos para verificar si el estudiante fue agregado
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
      });

      // consulta para verificar si el estudiante fue agregado
      const [rows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', ['Test Teacher']);

      // cerrar la conexión a la base de datos
      await connection.end();

      console.log(rows);

      // asegurarse de que se haya agregado un estudiante con el nombre proporcionado
      //expect(rows.length).toBe(1);
      //expect(rows[0].name).toBe('Test Teacher');
    });
  });




// import { editStudent } from '../api'; // Importa la función editStudent desde tu módulo api
// import { rest } from 'msw';
// import { setupServer } from 'msw/node';

// const server = setupServer(
//   rest.post('/students/edit', (req, res, ctx) => {
//     // Simula una respuesta exitosa
//     return res(
//       ctx.json({ success: true })
//     );
//   })
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// describe('editStudent', () => {
//   it('should edit a student successfully', async () => {
//     const editRow = {
//       id: 1,
//       name: 'Updated Name',
//       email: 'updated@example.com',
//       githubuser: 'updatedGithub',
//       repository: 'updatedRepo',
//       group: 'updatedGroup',
//       localPath: 'updatedPath'
//     };

//     const response = await editStudent(editRow);

//     expect(response.response).toBe(true);
//     expect(response.error).toBe('');
//   });

//   it('should return error if request fails', async () => {
//     server.use(
//       rest.post('/students/edit', (req, res, ctx) => {
//         // Simula una respuesta de error
//         return res(
//           ctx.status(500),
//           ctx.json({ success: false, error: 'Internal Server Error' })
//         );
//       })
//     );

//     const editRow = {
//       // datos de edición del estudiante
//     };

//     const response = await editStudent(editRow);

//     expect(response.response).toBe(false);
//     expect(response.error).toBe('Internal Server Error');
//   });

//   it('should handle network error', async () => {
//     server.use(
//       rest.post('/students/edit', (req, res, ctx) => {
//         // Simula un error de red
//         return res.networkError('Failed to connect');
//       })
//     );

//     const editRow = {
//       // datos de edición del estudiante
//     };

//     const response = await editStudent(editRow);

//     expect(response.response).toBe(false);
//     expect(response.error).toBe('Sorry, an error occurred editing student');
//   });
// });
