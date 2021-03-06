import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ControlledExpansionPanel from "./ControlledExpansionPanel"
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ModalOnLeave from './ModalOnLeave';
import UserAvatar from "../services/UserAvatar";

let socket;

const Room = (props) => {
    
    return(
        <div>
            <Chat url={props.url} userDataState={props.userDataState} roomState={props.roomState}/>
        </div>
    );
};

const Chat = (props) => {
    const [open, setOpen] = useState(false);

    const { userData, setUserData } = props.userDataState;
    const { room, setRoom } = props.roomState;
    const [ message, setMessage ] = useState('');
    const [ history, setHistory ] = useState([]);
    const [ isUserLeaving, setIsUserLeaving ] = useState(false);

    // initialize data on mount
    useEffect(() => {
        socket = io.connect(`${props.url}`);
        console.log(userData)
        socket.emit('connectRoom', userData.roomId);
        socket.emit('init');
        socket.on('init', (initData) => {
            setHistory(initData.messages);
        });
        return () => {
            leaveRoom();
        }
    }, []);

    // listen to messages
    useEffect(() => {
        socket.on('message', (msg) => {
            setHistory([...history, msg])
        })
    });

    // listen to "leave" event
    useEffect(() => {
        isUserLeaving && leaveRoom();
    }, [isUserLeaving])


    const leaveRoom = () => {
        // clean up room if no users in the room
        if (room.users.length <= 2) {
            socket.emit('disconnectRoom');
        }
        let arr = room.users;
        console.log('we are leaving')
        arr = room.users.filter((user) => user.username !== userData.username);
        arr = arr.map(u => { u.isRated = false; return u });
        setRoom({ ...room, id: '', users: arr, isReady: false });
        setUserData({ ...userData, roomId: '' });
        socket.emit('disconnectUser', userData.username);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let msg = {
            message,
            sender: userData,
        };
        socket.emit('message', msg);
        setMessage('');
    }
    const handleChange = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
    };

    return(
        <div className="background-main">
            <div className="main-container">
                <div className="room-members">
                    <div className="title">
                        <IconButton color="primary" style={{color: "white"}} onClick={() => {setIsUserLeaving(true); setOpen(true)}}>
                            <NavigateBeforeIcon />
                        </IconButton>
                        <ModalOnLeave url={props.url} openModalState={{open, setOpen}} userData={userData} roomState={ props.roomState } />
                        <div className="title-text">#{room.topic}</div>
                    </div>
                    <div className="members-container">
                        {
                            room.users.map(user => (
                                <ControlledExpansionPanel user={user} />
                            ))
                        }
                    </div>
                    
                </div>
                <div className="messenger">
                    <div className="messages">
                        <ul >
                            {
                                history.length === 0 ? <div className="empty-msgs">Say something, e.g. "Hi"</div> : history.map(msg => 
                                    <li className={msg.sender.username === userData.username ? "msg-me" : "msg-not-me"}>
                                        {msg.sender.username !== userData.username && <div className="msg-sender-username">{"@" + msg.sender.username !== userData.username && msg.sender.username}</div>}
                                        <div className="message-text">{msg.message}</div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    <form className="msg-form" onSubmit={handleSubmit}>
                        <input placeholder="type here" className="msg-input" onChange={handleChange} value={message}/>
                        <button className="msg-send">{'>'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Room;