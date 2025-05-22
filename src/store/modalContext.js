import { createSlice } from "@reduxjs/toolkit"

const initialState = {currentModal: null}

const modalSlice = createSlice({
    name: "modal",
    initialState: initialState,
    reducers: {
        setModal(state, action){
            state.currentModal = action.payload
        },
        closeModal(state){
            state.currentModal = null
        }
    }
})

export default modalSlice