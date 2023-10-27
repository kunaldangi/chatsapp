"use client"
import "./styles.css";
import { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./redux/slices/userdataSlice";
import { setIsOnline, setUnreadMsgs } from "./redux/slices/userchatsSlice";
import { setMessages, setMessageRead } from "./redux/slices/messagesSlice";
import MessageInput from "./components/MessageInput";
// import Contacts from "./components/Contacts";
import Messages from "./components/Messages";
import UserChats from "./components/UserChats";
import socket from "./socket";


export default function Home() {
	const userdata = useSelector(state => state.userdata);
	const msgData = useSelector(state=>state.messages);
	const dispatch = useDispatch();

	useEffect(() => {
		getUserData();

		socket.on('userOnline', (data) => {
			dispatch(setIsOnline({email: data.email, isOnline: true}));
		});
	
		socket.on('userOffline', (data) => {
			dispatch(setIsOnline({email: data.email, isOnline: false}));
		});

		return () => { // Cleanup events from the socket
			socket.off('userOnline');
			socket.off('userOffline');
		};
	}, []);

	useEffect(() =>{
		socket.on('chatMsgSent', (data)=>{
			if(msgData.userinfo && msgData.userinfo.email == data.participants[0].email){
				dispatch(setMessages({userinfo: data.participants[0], messages: data.messages}));
			}
			if(msgData.userinfo && msgData.userinfo.email == data.participants[1].email){
				dispatch(setMessages({userinfo: data.participants[1], messages: data.messages}));
			}
		});

		socket.on('chatMsgRec', (data)=>{
			if(msgData.userinfo && msgData.userinfo.email == data.participants[0].email){
				dispatch(setMessages({userinfo: data.participants[0], messages: data.messages}));
			}
			if(msgData.userinfo && msgData.userinfo.email == data.participants[1].email){
				dispatch(setMessages({userinfo: data.participants[1], messages: data.messages}));
			}
		});

		socket.on('msgReadRec', (data)=>{
			dispatch(setMessageRead({msgId: parseInt(data.msgId), isRead: data.messages.isRead, isReceiver: false}));

		});

		socket.on('remainUnreadMsgs', (data)=>{
			// console.log(data);
			dispatch(setUnreadMsgs({email: data.email, unreadMsgs: data.unreadMsgs}));
		});

		return () =>{
			socket.off('chatMsgSent');
			socket.off('chatMsgRec');
			socket.off('msgReadRec');
		}
	}, [msgData]);
	
	async function getUserData() {
		try {
			let response = await fetch("http://localhost:8080/user/details", { credentials: 'include' });
			let data = await response.json();
			dispatch(setUserData(data));
		} catch (error) {
			console.log(error);
		}
	}

	
	return (<>
		<div className="main">

			<div className="main-left">
				<header className="left-header">
					{userdata.data && userdata.data.profileImage ? <Image src={userdata.data.profileImage} alt="Image not found!" height={40} width={40} priority={true} /> : <Image src="/defaultprofileImg.png" alt="Image not found!" height={40} width={40} priority={true} />}
					<Image src="/addcontact.png" alt="Image not found!" height={40} width={40} priority={true} />
				</header>
				<div className="left-middle">
					<div className="left-middle-search">
						Search
					</div>
					{/* {userdata.data ? <Contacts data={userdata.data} /> : <>No Contacts</>} */}
					<UserChats />
				</div>
			</div>

			<div className="main-right">
				<header className="right-header">
					Right Header
				</header>
				<div className="right-middle" id="msgs-box-id">
					<Messages />
				</div>

				<div className="right-bottom">
					<MessageInput />
				</div>
			</div>
		</div>
	</>)
}
