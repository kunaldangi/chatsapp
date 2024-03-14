import { Socket as ClientSocket } from "socket.io";
import { ioServer } from "../..";

import db from "../../../db";

export default function Event(socketServer: ioServer, clientSocket: ClientSocket) {
    clientSocket.on('UserDetails', async (data)=> {
        if(data?.method === "GET"){
            const userData = socketServer.usersData.get(clientSocket.id);
            let data: any = await db.user?.findAll({where: { id: userData.userId}});
            clientSocket.emit('UserDetails', {id: data[0]?.dataValues.id, username: data[0]?.dataValues.username, email: data[0]?.dataValues.email, createdAt: data[0]?.dataValues.createdAt, updatedAt: data[0]?.dataValues.updatedAt});
        }
        if(data?.method === "UPDATE"){
            console.log("Updating user details");
        }
    })
}