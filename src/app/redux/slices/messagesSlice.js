import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: null
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) =>{
            if(action.payload){
                state.messages = action.payload;
            }
        }
    }
});

export const {setMessages} = messagesSlice.actions;

export default messagesSlice.reducer;