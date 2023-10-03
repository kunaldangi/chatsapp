import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: null
};

export const userchatsSlice = createSlice({
    name: 'userchats',
    initialState,
    reducers: {
        setUserchats: (state, action) =>{
            if(action.payload){
                state.chats = action.payload;
            }
        }
    }
});

export const {setUserchats} = userchatsSlice.actions;

export default userchatsSlice.reducer;