"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserchats } from "../redux/slices/userchatsSlice";
import { setMessages } from "../redux/slices/messagesSlice";

export default function UserChats() {
    const userchats = useSelector(state => state.userchats);
    const dispatch = useDispatch();

    useEffect(() => {
        getUserChats();
    }, [])

    async function getUserChats() {
        try {
            let response = await fetch("http://localhost:8080/chats/", {credentials: 'include'});
            response = await response.json();
            dispatch(setUserchats(response));
        } catch (error) {
            console.log(error);
        }
    }

    async function onClickChat(index) {
        try {
            let response = await fetch("http://localhost:8080/chats/get", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    participant: userchats.chats[index].email
                }),
                credentials: 'include'
            });
            response = await response.json();
            if (response.messages) dispatch(setMessages({userinfo: userchats.chats[index], messages: response.messages}));
        } catch (error) {
            console.log(error);
        }
    }

    function showChats() {
        let elements = [];
        for (let i = 0; i < userchats.chats.length; i++) {
            elements.push(<div key={i} onClick={() => onClickChat(i)}>{userchats.chats[i].username} {userchats.chats[i].isOnline ? <span style={{color: "greenyellow"}}>Online</span>: <span style={{color: "red"}}>Offline</span>}</div>);
        }
        return elements;
    }

    return (<>
        { userchats && userchats.chats ? showChats() : <>No Chats</>}
    </>)
}