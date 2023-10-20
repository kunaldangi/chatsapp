"use client"
import "./Messages.css";
import { useEffect } from "react";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessageRead } from "../redux/slices/messagesSlice";

export default function Messages() {
    const userdata = useSelector(state => state.userdata);
    const data = useSelector(state => state.messages);
    const dispatch = useDispatch();

    function showSenderMsg(msg, msgId) {
        let msgs = msg.content.split('\n');
        let newMsgs = [];
        for (let i = 0; i < msgs.length; i++) {
            newMsgs.push(<Fragment key={i}>{msgs[i]}<br /></Fragment>);
        }
        if (userdata.data.email == msg.sender) {
            return (<div className="msg-box" style={{ display: "flex", justifyContent: "flex-end" }}><span className="sub-msg-sender-box">{newMsgs}</span></div>)
        }
        else {
            return (<div id={msgId} className="reveiver-msg-box" style={{ display: "flex", justifyContent: "flex-start" }}><span className="sub-msg-receiver-box">{newMsgs}</span></div>)
        }
    }

    function showMessages() {
        let elements = [];
        for (let i = (data.messages.length - 1); i >= 0; i--) { // Reverse Loop because of latest message always comes at the top
            elements.push(
                <div key={i}>
                    {showSenderMsg(data.messages[i], i)}
                </div>
            )
        }
        return elements;
    }

    useEffect(() => {
        setMessagesScroll(document.getElementById("msgs-box-id").scrollHeight);
        const elements = document.querySelectorAll('.reveiver-msg-box'); // For knowing which elements are in the viewport

        const msgBox = document.getElementById("msgs-box-id"); // For listening to scroll events
        const handleScroll = () => {
            elements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const msgBoxRect = msgBox.getBoundingClientRect();
                if ( rect.top >= msgBoxRect.top && rect.top <= msgBoxRect.bottom) {
                    let msg = data.messages[element.id];
                    if(data.messages[element.id].isRead != true){
                        dispatch(setMessageRead({msgId: element.id, isRead: true}));
                    }
                }
            });
        }

        msgBox.addEventListener('scroll', handleScroll);
        return ()=>{
            msgBox.removeEventListener('scroll', handleScroll);
        }
    }, [data.messages]);

    function setMessagesScroll(value) {
        let msgBox = document.getElementById("msgs-box-id");
        msgBox.scrollTop = value;
    }

    return (<>
        {data.messages ?
            <>
                {showMessages()}
            </> :
            <>
                Click on contact to display messages.
            </>
        }
    </>);
}