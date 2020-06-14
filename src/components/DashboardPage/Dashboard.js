import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Logout } from '../LoginPage/Login'
import history from '../services/history';
import { Button } from "@material-ui/core"
import UserAvatar from '../services/UserAvatar';
import TopicSelection from './TopicSelection';
import Timer from './Timer';
import useInterval from '../../hooks/useInterval';


const Dashboard = (props) => {
  const { access, setAccess } = props.accessState;

  const { userData, setUserData } = props.userDataState;
  const { room, setRoom } = props.roomState;

  const [ isSearching, setIsSearching ] = useState(false);
  const [ isRoomFound, setIsRoomFound ] = useState(false);

  const [ usersSearching, setUsersSearching ] = useState();

  const [ delay, setDelay ] = useState(3000);

  // executes matchmaking logic
  // send req to find room, then send req to confirm if room is ready
  useInterval(async () => {
    fetchPeopleSearching();
    if (!isRoomFound) {
      await findRoom();
      console.log('i found it')
    } else if (!room.isReady){
      await checkIfReady();
      console.log('i checked it')
    }
  }, isSearching ? delay : null);
  
  useEffect(() => {
    console.log(room)
  }, [])
  
  // listens to data updates and enables redirect to room route
  // after the moment when matchmaking have executed
  useEffect(() => {
    console.log('room id after set ' + room.id);
    console.log(`LOG:\nuserdata: ${require('util').inspect(userData)}\nroom: ${require('util').inspect(room)}\nflags: ${require('util').inspect({
      search: isSearching,
      found: isRoomFound,
      ready: room.isReady
    })}`);
    if (room.id !== '') {
      setIsSearching(false);
      setRoom({ ...room, isReady: true })
      setUserData({ ...userData, roomId: room.id })
    }
  }, [room]);

  const fetchPeopleSearching = () => {
    axios.get('http://localhost:7000/mm/get-users-searching')
      .then(response => response.data.data)
      .then(data => {
        setUsersSearching(data.usersSearching)
      })
  }

  const findRoom = () => {
    axios.post('http://localhost:7000/mm/find-room', {
      topic: room.topic.toLowerCase()
    }).then(result => {
      console.log(result)
      const data = result.data.data;
      console.log('fr ' + data.isRoomFound);
      setIsRoomFound(data.isRoomFound);
    })
  }

  const checkIfReady = async () => {
    let result = await axios.post('http://localhost:7000/mm/confirm-room-readiness', {
      topic: room.topic.toLowerCase(),
    })
    const data = result.data.data;
    console.log(data)
    console.log('we are here')
    if (data.isRoomReady) {
      console.log('room id before set' + require('util').inspect(room.id))
      setRoom(data.room);
      setRoom({ ...room, isReady: false });
    }
  };

  const breakSearch = async (e) => {
    console.log('i was called! (break)')
    e.preventDefault();
    setIsSearching(false);
    await axios.post('http://localhost:7000/mm/break-search');
  }

  return (
    <div className="background-main">

        <div className="main-container">
          {console.log('from dash ' + props.access)}
          <div className="split-mm left">
            <div className="userdata-container">
              <div className="userdata-inner">
                <UserAvatar username={userData.username} size="large"/>
                <div className="userdata-right-from-pic">
                  <div className="username">{userData.username}</div>
                  <div className="rep">reputation: <span className="rep-count">{userData.rep}</span></div>
                </div>
              </div>
              <div className="bio">{userData.bio}</div>
            </div>
            <Logout history={history} accessState={props.accessState}/>
          </div>
          <div className='mm-settings-container split-mm right-mm'>
            <div className="mm-inner">
              {room.topic ? <div>selected topic: #{room.topic}</div> : <div>select topic to chat</div>}
              <TopicSelection roomState={props.roomState} />
              <Button 
                fullWidth 
                style={{backgroundColor: room.topic === null ? "#d5dce3" : (isSearching ? "#FF8383" : "#74D69D"), color: "white"}} 
                variant="contained" 
                type="submit"                                 
                onClick={ isSearching ? breakSearch : () => setIsSearching(true) }
                disabled={room.topic === null}
              >
                { isSearching ? <div>break</div> : <div>start</div> }
              </Button> 
              { isSearching && <Timer isSearching={isSearching}/> }
              { isSearching && <div>users searching: {usersSearching}</div> }
            </div>
          </div>
          { room.isReady && <Redirect to='/room'/> }
        </div>

      </div>
      
  );
}

export default Dashboard;