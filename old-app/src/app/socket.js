import io from 'socket.io-client';
let socket = null;
if(!socket){
    socket = io('/', {
        withCredentials: true,
    });
}
export default socket;
