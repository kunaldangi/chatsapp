import { configureStore } from "@reduxjs/toolkit";
import userdataReducer from "./slices/userdataSlice";
import messagesReducer from "./slices/messagesSlice";
import userchatsReducer from "./slices/userchatsSlice";

export const store = configureStore({
    reducer: {
        userdata: userdataReducer,
        messages: messagesReducer,
        userchats: userchatsReducer
    }
});