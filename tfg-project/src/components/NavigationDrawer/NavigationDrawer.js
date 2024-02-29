import * as React from 'react';
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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import People from '@mui/icons-material/People';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {useTranslation} from "react-i18next";

import StudentsList from './options/StudentsList';
import MakeIssue from './options/MakeIssue';


const drawerWidth = 240;

function FirstView() {
  return (
    <div style={{ flexGrow: 1 }}> 
      <StudentsList></StudentsList>
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
      <MakeIssue></MakeIssue>
    </div>
  );
}

const views = [<FirstView />, <SecondView />, <ThirdView/>];

function ResponsiveDrawer(props) {
  const { window, rerenderPass } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentView, setCurrentView] = React.useState(0);
  const [userData, setUserData] = useState({});

  const [t,i18n] = useTranslation();

  const drawerOptions = [t('navigationDrawer.students'), t('navigationDrawer.addStudents'), t('navigationDrawer.makeIssue')];

  useEffect(() => {
    getUserData();
    }, []);


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
    }
  };

  const chargeProfile = () => {
    
  };

  const getProfileImage = () => {
    return userData.avatar_url;
  };

  const getProfileName = () => {
    return userData.login;
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
      <Divider />
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
  
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
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
         
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Avatar src={getProfileImage()} />}
          >
            <a href={userData.html_url} style={{"color":"white"}}>
              {getProfileName()}
            </a>
          </Button>

          <Box sx={{ flexGrow: 1 }} /> 

          <button id="esFlag" onClick={() => handleChangeLanguage("es")}>
            <img src="es_flag.png" alt="spanish flag" width="20" height="10"></img>
          </button>
          <button id="enFlag" onClick={() => handleChangeLanguage("en")}>
              <img src="en_flag.jpg" alt="english flag" width="20" height="10"></img>
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
