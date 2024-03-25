import * as React from 'react';
import './NavigationDrawer.css';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useEffect } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import People from '@mui/icons-material/People';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {useTranslation} from "react-i18next";

import StudentsList from './options/StudentsList';
import MakeIssue from './options/MakeIssue/MakeIssue';
import ProfileView from './options/ProfileView/ProfileView.js';
import CreateLabWork from './options/LabWork/CreateLabWork.js';
import Mark from './options/Mark/Mark.js';


const drawerWidth = 240;




function ResponsiveDrawer(props) {
  const { window, rerenderPass } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentView, setCurrentView] = React.useState(0);
  const [userData, setUserData] = useState({});
  const [t,i18n] = useTranslation();

  const drawerOptions = [t('navigationDrawer.students'), t('navigationDrawer.addStudents'), t('navigationDrawer.makeIssue'), t('navigationDrawer.makeWork'), t('navigationDrawer.mark')];
  const views = [<FirstView />, <SecondView />, <ThirdView/>, <FourthView/>, <FifthView/>, <SixthView/>];

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
          <Typography variant="h4">Second View</Typography>
          {/* Add content for the second view here */}
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
          <Mark userData={userData}></Mark>
        </div>
      );
    }

    function SixthView() {
      return (
        <div>
          <ProfileView></ProfileView>
        </div>
      );
    }

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  }

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
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
        <BorderColorIcon></BorderColorIcon>
      );
    }else if(index === 5){
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
        <ListItem key={t('navigationDrawer.profile')} disablePadding  onClick={() => handleListItemClick(5)}>
          <ListItemButton>
              <ListItemIcon>
                {
                iconSelecter(5)
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
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
          <MenuIcon />
          </IconButton>
        

          <Box sx={{ flexGrow: 1 }} /> 

          <button id="esFlag" onClick={() => handleChangeLanguage("es")}>
            {/* <img src="es_flag.png" alt="spanish flag" width="20" height="10"></img> */}
            es
          </button>
          <button id="enFlag" onClick={() => handleChangeLanguage("en")}>
              {/* <img src="en_flag.jpg" alt="english flag" width="20" height="10"></img> */}
              en
          </button>

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              localStorage.removeItem("accessToken"); 
              rerenderPass()
          }}
          > 
            Log Out
          </Button>


        </Toolbar>
      </AppBar>
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
      className="probina"
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {views[currentView]} 
       </Box>
    </Box>
  );
}


export default ResponsiveDrawer;
