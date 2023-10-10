import io from 'socket.io-client';
let socket = null;
if(!socket){
    socket = io('http://localhost:8080', {
        withCredentials: true,
    });
}
export default socket;
