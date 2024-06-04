// const mysql = require('mysql2/promise');
// const { addStudentToDatabase } = require('../path/to/your/code');

// // prueba de integración para agregar un estudiante a la base de datos
// describe('addStudentToDatabase', () => {
//   it('should add a student to the database', async () => {
//     // datos del estudiante a agregar
//     const studentData = {
//       name: 'Test Student',
//       email: 'test@example.com',
//       githubuser: 'testgithubuser',
//       repository: 'testrepository',
//       group: 'testgroup',
//       localPath: 'testpath'
//     };

//     // llamada a la función para agregar el estudiante a la base de datos
//     await addStudentToDatabase(studentData);

//     // conexión a la base de datos para verificar si el estudiante fue agregado
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'usuario',
//       password: 'contraseña',
//       database: 'nombre_base_de_datos',
//       port: 3306
//     });

//     // consulta para verificar si el estudiante fue agregado
//     const [rows] = await connection.execute('SELECT * FROM students WHERE name = ?', ['Test Student']);

//     // cerrar la conexión a la base de datos
//     await connection.end();

//     // asegurarse de que se haya agregado un estudiante con el nombre proporcionado
//     expect(rows.length).toBe(1);
//     expect(rows[0].name).toBe('Test Student');
//   });
// });



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
