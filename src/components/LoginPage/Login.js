import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core'

export const Login = (props) => {
  const { userData, setUserData }= props.userDataState;
  const { message, setMessage } = props.messageState;
  const { access, setAccess } = props.accessState;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${props.url}/login`, { 
      username: userData.username,
      password: userData.password 
    })
    .then(response => {
      const data = response.data;
      if (response.status === 200) {
        localStorage.setItem('accessToken', data.data.jwt);
        setUserData({
          username: data.data.user.username,
          bio: data.data.user.bio,
          rep: data.data.user.rep
        });
        props.history.push('/dashboard')
      };
      setAccess(data.success);
      setMessage(data.message)
	})
	.catch(err => {
		setMessage(err.message);
	})
  }
  return (
      <div className="auth-wrap">
      <div className="split left">
        <div className='auth-title'><span style={{fontWeight: "400"}}>Chattitude |</span>  LOG IN</div>
        <div className="centered">
		<p style={{backgroundColor: "#f28182", color: "white"}}>{message}</p>
          <form className="form-wrap" onSubmit={handleSubmit}>
            <TextField style={{margin: "0 0 1rem 0"}} fullWidth required 
              id="outlined-basic" 
              variant="outlined" 
              label="username" 
              type="text" 
              name="username" 
              onChange={handleChange} 
            />
            <TextField style={{margin: "0 0 1rem 0"}} fullWidth required 
              id="outlined-basic" 
              variant="outlined" 
              label="password" 
              type="password" 
              name="password" 
              onChange={handleChange} />
            <div>
            <Button style={{backgroundColor: "#74D69D"}} fullWidth
              variant="contained" 
              type="submit" 
              color="primary"
            > Submit
            </Button>
            </div>
          </form>
          <div>Don't have an account yet? {<Link to="/register">Register</Link>}</div>
        </div>
        
      </div>
    <div className="split right split-rect">
      <div className="centered">
        <img style={{height: "20rem"}} src={require('../../assets/auth.svg')}/>
      </div>
    </div>
    </div>  
  );
}

export const Logout = (props) => {
  const { access, setAccess } = props.accessState;

  const handleClick = () => {
    localStorage.removeItem('accessToken');
    setAccess(false);
    props.history.push('/');
  }

  return(
    <div className="logout-button-container">
      <Button
        style={{backgroundColor: "#FF8383", padding: "0.25rem 0.75rem", color: "white"}} 
        variant="contained" 
        type="submit"                                 
        onClick={handleClick}
      >Log out</Button>
    </div>
  );
};
