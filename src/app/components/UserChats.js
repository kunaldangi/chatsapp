"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
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
            let response = await fetch("chats/", { credentials: 'include' });
            response = await response.json();
            let chats = [];
            response.participants.forEach(x => {
                const matchingProfileImage = response.profileImages.find(image => image.email === x.email);
                if (matchingProfileImage) {
                    x.profileImage = matchingProfileImage.profileImage;
                    chats.push(x);
                }
            });
            dispatch(setUserchats(chats));
        } catch (error) {
            console.log(error);
        }
    }

    async function onClickChat(index) {
        try {
            let response = await fetch("chats/get", {
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
            console.log("userinfo: ", userchats.chats[index]);
            if (response.messages) dispatch(setMessages({ userinfo: userchats.chats[index], messages: response.messages, messagesId: response._id }));
        } catch (error) {
            console.log(error);
        }
    }

    function showUnreadMessages(unreadMsgs) {
        if (unreadMsgs > 0) {
            return (<span style={{ alignSelf: "center", color: "white", marginLeft: "auto", marginRight: "15px", background: "#08d360", borderRadius: "50%", padding: "1px 7px" }}>{unreadMsgs}</span>);
        }
        else {
            return (<></>);
        }
    }

    function showChats() {
        let elements = [];
        for (let i = 0; i < userchats.chats.length; i++) {
            elements.push(<div key={i} onClick={() => onClickChat(i)} style={{ display: "flex", padding: "5px" }}>
                <Image src={userchats.chats[i].profileImage} alt="Image not found!" height={50} width={50} priority={true} style={{ borderRadius: "50%" }} />
                <span style={{ marginLeft: "5px", alignSelf: "center" }}>{userchats.chats[i].username}</span>
                <span style={{ marginLeft: "5px", alignSelf: "center" }}>{userchats.chats[i].isOnline ? <span style={{ color: "greenyellow" }}>Online</span> : <span style={{ color: "red" }}>Offline</span>}</span>
                {showUnreadMessages(userchats.chats[i].unreadMsgs)}
            </div>);
        }
        return elements;
    }

    return (<>
        {userchats && userchats.chats && userchats.chats.length ? showChats() : <>No Chats</>}
    </>)
}