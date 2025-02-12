import {createSlice} from "@reduxjs/toolkit"

const initialState = []

const commentsSlice = createSlice({
    name: "comments",
    initialState: initialState,
    reducers: {
        defineCurrentComments(state, action){
            //define um state completamente novo
            return action.payload
        },

        addNewComment(state, action){
            state.splice(0, 0, action.payload)
        },

        deleteComment(state, action){
            return state.filter(comment => comment._id !== action.payload._id)
        },
        
        defineAnswers(state, action){
            state.map(comment => {
                if(comment._id === action.payload.parentId){
                    
                    comment.comments = action.payload.answers
                }
            })
        },

        addNewAnswer(state, action){
            const index = state.findIndex(comment => comment._id === action.payload.where)
            state[index].comments.splice(0, 0, action.payload)
        },

        deleteAnswer(state, action){
            //acha o index do comentario pai
            const commentIndex = state.findIndex(comment => comment._id === action.payload.where)

            //acha o index da resposta a ser deletada
            const answerIndex = state[commentIndex].comments.findIndex(answer => answer._id === action.payload._id)
            //deleta a resposta
            state[commentIndex].comments.splice(answerIndex, 1)
        }
    }
})

export default commentsSlice
