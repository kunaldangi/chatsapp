import { createSlice } from "@reduxjs/toolkit";

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
        }
    }
});

export const {setMessages} = messagesSlice.actions;

export default messagesSlice.reducer;