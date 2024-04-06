import * as React from 'react';
import './NavigationDrawer.css';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
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
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {useTranslation} from "react-i18next";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import StudentsList from './options/StudentsList';
import MakeIssue from './options/MakeIssue/MakeIssue';
import ProfileView from './options/ProfileView/ProfileView.js';
import CreateLabWork from './options/LabWork/CreateLabWork.js';
import WorksList from './options/WorkList/WorkList.js';
import Mark from './options/Mark/Mark.js';
import HeaderAppBar from './HeaderAppBar.js';
import AddStudents from './options/AddStudents/AddStudents.js';

const drawerWidth = 240;



function ResponsiveDrawer(props) {
  const { window, rerenderPass } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentView, setCurrentView] = React.useState(0);
  const [userData, setUserData] = useState({});
  const [t] = useTranslation();

  const drawerOptions = [t('navigationDrawer.students'), t('navigationDrawer.addStudents'), t('navigationDrawer.makeIssue'), t('navigationDrawer.makeWork'), t('navigationDrawer.workList'), t('navigationDrawer.mark')];
  const views = [<FirstView />, <SecondView />, <ThirdView/>, <FourthView/>, <FifthView/>, <SixthView/>, <SeventhView/>];

  useEffect(() => {
    getUserData();
    }, []);

    function FirstView() {
      return (
        <div style={{ flexGrow: 1 }}> 
          <StudentsList userData={userData}></StudentsList>
        </div>
      );
    }
    
    function SecondView() {
      return (
        <div>
          <AddStudents userData={userData} ></AddStudents>
        </div>
      );
    }
    
    function ThirdView() {
      return (
        <div>
          <MakeIssue userData={userData}></MakeIssue>
        </div>
      );
    }
    
    function FourthView() {
      return (
        <div>
          <CreateLabWork userData={userData}></CreateLabWork>
        </div>
      );
    }
    
    function FifthView() {
      return (
        <div>
          <WorksList userData={userData}></WorksList>
        </div>
      );
    }

    function SixthView() {
      return (
        <div>
          <Mark userData={userData}></Mark>
        </div>
      );
    }

    function SeventhView() {
      return (
        <div>
          <ProfileView></ProfileView>
        </div>
      );
    }


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



  async function getUserData() {
    await fetch( "http://localhost:4000/getUserData", {
      method: "GET",
        headers: {
            "Authorization" : "Bearer "+ localStorage.getItem("accessToken")
        }
    }).then((response) => {       
       return response.json();
    }).then((data) => {
      console.log(data);
        setUserData(data);
    })
  }
  
  

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {drawerOptions.map((text, index) => (
          <ListItem key={text} disablePadding  onClick={() => handleListItemClick(index)}>
            <ListItemButton>
              <ListItemIcon>
                {
                iconSelecter(index)
                }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem key={t('navigationDrawer.profile')} disablePadding  onClick={() => handleListItemClick(6)}>
          <ListItemButton>
              <ListItemIcon>
                {
                iconSelecter(6)
                }
              </ListItemIcon>
            <ListItemText primary={t('navigationDrawer.profile')} />
            </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
      className="views"
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {views[currentView]} 
       </Box>
       <ToastContainer/>
    </Box>
  );
}


export default ResponsiveDrawer;
