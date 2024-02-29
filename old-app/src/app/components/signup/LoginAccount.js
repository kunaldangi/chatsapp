"use client"
import { useRouter } from "next/navigation";
export default function LoginAccount() {
    const router = useRouter();
    return (<>
        <button style={{fontSize: "14px"}} onClick={()=>{router.push("/signin")}} >Login</button>
    </>);
}