"use client"
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckLoginToken() {
	const router = useRouter();
	const login_token = Cookies.get('login_token');

	useEffect(()=>{
		if (!login_token) {
			router.push("/signin");
		}else{
			sendCookie();
		}
	}, []);

	async function sendCookie() {
	    try {
	        const response = await fetch("http://localhost:8080/verifytoken", { credentials: 'include'});
	        const data = await response.json();
			if(data.status == "failed!"){
				router.push("/signin");
			}
	    } catch (error) {
	        console.log(error);
			router.push("/signin");
	    }
	}
	return (<>
	</>)
}
