"use client"
import { useSelector } from "react-redux";
export default function Messages() {
    const userdata = useSelector(state=>state.userdata);
    const data = useSelector(state=>state.messages);

    function showSenderMsg(msg){
        if(userdata.data.email == msg.sender){
            return (<div style={{display: "flex", justifyContent: "flex-end"}}>{msg.content}</div>)
        }
        else{
            return (<div style={{display: "flex", justifyContent: "flex-start"}}>{msg.content}</div>)
        }
    }

    function showMessages() {
        let elements = [];
        for (let i = (data.messages.length-1); i >= 0; i--) { // Reverse Loop because of latest message always comes at the top
            elements.push(
                <div key={i}>
                    {showSenderMsg(data.messages[i])}
                </div>
            )
        }
        return elements;
    }

    return (<>
        {data.messages?
            <>
                {showMessages()}
            </> :
            <>
                Click on contact to display messages.
            </>
        }
    </>);
}