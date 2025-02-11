import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./user"

import commentsSlice from "./comments"

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        comments: commentsSlice.reducer
    }
})

export const userActions = userSlice.actions
export const commentsAction = commentsSlice.actions
export default store
