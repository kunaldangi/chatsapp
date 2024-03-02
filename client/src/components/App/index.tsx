"use client";
import "./App.css";
import { ioClient } from "@/socket/client";
import { useEffect, createContext } from "react";
import Image from "next/image";

export const SocketContext = createContext(ioClient);

export function App() {
    let socketClient: ioClient | undefined;

    useEffect(() => {
        socketClient = new ioClient();

        return () => {
            socketClient?.io.disconnect();
        }
    }, []);

    return (<>
        <ChatApp socketClient={socketClient}>
            <div className="main">
                <div className="main__left">
                    <div className="left__header" style={{display: "flex"}}>
                        <Image src="/defaultprofileImg.png" alt="Image not found!" height={40} width={40} priority={true} />
                        <div style={{flex: "1", display: "flex", justifyContent: "end"}}>
                            <Image src="/contacts.png" alt="Image not found!" height={40} width={40} priority={true} onClick={()=>{}}/>
                            <Image src="/addcontact.png" alt="Image not found!" height={40} width={40} priority={true} onClick={()=>{}}/>
                        </div>
                    </div>
                    <div className="left__middle">
                        <div className="left__middle--search">
                            Search
                        </div>
                        {/* {isContact ? <UserContacts userdata={userdata.data} setIsContact={setIsContact} /> : <UserChats />} */}
                    </div>
                </div>

                <div className="main__right">
                    <header className="right__header">
                        Right Header
                    </header>
                    <div className="right__middle" id="msgs-box-id">
                        {/* <Messages /> */}
                    </div>

                    <div className="right__bottom">
                        {/* <MessageInput /> */}
                    </div>
                </div>
            </div>
        </ChatApp>
    </>);
}

function ChatApp({ socketClient, children }: { socketClient: any, children: React.ReactNode }) {
    return (<>
        <SocketContext.Provider value={socketClient}>
            {children}
        </SocketContext.Provider>
    </>);
}