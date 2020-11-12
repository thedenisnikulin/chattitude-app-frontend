import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core'

const Register = (props) => {
    const { userData, setUserData }= props.userDataState;
    const { message, setMessage } = props.messageState;
  
    const handleChange = (e) => {
      const { value, name } = e.target;
      setUserData({ ...userData, [name]: value });
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post(`${props.url}/register`, { 
        username: userData.username,
        bio: userData.bio,
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
            console.log('gonna push to dash')
            props.history.push('/dashboard')
          };
          setMessage(data.message)
        })
		.catch(err => {
			setMessage(err.message);
		})
    }
  
    return (
      <div className="auth-wrap">
      <div className="split right">
        <div className='auth-title' style={{marginTop: "4rem"}}><span style={{fontWeight: "400"}}>Chattitude |</span> REGISTER</div>
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
            <TextField style={{margin: "0 0 1rem 0"}} fullWidth required 
              id="outlined-multiline-static"
              label="Multiline"
              multiline
              rows={3}
              label="short bio" 
              type="bio" 
              name="bio" 
              inputProps={{ maxLength: 80 }}
              variant="outlined"
              onChange={handleChange} />
            <div>
            <div style={{marginBottom: "10px"}}>By clicking submit you are agreeing to the <a target="_blank" rel="noopener noreferrer" href="https://www.privacypolicygenerator.info/live.php?token=rSVBZEcB5WAFTWtpcB1AJnzhOE8tPpUu">Privacy policy</a></div>
            <Button style={{backgroundColor: "#74D69D"}} fullWidth
              variant="contained" 
              type="submit" 
              color="primary"
            > Submit
            </Button>
            </div>
          </form>
          <div>Already registered? {<Link to="/login">Login</Link>}</div>
        </div>
        
      </div>
      <div className="split left split-rect">
        <div className="centered">
          <img style={{height: "20rem"}} src={require('../../assets/auth.svg')}/>
        </div>
      </div>
    </div>  
    );
};

export default Register;
