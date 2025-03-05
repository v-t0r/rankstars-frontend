import { createSlice } from "@reduxjs/toolkit"

const initialState = {visibility: false, signupMode: false}

const loginModalSlice = createSlice({
    name: "loginModal",
    initialState: initialState,
    reducers: {
        setLoginModalVisibility(state, action){
            state.visibility = action.payload
            state.signupMode = false
        },

        setSignupMode(state, action){
            state.signupMode = action.payload
        }
    }
})

export default loginModalSlice