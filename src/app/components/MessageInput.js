"use client"
import "./MessageBoxStyle.css";
import React, { useState } from 'react';

function MessageInput() {
    // const [msg, setMsg] = useState([<p className="id-msgs">Type a message...</p>]);
    let holdKey = null;

    function onKeyPress(e) {
        if(holdKey == null){
            holdKey = e.key;
        }
        if(e.key == "Enter" && holdKey != "Shift"){
            let msg = document.getElementById('message-input-id');
            console.log(msg.innerText);
            msg.innerHTML = "";
        }
    }
    
    function onKeyRelease(e) {
        if(e.key == holdKey){
            holdKey = null;
        }
    }

    return (
        <div id="message-input-id" className="message-input" onKeyDown={(e)=>onKeyPress(e)} onKeyUp={(e)=>onKeyRelease(e)} contentEditable={true} suppressContentEditableWarning={true}>
            <div>Type a message</div>
            {/* {msg} */}
        </div>
    );
}

export default MessageInput;