// Este arquivo é somente um exemplo de slice

import { createSlice } from "@reduxjs/toolkit"

const initialState = {user: "Ahhh"}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: { //define as funções disponíveis para modificar o contexto
        //toda função deve receber como argumento o estado atual

        updateUserInfo(state, action){
            state.user = action.payload.user
        },
    }
})

export default userSlice