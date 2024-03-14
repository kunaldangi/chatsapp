"use client";
import { useEffect, createContext } from "react";

import { ioClient } from "@/socket";

export const SocketContext = createContext(ioClient);
export const UserContext = createContext({});

export function App({children }: { children: React.ReactNode }) {
    let socketClient: any;
    let userDetails: any;

    useEffect(() => {
        socketClient = new ioClient();
        socketClient.io.emit("UserDetails", {method: "GET"});

        socketClient?.io.on("UserDetails", (data: any) => {
            console.log(data);
        });

        return () => { // Cleanup
            socketClient?.io.disconnect();
        }
    }, []);

    return (<>
        <SocketContext.Provider value={socketClient}>
            <UserContext.Provider value={userDetails}>
                {children}
            </UserContext.Provider>
        </SocketContext.Provider>
    </>);
}