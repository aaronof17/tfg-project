import * as React from 'react';
import { useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import BasicMenu from './DropDownMenu.js';
import './HeaderAppBar.css';

import {deleteAppToken} from "../../services/gitHubFunctions.js";

function HeaderAppBar({rerenderPass, isClosing, setMobileOpen, mobileOpen}){
  const [t,i18n] = useTranslation();

  const drawerWidth = 240;
  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };


  return (
      <AppBar
      className='app-bar'
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: '#5D6363'
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
        <BasicMenu></BasicMenu>
        <Button
          variant="contained"
          onClick={() => {
            console.log("TOKEN ",localStorage.getItem("accessToken"));
            deleteAppToken(localStorage.getItem("accessToken"), rerenderPass);
            // localStorage.removeItem("accessToken"); 
            // rerenderPass()
          }}
          sx={{backgroundColor:"#c9c2c2", color:"black"}}
        > 
          <LogoutIcon/>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default HeaderAppBar;
