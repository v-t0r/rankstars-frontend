import { createSlice } from "@reduxjs/toolkit"

const initialState = {user: null, expDate: null}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: { //define as funções disponíveis para modificar o contexto
        //toda função deve receber como argumento o estado atual

        updateUserInfo(state, action){
            state.user = action.payload.user
        },

        createUserContext(state, action){
            state.user = action.payload.user
            state.expDate = action.payload.expDate
        }
    }
})

export default userSlice