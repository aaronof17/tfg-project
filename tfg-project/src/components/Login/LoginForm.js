import './LoginForm.css';
import es_flag from '../../assets/images/es_flag.png';
import en_flag from '../../assets/images/en_flag.jpg';
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@mui/material/Box';

const CLIENT_ID = "b771595a6c15c6653d02";

function Login(){

    const [t,i18n] = useTranslation();

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    }


    function loginWithGitHub(){
        window.location.assign("https://github.com/login/oauth/authorize?client_id="+CLIENT_ID);
    }

    return(
        <div className="overlay">
            <div className="wrapper">
                <Box>
                    <h1>{t('login.welcome')}</h1>
                    <h2>{t('login.joinUs')}</h2>
                    <button type="submit" onClick={loginWithGitHub}>
                    {t('login.login')} <i className="fa fa-github"></i> 
                    </button>
        
                    <div className="translation">
                        <button type="submit" onClick={() => handleChangeLanguage("es")}>
                            <img src={es_flag} alt="esbutton" />
                        </button>
                        <button type="submit" onClick={() => handleChangeLanguage("en")}>
                            <img src={en_flag} alt="enbutton" />
                        </button>
                    </div>
                </Box>
            </div>
        </div>
    );

}

export default Login;