"use client"
import "./Messages.css";
import { useEffect } from "react";
import { Fragment } from "react";
import Image from "next/image";
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
            console.log(msgs.isRead);
            return (<div className="msg-box" style={{ display: "flex", justifyContent: "flex-end" }}>
                <span className="sub-msg-sender-box">
                    {newMsgs}
                    {msg.isRead ? <Image style={{ float: "right" }} src="/readDoubleTick.png" width="16" height="9" alt="NIL" /> : <Image style={{ float: "right" }} src="/unreadDoubleTick.png" width="16" height="9" alt="NIL" />}
                </span>
            </div>);
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
        // setMessagesScroll(document.getElementById("msgs-box-id").scrollHeight);
        const elements = document.querySelectorAll('.reveiver-msg-box'); // For knowing which elements are in the viewport
        const msgBox = document.getElementById("msgs-box-id"); // For listening to scroll events


        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const visibleMsg = entry.target;
                    let msg_id = parseInt(visibleMsg.id);
                    if(data.messages[msg_id]){
                        if(data.messages[msg_id].isRead == false){
                            dispatch(setMessageRead({ msgId: msg_id, msgData: data.messages[msg_id], isRead: true, isReceiver: true}));
                        }
                    }
                }
            });
        }, { // Configuration of the observer:
            root: msgBox, // Use msgBox as the root.
            rootMargin: '0px',
            threshold: 0, // Use a threshold of 0, meaning it triggers as soon as the element enters.
        });

        elements.forEach((element) => {
            observer.observe(element);
        });
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