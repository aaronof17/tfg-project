import './LoginForm.css';

const CLIENT_ID = "b771595a6c15c6653d02";

function Login(){

    function loginWithGitHub(){
        window.location.assign("https://github.com/login/oauth/authorize?client_id="+CLIENT_ID);
    }

    return(
        <div className="wrapper">
            <formn>
                <h1>WELCOME</h1>
                <h2>Let's do it</h2>
                <button type="submit" onClick={loginWithGitHub}>
                    Login with Github
                </button>
                <div className="translation">
                    <button type="submit" >
                    ES
                    </button>
                    <button type="submit">
                        EN
                    </button>
                </div>
            </formn>
        </div>
    );

}

export default Login;