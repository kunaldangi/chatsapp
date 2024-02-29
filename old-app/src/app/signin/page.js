import "./style.css";
import Image from "next/image";
import CreateAccount from "../components/signin/CreateAccount";
import SignInWithGoogle from "../components/SignInWithGoogle";

export default function Page() {
    return (<>
        <div className="main">
            <div><Image src="/whatsappIcon.png" alt="Image not found!" height={512} width={512} priority={true}/></div>
            <div>Sign in to your Account</div>
            <div><input type="email" placeholder="Email" /></div>
            <div><input type="password" placeholder="Password" /></div>
            <div><button>Sign In</button></div>
            <div><SignInWithGoogle>Sign In with Google</SignInWithGoogle></div>
            <div style={{fontSize: "16px"}}>Do not have account?</div>
            <div><CreateAccount /></div>
        </div>
    </>);
}