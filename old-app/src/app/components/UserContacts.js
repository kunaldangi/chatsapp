"use client"
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setMessages } from "../redux/slices/messagesSlice";

export default function UserContacts({userdata, setIsContact}) {
    const dispatch = useDispatch();
    
    async function onClickUserContact(index) {
        try {
            let response = await fetch("chats/get", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    participant: userdata.contacts[index].email
                }),
                credentials: 'include'
            });
            response = await response.json();
            console.log("userinfo: ", userdata.contacts[index]);
            if (response.messages){
                dispatch(setMessages({ userinfo: userdata.contacts[index], messages: response.messages, messagesId: response._id }));
                setIsContact(false);
            }
            else{
                dispatch(setMessages({ userinfo: userdata.contacts[index], messages: null, messagesId: null, hasNoMessages: true }));
                console.log("No messages: ", response);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    function showContacts() {
        let elements = [];
        for (let i = 0; i < userdata.contacts.length; i++) {
            elements.push(<div key={i} onClick={() => onClickUserContact(i)} style={{ display: "flex", padding: "5px" }}>
                <Image src={userdata.contacts[i].profileImage} alt="Image not found!" height={50} width={50} priority={true} style={{ borderRadius: "50%" }} />
                <span style={{ marginLeft: "5px", alignSelf: "center" }}>{userdata.contacts[i].name}</span>
            </div>);
        }
        return elements;
    }

    return(<>
        {showContacts()}
    </>);
}