import { configureStore } from "@reduxjs/toolkit"

import userSlice from "./userContext"
import commentsSlice from "./commentsContext"
import loginModalSlice from "./loginModalContext"

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        comments: commentsSlice.reducer,
        loginModal: loginModalSlice.reducer
    }
})

export const loginModalActions = loginModalSlice.actions
export const userActions = userSlice.actions
export const commentsAction = commentsSlice.actions
export default store
