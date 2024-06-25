const mysql = require('mysql2/promise');
const {saveStudent} = require('../../src/services/studentService');
const {saveTeacher} = require('../../src/services/teacherService');
const {saveMark} = require('../../src/services/markService');
const {saveLabGroup} = require('../../src/services/labGroupService');
const {deleteWork,editWork,saveWorks,getLabWorks,getActiveLabWorks,getWorksByStudent, 
      getWorksByGroup, getWorksBySubject, getWorksByStudentAndGroup,
      getWorksAndMarksByStudentAndGroup, getWorksBySubjectAndStudent} = require('../../src/services/labWorkService');
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
    await connection.execute('DELETE FROM students');
    await connection.execute('DELETE FROM marks');
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


  //Prueba para obtener las prácticas de laboratorio que tiene asignado un profesor
  it('should get lab works for teacher', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio y se los asignamos al profesor añadido anteriormente
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

    const groupName3 = `Group Name ${Date.now()}`;
    const groupSubject3 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName3, groupSubject3, teacherRows[0].TeacherID);

    //añadimos varias prácticas de laboratorio
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
        "initialDate": "2024-01-10 19:00",
        "finalDate": "2024-01-11 19:45"
      },
      {
        "labGroupName": groupName3,
        "initialDate": "2024-01-10 19:00",
        "finalDate": "2024-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

    //obtenemos las prácticas de laboratorio
    let worksList;
    await getLabWorks((wl)=>{worksList=wl},teacherRows[0].TeacherID);
    
    expect(worksList.length).toBe(3);
    expect(worksList[0].title).toBe(workTitle);
    expect(worksList[0].description).toBe(workDescription);
    expect(worksList[0].percentage).toBe(workPercentage);
    expect(worksList[0].labgroupNameFK).toBe(groupName1);
    expect(worksList[1].title).toBe(workTitle);
    expect(worksList[1].description).toBe(workDescription);
    expect(worksList[1].percentage).toBe(workPercentage);
    expect(worksList[1].labgroupNameFK).toBe(groupName2);
    expect(worksList[2].title).toBe(workTitle);
    expect(worksList[2].description).toBe(workDescription);
    expect(worksList[2].percentage).toBe(workPercentage);
    expect(worksList[2].labgroupNameFK).toBe(groupName3);
  }); 


  //Prueba para obtener las prácticas de laboratorio que estén activas
  it('should get active lab works', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio y se los asignamos al profesor añadido anteriormente
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

    //añadimos varias prácticas de laboratorio
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
        "initialDate": "2024-01-10 19:00",
        "finalDate": "2024-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);
    const [workRows] = await connection.execute('SELECT * FROM worklabs WHERE labgroupNameFK = ?', [groupName1]);

    //editamos una práctica de laboratorio para que no esté activa
    const editActiveWorks = 0;

    const workInfo = {
      worklabID: workRows[0].worklabID,
      title: workTitle,
      description: workDescription,
      percentage: workPercentage,
      initialdate: "2024-01-10 19:00",
      finaldate: "2024-01-11 19:45",
      active: editActiveWorks
    }

    await editWork(workInfo);

    //obtenemos las prácticas de laboratorio que estén activas, que debería ser la práctica 2
    let worksList;
    await getActiveLabWorks((wl)=>{worksList=wl},teacherRows[0].TeacherID);
    
    expect(worksList.length).toBe(1);
    expect(worksList[0].title).toBe(workTitle);
    expect(worksList[0].description).toBe(workDescription);
    expect(worksList[0].percentage).toBe(workPercentage);
    expect(worksList[0].labgroupNameFK).toBe(groupName2);
  }); 


  //Prueba para obtener las prácticas de laboratorio para un estudiante en específico
  it('should get lab works for student', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

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

    //añadimos varias prácticas de laboratorio
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
        "initialDate": "2025-01-10 19:00",
        "finalDate": "2025-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

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

    //obtenemos la práctica del estudiante 2
    let worksList;
    await getWorksByStudent(studentEmail2,(wl)=>{worksList=wl},teacherRows[0].TeacherID);
    
    expect(worksList.length).toBe(1);
    expect(worksList[0].title).toBe(workTitle);
    expect(worksList[0].labgroupNameFK).toBe(groupName2);
  }); 

  //Prueba para obtener las prácticas de laboratorio para un grupo de laboratorio en específico
  it('should get lab works by group', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

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

    //añadimos varias prácticas de laboratorio
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
        "initialDate": "2025-01-10 19:00",
        "finalDate": "2025-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

    //obtenemos la práctica para el grupo 1
    let worksList;
    await getWorksByGroup(groupName1,(wl)=>{worksList=wl},teacherRows[0].TeacherID);
    
    expect(worksList.length).toBe(1);
    expect(worksList[0].title).toBe(workTitle);
    expect(worksList[0].description).toBe(workDescription);
    expect(worksList[0].percentage).toBe(workPercentage);
    expect(worksList[0].labgroupNameFK).toBe(groupName1);
  }); 


  //Prueba para obtener las prácticas de laboratorio para una asignatura en específico
  it('should get lab works by subject', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio y se los asignamos al profesor añadido anteriormente, dos de ellos tendrán la misma asignatura asignada
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);
    
    const groupName3 = `Group Name ${Date.now()}`;
    await saveLabGroup(groupName3, groupSubject1, teacherRows[0].TeacherID);

    const [groupRows1] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);
    const [groupRows2] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);
    const [groupRows3] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName3]);

    //añadimos varias prácticas de laboratorio, una a cada grupo creado anteriormente
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
        "initialDate": "2025-01-10 19:00",
        "finalDate": "2025-01-11 19:45"
      },
      {
        "labGroupName": groupName3,
        "initialDate": "2026-01-10 19:00",
        "finalDate": "2026-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

    //obtenemos la práctica para la asignatura del grupo 1 y 2
    let worksList;
    await getWorksBySubject(groupSubject1,(wl)=>{worksList=wl},teacherRows[0].TeacherID);
    
    expect(worksList.length).toBe(2);
    expect(worksList[0].title).toBe(workTitle);
    expect(worksList[0].description).toBe(workDescription);
    expect(worksList[0].percentage).toBe(workPercentage);
    expect(worksList[0].labgroupNameFK).toBe(groupName1);
    expect(worksList[1].title).toBe(workTitle);
    expect(worksList[1].description).toBe(workDescription);
    expect(worksList[1].percentage).toBe(workPercentage);
    expect(worksList[1].labgroupNameFK).toBe(groupName3);
  }); 


  //Prueba para obtener las prácticas de laboratorio para un grupo y un estudiante en específico
  it('should get lab works by group and student', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio y se los asignamos al profesor añadido anteriormente, dos de ellos tendrán la misma asignatura asignada
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

    const [groupRows1] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);
    const [groupRows2] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);

    //añadimos varias prácticas de laboratorio, una a cada grupo creado anteriormente
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
        "initialDate": "2025-01-10 19:00",
        "finalDate": "2025-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

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

    const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail1]);

    //obtenemos la práctica para el grupo 1 y el estudiante 1
    const worksList = await getWorksByStudentAndGroup(studentRows[0].studentsID,groupName1,teacherRows[0].TeacherID);

    expect(worksList.response).toBe(true);
    expect(worksList.data.length).toBe(1);
    expect(worksList.data[0].title).toBe(workTitle);
    expect(worksList.data[0].labgroupNameFK).toBe(groupName1);

  }); 

  //Prueba para obtener las prácticas de laboratorio con sus calificacione para un grupo y un estudiante en específico
  it('should get lab works and marks by group and student', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio y se los asignamos al profesor añadido anteriormente, dos de ellos tendrán la misma asignatura asignada
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

    const [groupRows1] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);
    const [groupRows2] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);

    //añadimos varias prácticas de laboratorio, una a cada grupo creado anteriormente
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
        "initialDate": "2025-01-10 19:00",
        "finalDate": "2025-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

    const [workRows1] = await connection.execute('SELECT * FROM worklabs WHERE labgroupNameFK = ?', [groupName1]);
    const [workRows2] = await connection.execute('SELECT * FROM worklabs WHERE labgroupNameFK = ?', [groupName2]);

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

    const [studentRows1] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail1]);
    const [studentRows2] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail2]);

    //calificamos a los dos alumnos en sus prácticas
    //calificamos al alumno en la práctica de laboratorio
    const markNumber1 = createRandomNumber(1);
    const markComment1 = `Comment ${Date.now()}`;
    await saveMark(workRows1[0].worklabID, studentRows1[0].studentsID, markComment1, markNumber1);

    const markNumber2 = createRandomNumber(1);
    const markComment2 = `Comment ${Date.now()}`;
    await saveMark(workRows2[0].worklabID, studentRows2[0].studentsID, markComment2, markNumber2);

    //obtenemos la práctica y la calificación para el estudiante 1 y para el grupo 1
    const worksList = await getWorksAndMarksByStudentAndGroup(studentRows1[0].studentsID,groupName1,teacherRows[0].TeacherID);

    expect(worksList.response).toBe(true);
    expect(worksList.data.length).toBe(1);
    expect(worksList.data[0].title).toBe(workTitle);
    expect(worksList.data[0].groupName).toBe(groupName1);
    expect(worksList.data[0].studentID).toBe(studentRows1[0].studentsID);
    expect(parseInt(worksList.data[0].mark)).toBe(markNumber1);

  }); 


  //Prueba para obtener las prácticas de laboratorio para una asignatura y un estudiante en específico
  it('should get lab works by subject and student', async () => {

    //añadimos un profesor
    const teacherName = `Teacher ${Date.now()}`; ;
    const teaacherEmail = `teacher@example.com ${Date.now()}`;
    const teacherlUserName = `teacherGithubuser ${Date.now()}`;
    await saveTeacher(teacherName, teaacherEmail, teacherlUserName);

    const [teacherRows] = await connection.execute('SELECT * FROM teachers WHERE name = ?', [teacherName]);

    //añadimos varios grupos de laboratorio y se los asignamos al profesor añadido anteriormente, dos de ellos tendrán la misma asignatura asignada
    const groupName1 = `Group Name ${Date.now()}`;
    const groupSubject1 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName1, groupSubject1, teacherRows[0].TeacherID);

    const groupName2 = `Group Name ${Date.now()}`;
    const groupSubject2 = `SUBJECT ${Date.now()}`;
    await saveLabGroup(groupName2, groupSubject2, teacherRows[0].TeacherID);

    const [groupRows1] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName1]);
    const [groupRows2] = await connection.execute('SELECT * FROM labgroups WHERE name = ?', [groupName2]);

    //añadimos varias prácticas de laboratorio, una a cada grupo creado anteriormente
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
        "initialDate": "2025-01-10 19:00",
        "finalDate": "2025-01-11 19:45"
      }
    ]

    await saveWorks(datesForWorks, workTitle, workDescription, workPercentage, teacherRows[0].TeacherID);

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

    const [studentRows] = await connection.execute('SELECT * FROM students WHERE email = ?', [studentEmail2]);

    //obtenemos la práctica para la asignatura del grupo 2 y el estudiante 2
    let worksList;
    await getWorksBySubjectAndStudent(groupSubject2,(wl)=>{worksList=wl},studentRows[0].studentsID);

    expect(worksList.length).toBe(1);
    expect(worksList[0].title).toBe(workTitle);
    expect(worksList[0].description).toBe(workDescription);
    expect(worksList[0].percentage).toBe(workPercentage);
    expect(worksList[0].groupName).toBe(groupName2);

  }); 


});