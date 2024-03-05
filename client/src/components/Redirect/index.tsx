"use client";
import { useRouter } from "next/navigation";

export function GoTo({herf, style, children, ...props}: {herf: string, style: React.CSSProperties, children: React.ReactNode}) {
    const router = useRouter();
    return (<>
        <button style={style} {...props} onClick={()=>{router.push(herf)}} >{children}</button>
    </>);
}