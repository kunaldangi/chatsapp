"use client"
import "./styles/AddContact.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userdataSlice";

export default function AddContact({setIsAddContact}) {
    const dispatch = useDispatch();
    const [action, setAction] = useState(null);

    async function onClickAdd() {
        let name = document.getElementById("inp-addContactName").value;
        let email = document.getElementById("inp-addContactEmail").value;

        if(name == "" || email == ""){
            setAction("Please fill all the fields");
            setTimeout(() => {
                setAction(null);
            }, 3500);
            return;
        }

        let response = await fetch('/user/addcontact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email
            })
        });

        let data = await response.json();
        if(data.contacts){
            dispatch(setUserData(data));
            setAction("Contact added successfully");
            setTimeout(() => {
                setIsAddContact(false);
            }, 1500);
        }
        else{
            setAction(data.action);
            setTimeout(() => {
                setAction(null);
            }, 3500);
            return;
        }
    }

    return(<>
        <div className="add-contact">
            <div className="add-contact-header">
                Add Contact
            </div>
            {action && <div style={{marginBottom: "5px", color: "white", backgroundColor: "#f15c6d", padding: "5px", borderRadius: "3px"}} className="action">{action}</div>}
            <div className="contact-form">
                <div>
                    <input id="inp-addContactName" type="text" placeholder="Name" />
                </div>
                <div>
                    <input id="inp-addContactEmail" type="email" placeholder="Email" />
                </div>
                <div style={{display: "flex", justifyContent: "flex-end", marginTop: "10px"}}>
                    <button className="close-btn" onClick={()=>{setIsAddContact(false)}}>Close</button>
                    <button className="add-btn" onClick={()=>{onClickAdd()}}>Add</button>
                </div>
            </div>
		</div> 
    </>)
}