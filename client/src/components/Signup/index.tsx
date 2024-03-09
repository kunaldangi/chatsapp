"use client";
import "./styles.css";
import { useState } from "react";
import { Loader2} from "lucide-react";
import { GoTo } from "@/components/Redirect";
import { NotifiBox } from "@/components/Notifi";

export function Signup(){
    const [isSubmited, setIsSubmited] = useState(false); // for otp
    const [isLoading, setIsLoading] = useState(false); // for loading button
    const [status, setStatus] = useState({state: false, type: "", msg: ""}); // for error and success message

    function closeNotifi(){ setStatus({state: false, type: "",  msg: ""}); }

    async function handleSignup(){
        if(!isLoading){
            setIsLoading(true);

            const username = document.getElementById("signup__inpt--username") as HTMLInputElement;
            const email = document.getElementById("signup__inpt--email") as HTMLInputElement;
            const password = document.getElementById("signup__inpt--password") as HTMLInputElement;

            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    password: password.value
                })
            });

            const data = await response.json();
            if(data.success){
                closeNotifi(); // close the error box if it is open
                setStatus({state: true, type: "success", msg: data.success});
                setTimeout(()=>{ setIsSubmited(true); }, 1500);
                setIsLoading(false);
            }

            if(data.error){
                closeNotifi(); // close the success box if it is open
                setStatus({state: true, type: "error", msg: data.error});
                setIsLoading(false);
            }
        }
    }

    

    async function handleVerify(){
        if(!isLoading){
            setIsLoading(true);

            const otp = document.getElementById("signup__inpt--otp") as HTMLInputElement;

            const response = await fetch("http://localhost:8080/api/auth/verify", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: parseInt(otp.value)
                })
            });

            const data = await response.json();
            console.log(data);
            if(data.success){
                closeNotifi(); // close the error box if it is open
                setStatus({state: true, type: "success", msg: data.success});
                setIsLoading(false);
                setTimeout(()=>{ window.location.href = "/login"; }, 2000); // we need to reload the page
            }

            if(data.error){
                closeNotifi(); // close the success box if it is open
                setStatus({state: true, type: "error", msg: data.error});
                setIsLoading(false);
            }
        }
    }

    return (<>
        {!isSubmited ? <>
            <div>Create your Account</div>
            <div><input id="signup__inpt--username" type="text" placeholder="Username" /></div>
            <div><input id="signup__inpt--email" type="email" placeholder="Email" /></div>
            <div><input id="signup__inpt--password" type="password" placeholder="Password" /></div>

            { (status.type === "error") ? <NotifiBox status={status} closeNotifi={closeNotifi} mainClass="signup__error--main" closeClass="signup__error--close" textClass="signup__error--text" /> : <></>}
            { (status.type === "success") ? <NotifiBox status={status} closeNotifi={closeNotifi} mainClass="signup__success--main" closeClass="signup__success--close" textClass="signup__success--text" /> : <></>}

            <div><button onClick={handleSignup} style={{cursor: isLoading? "not-allowed": "default"}}> { isLoading ? <span className="signup__btn--loading"><Loader2 className="animate-spin" /> loading...</span> : <>Sign Up</> }</button></div>
            <div style={{fontSize: "1.6rem"}}>Already have account?</div>
            <div><GoTo herf="/login" style={{fontSize: "1.4rem"}} >Login</GoTo></div>
        </> : <>
            <div className="otp">
                <div>Enter the OTP!</div>
                <div><input id="signup__inpt--otp" type="text" placeholder="OTP" /></div>

                { (status.type === "error") ? <NotifiBox status={status} closeNotifi={closeNotifi} mainClass="signup__error--main" closeClass="signup__error--close" textClass="signup__error--text" /> : <></>}
                { (status.type === "success") ? <NotifiBox status={status} closeNotifi={closeNotifi} mainClass="signup__success--main" closeClass="signup__success--close" textClass="signup__success--text" /> : <></>}

                <div><button onClick={handleVerify} style={{cursor: isLoading? "not-allowed": "default"}}> { isLoading ? <span className="signup__btn--loading"><Loader2 className=" animate-spin" /> loading...</span> : <>Verify</> }</button></div>
            </div>
        </>}
    </>);
}