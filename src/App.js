import React, { useState } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import history from './components/services/history'

import Home from './components/HomePage/Home';
import { Login } from './components/LoginPage/Login';
import Register from './components/RegisterPage/Register';

import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/DashboardPage/Dashboard'
import Room from './components/RoomPage/Room'

const App = () => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
  const url = window.location.origin; 
  const [ userData, setUserData ] = useState({
    username: null,
    password: null,
    bio: null,
    roomId: null,
    rep: null
  });
  const [ room, setRoom ] = useState({ 
    id: '', 
    topic: null, 
    users: [],
    isReady: false
  });
  const [ access, setAccess ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ message, setMessage ] = useState();

  const verifyToken = async () => {
    console.log('access before verification" ' + access)
    console.log(axios.defaults.headers.common['Authorization']);
    await axios.post(`${url}/token`)
      .then(response => response.data.data)
      .then(data => {
        console.log(data)
        if (data.tokenVerificationData.access) {
          setUserData(data.tokenVerificationData.user);
        } else {
          history.push('/login')
        }
        setAccess(data.tokenVerificationData.access)
        setMessage(data.tokenVerificationData.message);
        console.log('access from verification: ' + data.tokenVerificationData.access)
        setLoading(false);
        console.log('access after verification: ' + access)
      })
  }

  return (
      <Router history={history}>
       <Switch>

        <Route exact path="/">
          <Home history={history}/>
        </Route>

        <Route exact path="/login"
          render={props => {
            if (access) {
              console.log('a l ' + access)
              return(<Redirect to="/dashboard"/>)
            } else {
              console.log('a l ' + access)
              return(<Login {...props} url={url} accessState={{access, setAccess}} userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />)
            }
        }} 
        />

        <Route exact path="/register"
          render={props => access ? <Redirect to="/dashboard" /> : <Register {...props} url={url} history={history} userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />} 
        />

        <ProtectedRoute exact path='/dashboard' verifyToken={verifyToken} access={access} loading={loading}>
          <Dashboard url={url} accessState={{access, setAccess}} userDataState={{ userData, setUserData }} roomState={{ room, setRoom }} />
        </ProtectedRoute>

        <ProtectedRoute exact path='/room' verifyToken={verifyToken} access={access} loading={loading}>
          <Room url={url} history={history} userDataState={{ userData, setUserData }} roomState={{ room, setRoom }}/>
        </ProtectedRoute>

      </Switch>
    </Router>
  );
}

export default App;
