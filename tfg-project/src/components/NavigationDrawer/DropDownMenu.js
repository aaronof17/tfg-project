import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useTranslation} from "react-i18next";
import LanguageIcon from '@mui/icons-material/Language';

export default function BasicMenu() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [t,i18n] = useTranslation();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <LanguageIcon sx={{color:'white'}}/>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() =>handleChangeLanguage("es")}>Español</MenuItem>
        <MenuItem onClick={() => handleChangeLanguage("en")}>English</MenuItem>
      </Menu>
    </div>
  );
}