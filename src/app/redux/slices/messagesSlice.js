import { createSlice } from "@reduxjs/toolkit";
import socket from "../../socket";

const initialState = {
    userinfo: null,
    messages: null
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) =>{
            if(action.payload){
                state.userinfo = action.payload.userinfo;
                state.messages = action.payload.messages;
            }
        },
        setMessageRead: (state, action) =>{
            if(action.payload){
                state.messages[action.payload.msgId].isRead = action.payload.isRead;
                socket.emit('msgRead', JSON.stringify(state.messages[action.payload.msgId]));
            }
        }
    }
});

export const {setMessages, setMessageRead} = messagesSlice.actions;

export default messagesSlice.reducer;