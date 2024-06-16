import * as React from 'react';
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


function HeaderAppBar({rerenderPass, isClosing, setMobileOpen, mobileOpen}){

  const drawerWidth = 240;

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
            localStorage.removeItem("accessToken"); 
            rerenderPass()
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
