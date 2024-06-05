const mysql = require('mysql2/promise');
const {saveTeacher} = require('../../src/services/teacherService');
const {saveLabGroup} = require('../../src/services/labGroupService');
const {deleteWork,editWork,saveWorks} = require('../../src/services/labWorkService');
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

describe('Lab Work Management', () => {
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
  });


  afterAll(async () => {
    await connection.end();
  });

  //Prueba para agregar una práctica de laboratorio a la base de datos
    it('should add a lab work to the database', async () => {

        //añadimos un profesor
        const teacherName = `Teacher ${Date.now()}`; ;
        const teaacherEmail = `teacher@example.com ${Date.now()}`;
        const teacherlUserName = `teacherGithubuser ${Date.now()}`;
        await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

        const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

        //añadimos dos grupos de laboratorio y se los asignamos al profesor añadido anteriormente
        const groupName1 = `Group Name ${Date.now()}`;
        const groupSubject1 = `SUBJECT ${Date.now()}`;

        await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

        const groupName2 = `Group Name ${Date.now()}`;
        const groupSubject2 = `SUBJECT ${Date.now()}`;

        await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

        //añadimos una práctica de laboratorio
        const workTitle = `Title ${Date.now()}`;
        const workPercentage = createRandomNumber(5);
        const workDescription = `Description ${Date.now()}`;
        const datesForWorks = [
          {
            "labGroupName": groupName1,
            "initialDate": "2024-01-10 19:00",
            "finalDate": "2024-01-11 19:45"
          },
          {
            "labGroupName": groupName2,
            "initialDate": "2024-02-01 19:17",
            "finalDate": "2024-02-02 19:14"
          }
        ]

        await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

        const [workRows1] = await connection.execute('SELECT * FROM worklabs WHERE title = ?', [workTitle]);

        expect(workRows1.length).toBe(2);
        expect(workRows1[0].title).toBe(workTitle);
        expect(workRows1[0].description).toBe(workDescription);
        expect(workRows1[0].percentage).toBe(workPercentage);
        expect(workRows1[1].title).toBe(workTitle);
        expect(workRows1[1].description).toBe(workDescription);
        expect(workRows1[1].percentage).toBe(workPercentage);
    });

    //Prueba para editar una práctica de laboratorio
    it('should edit a lab work to the database', async () => {

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
      const [workRows1] = await connection.execute('SELECT * FROM worklabs WHERE title = ?', [workTitle]);

      //editamos una práctica de laboratorio
      const editWorkTitle = `Title ${Date.now()}`;
      const editWorkPercentage = createRandomNumber(5);
      const editWorkDescription = `Description ${Date.now()}`;
      const editIDateForWorks = "2025-01-10 19:00";
      const editFDateForWorks = "2025-02-10 17:00";
      const editActiveWorks = 0;

      const workInfo = {
        worklabID: workRows1[0].worklabID,
        title: editWorkTitle,
        description: editWorkDescription,
        percentage: editWorkPercentage,
        initialdate: editIDateForWorks,
        finaldate: editFDateForWorks,
        active: editActiveWorks
      }

      await editWork(workInfo);

      const [workRows2] = await connection.execute('SELECT * FROM worklabs WHERE title = ?', [editWorkTitle]);

      expect(workRows2.length).toBe(1);
      expect(workRows2[0].title).toBe(editWorkTitle);
      expect(workRows2[0].description).toBe(editWorkDescription);
      expect(workRows2[0].percentage).toBe(editWorkPercentage);

  });

  //Prueba para eliminar una práctica de laboratorio
  it('should delete a lab work to the database', async () => {

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
    const [workRows1] = await connection.execute('SELECT * FROM worklabs WHERE title = ?', [workTitle]);

    //eliminamos una práctica de laboratorio
    await deleteWork(workRows1[0].worklabID);

    const [workRows2] = await connection.execute('SELECT * FROM worklabs WHERE worklabID = ?', [workRows1[0].worklabID]);

    expect(workRows2.length).toBe(0);
});

});