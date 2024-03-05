import "./styles.css";
import Image from "next/image";
import { Signup } from "@/components/Signup";

export default function Page() {
    return (<>
        <div className="signup" style={{width: "400px", height: "600px"}}>
            <div><Image src="/whatsappIcon.png" alt="Image not found!" height={512} width={512} priority={true}/></div>
            <Signup/>
        </div>
    </>);
}