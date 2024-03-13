import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    username: "Guest"
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state,action) => {
            state.status = true;
            state.username=action.payload.username
        },
        logout: (state) => {
            state.status = false;
            state.username="Guest"
        }
     }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;