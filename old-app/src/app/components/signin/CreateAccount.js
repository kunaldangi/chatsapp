"use client"
import { useRouter } from "next/navigation";
export default function CreateAccount() {
    const router = useRouter();
    return (<>
        <button style={{fontSize: "14px"}} onClick={()=>{router.push("/signup")}} >Create Account</button>
    </>);
}