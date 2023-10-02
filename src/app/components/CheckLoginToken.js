"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckLoginToken() {
	const router = useRouter();
	useEffect(()=>{
	    sendCookie();
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
