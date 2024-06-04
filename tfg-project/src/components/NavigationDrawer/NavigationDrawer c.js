import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import {useTranslation} from "react-i18next";
import {ToastContainer, toast} from "react-toastify";

import './NavigationDrawer.css';
import 'react-toastify/dist/ReactToastify.css';

import {getUserData} from '../../functions/gitHubFunctions.js';
import {getRoleByGitHubUser} from '../../services/teacherService.js';
import StudentsList from './options/StudentsList/StudentsList.js';
import MakeIssue from './options/MakeIssue/MakeIssue';
import ProfileView from './options/ProfileView/ProfileView.js';
import CreateLabWork from './options/LabWork/CreateLabWork.js';
import WorksList from './options/WorkList/WorkList.js';
import Mark from './options/Mark/Mark.js';
import HeaderAppBar from './HeaderAppBar.js';
import AddStudents from './options/AddStudents/AddStudents.js';
import StudentWorks from './options/StudentWorks/StudentWorks.js'
import AddTeachers from './options/AddTeachers/AddTeachers.js';
import TeachersList from './options/TeachersList/TeachersList.js';
import AddLabGroup from './options/AddLabGroup/AddLabGroup.js';
import LabGroupList from './options/LabGroupList/LabGroupList.js';
import DefaultView from './options/DefaultView/DefaultView.js';
import strings from '../../assets/files/strings.json'

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import People from '@mui/icons-material/People';
import ChecklistIcon from '@mui/icons-material/Checklist';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = useState({});
  const [role, setRole] = useState("");
  const [currentView, setCurrentView] = React.useState(0);
  const [t] = useTranslation();

  const drawerTeacherOptions = [t('navigationDrawer.students'), t('navigationDrawer.addStudents'), t('navigationDrawer.makeIssue'), t('navigationDrawer.makeWork'), t('navigationDrawer.workList'), t('navigationDrawer.mark')];
  const drawerStudentOptions = [t('navigationDrawer.studentLabWorks')];
  const drawerAdminOptions = [t('navigationDrawer.addTeachers'), t('navigationDrawer.teachersList'), t('navigationDrawer.addGroups'), t('navigationDrawer.groupsList')];
  const drawerDefaultOptions = [t('navigationDrawer.defaultView')];

  let teacherViews = [<StudentsList userData={userData} />, <AddStudents userData={userData}/>, <MakeIssue userData={userData}/>, 
                      <CreateLabWork userData={userData}/>, <WorksList userData={userData}/>, <Mark userData={userData}/>, <ProfileView userData={userData}/>];
  let studentViews = [<StudentWorks userData={userData}/>, <ProfileView userData={userData}/>];
  let adminViews = [<AddTeachers userData={userData}/>,<TeachersList userData={userData}/>, <AddLabGroup  userData={userData}/>, <LabGroupList userData={userData}/>];
  let defaultViews = [<DefaultView/>];

  const teacherIcons = [ <People/>, <AddCircleOutlineIcon/>, <CircleNotificationsIcon/>, <HomeRepairServiceIcon/>, <ChecklistIcon/>, <BorderColorIcon/>, <AccountBoxIcon/>];
  const adminIcons = [<AddCircleOutlineIcon/>,<FormatListBulletedIcon/>,<AddCircleOutlineIcon/>,<FormatListBulletedIcon/>];

  useEffect(() => {

    const fetchInfo = async () => {
      const userDataResponse = await getUserData(setUserData);

      if (userDataResponse.login) {
        const role = await getRoleByGitHubUser(userDataResponse.login);
        if(role !== undefined){
          setRole(role);
          //setRole("admin");
        }else{
          let roleDefault = "";
          setRole(roleDefault);
        }
      }

      // teacherViews = [<StudentsList userData={userData} />, <AddStudents userData={userData}/>, <MakeIssue userData={userData}/>, 
      //                   <CreateLabWork userData={userData}/>, <WorksList userData={userData}/>, <Mark userData={userData}/>, <ProfileView userData={userData}/>];
      // studentViews = [<StudentWorks userData={userData}/>];
      // adminViews = [<AddTeachers userData={userData}/>,<TeachersList userData={userData}/>, <AddLabGroup  userData={userData}/>, <LabGroupList userData={userData}/>];
      // defaultViews = [<DefaultView/>];

    };

    fetchInfo();
    }, []);

  const handleListItemClick = (index) => {
    setCurrentView(index);
    handleDrawerClose();
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar />
        {role==='teacher' && drawerTeacherOptions.map((text, index) => (
          <List>
          <ListItem key={text} disablePadding  onClick={() => handleListItemClick(index)}>
            <ListItemButton>
              <ListItemIcon sx={{ color: 'white' }}>
                {
                teacherIcons[index]
                }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
          </List>
        ))}
        {role==='student' && drawerStudentOptions.map((text, index) => (
          <List>
          <ListItem key={text} disablePadding  onClick={() => handleListItemClick(index)}>
            <ListItemButton>
              <ListItemIcon sx={{ color: 'white' }}>
                <HomeRepairServiceIcon></HomeRepairServiceIcon>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
          </List>
        ))}
        {role==='admin' && drawerAdminOptions.map((text, index) => (
          <List>
          <ListItem key={text} disablePadding  onClick={() => handleListItemClick(index)}>
            <ListItemButton>
              <ListItemIcon sx={{ color: 'white' }}>
                {
                  adminIcons[index]
                }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
          </List>
        ))}
        {role==='teacher' && (
        <>
          <Divider />
          <List>
            <ListItem key={t('navigationDrawer.profile')} disablePadding  onClick={() => handleListItemClick(6)}>
              <ListItemButton>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AccountBoxIcon/>
                  </ListItemIcon>
                <ListItemText primary={t('navigationDrawer.profile')} />
                </ListItemButton>
            </ListItem>
          </List>
        </>
        )}
        {role==="" && drawerDefaultOptions.map((text, index) => (
          <List>
          <ListItem key={text} disablePadding  onClick={() => handleListItemClick(index)}>
            <ListItemButton>
              <ListItemIcon sx={{ color: 'white' }}>
                <VisibilityIcon/>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
          </List>
        ))}
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {drawer}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box
      className="views"
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` },  }}
      >
        {role === strings.strings.teacher && teacherViews[currentView]} 
        {role === strings.strings.student && studentViews[currentView]} 
        {role === strings.strings.admin && adminViews[currentView]}      
        {role === strings.strings.default && defaultViews[currentView]}
    </Box>
      <ToastContainer/>
      </Main>
    </Box>
  );
}