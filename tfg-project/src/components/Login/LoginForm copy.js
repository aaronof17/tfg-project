import './LoginForm.css';

const CLIENT_ID = "b771595a6c15c6653d02";

function Login(){

    function loginWithGitHub(){
        window.location.assign("https://github.com/login/oauth/authorize?client_id="+CLIENT_ID);
    }

    return(
        <div className="wrapper">
            <h3>User is not login</h3>
            <button onClick={loginWithGitHub}>
            Login with Github
            </button>
        </div>
    );

}

export default Login;