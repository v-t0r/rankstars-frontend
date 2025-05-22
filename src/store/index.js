import { configureStore } from "@reduxjs/toolkit"

import userSlice from "./userContext"
import commentsSlice from "./commentsContext"
import modalSlice from "./modalContext"

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        comments: commentsSlice.reducer,
        modal: modalSlice.reducer
    }
})

export const modalActions = modalSlice.actions
export const userActions = userSlice.actions
export const commentsAction = commentsSlice.actions
export default store
