"use client"
import "./MessageBoxStyle.css";
import React, { useState } from 'react';
import { setMessages } from "../redux/slices/messagesSlice";
import { useDispatch, useSelector } from "react-redux";

function MessageInput() {
    // const [msgData, setMsgData] = useState({type: null, content: ""});
    const msgData = useSelector(state=>state.messages);
    const userdata = useSelector(state => state.userdata);
    const dispatch = useDispatch();
    let holdKey = null;

    async function onKeyPress(e) {
        if(holdKey == null){
            holdKey = e.key;
        }
        if(e.key == "Enter" && holdKey != "Shift"){
            let msg = document.getElementById('message-input-id');

            try {
                let response = await fetch("http://localhost:8080/chats/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        participant:{
                          username: msgData.userinfo.username,
                          email: msgData.userinfo.email
                        },
                        message:{
                          sender: userdata.data.email,
                          receiver: msgData.userinfo.email,
                          content: msg.innerText
                        }
                    }),
                    credentials: 'include'
                });
                response = await response.json();
                if (response.messages) dispatch(setMessages({userinfo: msgData.userinfo, messages: response.messages}));
            } catch (error) {
                console.log(error);
            }
            msg.innerHTML = "";
        }
    }
    
    function onKeyRelease(e) {
        if(e.key == holdKey){
            holdKey = null;
        }
    }

    function onClickMessageInput(e) {
        let msg = document.getElementById('message-input-id');
        if(msg.innerText == "Type a message"){
            msg.innerText = "";
        }
    }


    return (<>
        {msgData && msgData.userinfo ?
        <div 
            id="message-input-id"
            className="message-input"
            onClick={onClickMessageInput}
            onKeyDown={(e)=>onKeyPress(e)}
            onKeyUp={(e)=>onKeyRelease(e)}
            contentEditable={true}
            suppressContentEditableWarning={true}
            data-placeholder="Type a message"
        >
            Type a message
        </div>
        : <> Select contact to send message. </>}
    </>);
}

export default MessageInput;