"use client";
import "./styles.css";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2} from "lucide-react";
import { NotifiBox } from "@/components/Notifi";
import { GoTo } from "@/components/Redirect";

export default function Page() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false); // for loading button
    const [status, setStatus] = useState({state: false, type: "", msg: ""}); // for error and success message

    function closeNotifi(){ setStatus({state: false, type: "",  msg: ""}); }

    async function handleLogin(){
        if(!isLoading){
            setIsLoading(true);

            const email = document.getElementById("login__inpt--email") as HTMLInputElement;
            const password = document.getElementById("login__inpt--pwd") as HTMLInputElement;

            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            });

            const data = await response.json();
            console.log(data);

            if(data.success){
                closeNotifi(); // close the error box if it is open
                setStatus({state: true, type: "success", msg: data.success});
                setIsLoading(false);
                setTimeout(()=>{ window.location.href = '/'; }, 2000); // we need to reload the page
            }

            if(data.error){
                closeNotifi(); // close the success box if it is open
                setStatus({state: true, type: "error", msg: data.error});
                setIsLoading(false);
            }
        }
    }

    return (<>
        <div className="login">
            <div><Image src="/whatsappIcon.png" alt="Image not found!" height={512} width={512} priority={true}/></div>
            <div>Login to your Account</div>
            <div><input id="login__inpt--email" type="email" placeholder="Email" /></div>
            <div><input id="login__inpt--pwd" type="password" placeholder="Password" /></div>
            
            { (status.type === "error") ? <NotifiBox status={status} closeNotifi={closeNotifi} mainClass="login__error--main" closeClass="login__error--close" textClass="login__error--text" /> : <></>}
            { (status.type === "success") ? <NotifiBox status={status} closeNotifi={closeNotifi} mainClass="login__success--main" closeClass="login__success--close" textClass="login__success--text" /> : <></>}

            <div><button onClick={handleLogin} style={{cursor: isLoading? "not-allowed": "default"}}>{ isLoading ? <span className="login__btn--loading"><Loader2 className="animate-spin" /> loading...</span> : <>Login</> }</button></div>

            {/* <div><SignInWithGoogle>Sign In with Google</SignInWithGoogle></div> */}
            <div style={{fontSize: "1.6rem"}}>Do not have account?</div>
            <div><GoTo herf="/signup" style={{fontSize: "1.4rem"}}>Create Account</GoTo></div>
        </div>
    </>);
}