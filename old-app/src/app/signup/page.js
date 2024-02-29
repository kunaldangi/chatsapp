import "./style.css";
import Image from "next/image";
import LoginAccount from "../components/signup/LoginAccount";
import SignInWithGoogle from "../components/SignInWithGoogle";

export default function Page() {
    return(<>
        <div className="main" style={{width: "400px", height: "600px"}}>
            <div><Image src="/whatsappIcon.png" alt="Image not found!" height={512} width={512} priority={true}/></div>
            <div>Create your Account</div>
            <div><input type="text" placeholder="Username" /></div>
            <div><input type="email" placeholder="Email" /></div>
            <div><input type="password" placeholder="Password" /></div>
            <div><button>Sign Up</button></div>
            <div><SignInWithGoogle>Sign Up with Google</SignInWithGoogle></div>
            <div style={{fontSize: "16px"}}>Already have account?</div>
            <div><LoginAccount/></div>
        </div>
    </>);
}