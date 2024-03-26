import * as React from 'react';
import { useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import BasicMenu from './DropDownMenu.js';

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
        <BasicMenu></BasicMenu>

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
  );
}

export default HeaderAppBar;
