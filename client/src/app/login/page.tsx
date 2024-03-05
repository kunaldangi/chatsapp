import "./styles.css";
import Image from "next/image";
import { GoTo } from "@/components/Redirect";

export default function Page() {
    return (<>
        <div className="login">
            <div><Image src="/whatsappIcon.png" alt="Image not found!" height={512} width={512} priority={true}/></div>
            <div>Sign in to your Account</div>
            <div><input type="email" placeholder="Email" /></div>
            <div><input type="password" placeholder="Password" /></div>
            <div><button>Sign In</button></div>
            {/* <div><SignInWithGoogle>Sign In with Google</SignInWithGoogle></div> */}
            <div style={{fontSize: "16px"}}>Do not have account?</div>
            <div><GoTo herf="/signup" style={{fontSize: "14px"}}>Create Account</GoTo></div>
        </div>
    </>);
}