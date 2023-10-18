"use client"
import "./Messages.css";
import { useEffect } from "react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
export default function Messages() {
    const userdata = useSelector(state=>state.userdata);
    const data = useSelector(state=>state.messages);

    function showSenderMsg(msg){
        let msgs = msg.content.split('\n');
        let newMsgs = [];
        for(let i=0; i<msgs.length; i++){
            newMsgs.push(<Fragment key={i}>{msgs[i]}<br/></Fragment>);
        }
        if(userdata.data.email == msg.sender){
            return (<div className="msg-box" style={{display: "flex", justifyContent: "flex-end"}}><span className="sub-msg-sender-box">{newMsgs}</span></div>)
        }
        else{
            return (<div style={{display: "flex", justifyContent: "flex-start"}}><span className="sub-msg-receiver-box">{newMsgs}</span></div>)
        }
    }

    function showMessages() {
        let elements = [];
        for (let i = (data.messages.length-1); i >= 0; i--) { // Reverse Loop because of latest message always comes at the top
            elements.push(
                <div key={i}>
                    {showSenderMsg(data.messages[i])}
                </div>
            )
        }
        return elements;
    }

    useEffect(()=>{
        console.log("Messages Updated");
        setMessagesScroll(document.getElementById("msgs-box-id").scrollHeight);
    }, [data.messages]);

    function setMessagesScroll(value) {
        let msgBox = document.getElementById("msgs-box-id");
        msgBox.scrollTop = value;
    }

    return (<>
        {data.messages?
            <>
                {showMessages()}
            </> :
            <>
                Click on contact to display messages.
            </>
        }
    </>);
}