"use client";
import { useState } from "react";
import { GoTo } from "@/components/Redirect";

export function Signup(){
    const [isSubmited, setIsSubmited] = useState(false);

    return (<>
        {!isSubmited ? <>
            <div>Create your Account</div>
            <div><input type="text" placeholder="Username" /></div>
            <div><input type="email" placeholder="Email" /></div>
            <div><input type="password" placeholder="Password" /></div>
            <div><button>Sign Up</button></div>
            {/* <div><SignInWithGoogle>Sign Up with Google</SignInWithGoogle></div> */}
            <div style={{fontSize: "16px"}}>Already have account?</div>
            <div><GoTo herf="/login" style={{fontSize: "14px"}} >Login</GoTo></div>
        </> : <>
            <div className="otp">
                <div>Enter the OTP!</div>
                <div><input type="text" placeholder="OTP" /></div>
                <div><button>Verify</button></div>
            </div>
        </>}
    </>);
}