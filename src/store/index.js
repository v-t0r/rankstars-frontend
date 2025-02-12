import { configureStore } from "@reduxjs/toolkit"

import userSlice from "./userContext"
import commentsSlice from "./commentsContext"

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        comments: commentsSlice.reducer
    }
})

export const userActions = userSlice.actions
export const commentsAction = commentsSlice.actions
export default store
