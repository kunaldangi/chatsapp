"use client"

import { useDispatch } from "react-redux";
import { setMessages } from "../redux/slices/messagesSlice";

export default function Contacts({ data }) {
    const dispatch = useDispatch();

    async function onClickContact(index) {
        try {
            let response = await fetch("http://localhost:8080/chats/getmessage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    participant: data.contacts[index].email
                }),
                credentials: 'include'
            });
            response = await response.json();
            if (response.messages) dispatch(setMessages(response.messages));
        } catch (error) {
            console.log(error);
        }
    }

    function show_contacts() {
        let contacts = [];
        for (let i = 0; i < data.contacts.length; i++) {
            contacts.push(<div key={i} onClick={() => onClickContact(i)}>{data.contacts[i].name}</div>)
        }
        return contacts;
    }
    
    return (<>
        {data.contacts && data.contacts.length > 0 ? show_contacts() : <div className="no-contacts">No contacts found!</div>}
    </>)
}