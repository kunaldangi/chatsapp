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
        },
        setIsOnline: (state, action) => {
            if(state.chats){
                for(let i = 0; i < state.chats.length; i++){
                    if(state.chats[i].email === action.payload.email){
                        state.chats[i].isOnline = action.payload.isOnline;
                        break;
                    }
                }
            }
        }
    }
});

export const {setUserchats, setIsOnline} = userchatsSlice.actions;

export default userchatsSlice.reducer;