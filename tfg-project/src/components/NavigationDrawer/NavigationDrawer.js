import * as React from 'react';
import './NavigationDrawer.css';
import Box from '@mui/material/Box';
import { useEffect } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import People from '@mui/icons-material/People';
import ChecklistIcon from '@mui/icons-material/Checklist';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import {useTranslation} from "react-i18next";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { getUserData } from '../../functions/gitHubFunctions.js';
import StudentsList from './options/StudentsList/StudentsList.js';
import MakeIssue from './options/MakeIssue/MakeIssue';
import ProfileView from './options/ProfileView/ProfileView.js';
import CreateLabWork from './options/LabWork/CreateLabWork.js';
import WorksList from './options/WorkList/WorkList.js';
import Mark from './options/Mark/Mark.js';
import HeaderAppBar from './HeaderAppBar.js';
import AddStudents from './options/AddStudents/AddStudents.js';
import StudentWorks from './options/StudentWorks/StudentWorks.js'

const drawerWidth = 240;



function ResponsiveDrawer(props) {
  const { window, rerenderPass } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentView, setCurrentView] = React.useState(0);
  const [userData, setUserData] = useState({});
  const [role, setRole] = useState("");
  const [t] = useTranslation();

  const drawerTeacherOptions = [t('navigationDrawer.students'), t('navigationDrawer.addStudents'), t('navigationDrawer.makeIssue'), t('navigationDrawer.makeWork'), t('navigationDrawer.workList'), t('navigationDrawer.mark')];
  const drawerStudentOptions = [t('navigationDrawer.studentLabWorks')];

  let teacherViews = [<StudentsList userData={userData} />, <AddStudents userData={userData}/>, <MakeIssue userData={userData}/>, 
                      <CreateLabWork userData={userData}/>, <WorksList userData={userData}/>, <Mark userData={userData}/>, <ProfileView userData={userData}/>];
  let studentViews = [<StudentWorks userData={userData}/>, <ProfileView userData={userData}/>];
  const adminViews = [];
  const defaultViews = [];

  useEffect(() => {
    getUserData(setUserData).then(() =>{
      setRole("teacher");
      teacherViews = [<StudentsList userData={userData} />, <AddStudents userData={userData}/>, <MakeIssue userData={userData}/>, 
                      <CreateLabWork userData={userData}/>, <WorksList userData={userData}/>, <Mark userData={userData}/>, <ProfileView userData={userData}/>];
      studentViews = [<StudentWorks userData={userData}/>, <ProfileView userData={userData}/>];
    });
    }, []);


  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

 
  const handleListItemClick = (index) => {
    setCurrentView(index);
    handleDrawerClose();
  };

  const iconSelecter = (index) => {
    if(index === 0){
      return (
        <People></People>
      );
    }else if(index === 1){
      return (
        <AddCircleOutlineIcon></AddCircleOutlineIcon>
      );
    }else if(index === 2){
      return (
        <CircleNotificationsIcon></CircleNotificationsIcon>
      );
    }else if(index === 3){
      return (
        <HomeRepairServiceIcon></HomeRepairServiceIcon>
      );
    }else if(index === 4){
      return (
        <ChecklistIcon></ChecklistIcon>
      );
    }else if(index === 5){
      return (
        <BorderColorIcon></BorderColorIcon>
      );
    }else if(index === 6){
      return (
        <AccountBoxIcon></AccountBoxIcon>
      );
    }
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
                iconSelecter(index)
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
        {role==='teacher' && (
        <>
          <Divider />
          <List>
            <ListItem key={t('navigationDrawer.profile')} disablePadding  onClick={() => handleListItemClick(6)}>
              <ListItemButton>
                  <ListItemIcon sx={{ color: 'white' }}>
                    {
                    iconSelecter(6)
                    }
                  </ListItemIcon>
                <ListItemText primary={t('navigationDrawer.profile')} />
                </ListItemButton>
            </ListItem>
          </List>
        </>
        )}
    </div>
  );


  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box className="principalBox" sx={{ display: 'flex' }}>
      <CssBaseline />
      <HeaderAppBar 
        rerenderPass={rerenderPass} isClosing={isClosing}
        setMobileOpen={setMobileOpen} mobileOpen={mobileOpen}
      ></HeaderAppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,
            backgroundColor: '#5D6363', color: 'white'}
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, 
            backgroundColor: '#5D6363', color: 'white'},
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
      className="views"
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` },  }}
      >
        {role === 'teacher' && teacherViews[currentView]} 
        {role === 'student' && studentViews[currentView]} 
        {role === 'admin' && adminViews[currentView]}      
        {role === '' && defaultViews[currentView]}
    </Box>
       <ToastContainer/>
    </Box>
  );
}


export default ResponsiveDrawer;
