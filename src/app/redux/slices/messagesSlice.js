import { createSlice } from "@reduxjs/toolkit";
import socket from "../../socket";

const initialState = {
    userinfo: null,
    messages: null,
    _id: null
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) =>{
            if(action.payload){
                state.userinfo = action.payload.userinfo;
                state.messages = action.payload.messages;
                state._id = action.payload.messagesId;
            }
        },
        setMessageRead: (state, action) =>{
            if(action.payload){
                if(action.payload.isReceiver){
                    let chat = {
                        messages: action.payload.msgData,
                        msgId: action.payload.msgId
                    };
                    socket.emit('msgRead', JSON.stringify(chat));
                }
                if(action.payload.isRead){
                    state.messages[action.payload.msgId].isRead = action.payload.isRead;
                }
            }
        }
    }
});

export const {setMessages, setMessageRead} = messagesSlice.actions;

export default messagesSlice.reducer;