"use client"
import "./styles.css";
import { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./redux/slices/userdataSlice";
import MessageInput from "./components/MessageInput";
// import Contacts from "./components/Contacts";
import Messages from "./components/Messages";
import UserChats from "./components/UserChats";
// import socket from "./socket";

export default function Home() {
	// socket.emit('chat', "Hello World!");
	const userdata = useSelector(state => state.userdata);
	const dispatch = useDispatch();

	useEffect(() => {
		getUserData();
	}, []);
	
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
				<div className="right-middle">
					<Messages />
				</div>

				<div className="right-bottom">
					<MessageInput />
				</div>
			</div>
		</div>
	</>)
}
