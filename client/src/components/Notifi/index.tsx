import { X } from "lucide-react";
export function NotifiBox({status, closeNotifi, mainClass, closeClass, textClass}: {status: {state: boolean, msg: string}, closeNotifi: ()=> void, mainClass: string, closeClass: string, textClass: string}) {
    if(status.state){
        return (<div className={mainClass} >
            <X className={closeClass} onClick={closeNotifi} /> 
            <span className={textClass}>{status.msg}</span> 
        </div>);
    }
    return (<></>);
}