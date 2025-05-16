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

        editComment(state, action){
            const comment = action.payload.comment

            //comment or answer
            let index = state.findIndex(cmt => cmt._id === (comment.whereType == "Comment" ? comment.where : comment._id) )
            
            if(comment.whereType !== "Comment"){
                state[index].content = action.payload.newContent
                state[index].isEdited = true
                return
            }
            
            const parentIndex = index
            index = state[parentIndex].comments.findIndex(cmt => cmt._id === comment._id )

            state[parentIndex].comments[index].content = action.payload.newContent
            state[parentIndex].comments[index].isEdited = true
        },

        addUpVote(state, action){
            //payload = {comment, userId}
            const comment = action.payload.comment
            const userId = action.payload.userId

            //comment or answer
            let index = state.findIndex(cmt => cmt._id === (comment.whereType == "Comment" ? comment.where : comment._id) )

            //its not a answer
            if(comment.whereType !== "Comment"){
                state[index].upVotes = [ ...state[index].upVotes, userId ]
                state[index].upVotesCount = state[index].upVotesCount + 1

                if(state[index].downVotes.includes(userId)){
                    state[index].downVotes = state[index].downVotes.filter(id => id !== userId)
                    state[index].downVotesCount = state[index].downVotesCount - 1
                }
                return
            }
    
            //it's a answer
            const parentIndex = index
            index = state[parentIndex].comments.findIndex(cmt => cmt._id === comment._id )
            state[parentIndex].comments[index].upVotes = [ ...state[parentIndex].comments[index].upVotes, userId ]
            state[parentIndex].comments[index].upVotesCount = state[parentIndex].comments[index].upVotesCount + 1

            if(state[parentIndex].comments[index].downVotes.includes(userId)){
                state[parentIndex].comments[index].downVotes = state[parentIndex].comments[index].downVotes.filter(id => id !== userId)
                state[parentIndex].comments[index].downVotesCount = state[parentIndex].comments[index].downVotesCount - 1
            }
        },

        removeUpVote(state, action){
            //payload = {comment, userId}
            const comment = action.payload.comment
            const userId = action.payload.userId

            //comment or answer
            let index = state.findIndex(cmt => cmt._id === (comment.whereType == "Comment" ? comment.where : comment._id) )

            //its not a answer
            if(comment.whereType !== "Comment"){
                state[index].upVotes = state[index].upVotes.filter(id => id !== userId)
                state[index].upVotesCount = state[index].upVotesCount - 1
                return
            }
    
            //it's a answer
            const parentIndex = index
            index = state[parentIndex].comments.findIndex(cmt => cmt._id === comment._id )
            state[parentIndex].comments[index].upVotes = state[parentIndex].comments[index].upVotes.filter(id => id !== userId)
            state[parentIndex].comments[index].upVotesCount = state[parentIndex].comments[index].upVotesCount - 1
        },

        addDownVote(state, action){
            //payload = {comment, userId}
            const comment = action.payload.comment
            const userId = action.payload.userId

            //comment or answer
            let index = state.findIndex(cmt => cmt._id === (comment.whereType == "Comment" ? comment.where : comment._id) )

            //its not a answer
            if(comment.whereType !== "Comment"){
                state[index].downVotes = [ ...state[index].downVotes, userId ]
                state[index].downVotesCount = state[index].downVotesCount + 1

                if(state[index].upVotes.includes(userId)){
                    state[index].upVotes = state[index].upVotes.filter(id => id !== userId)
                    state[index].upVotesCount = state[index].upVotesCount - 1
                }
                return
            }
            
            //it's a answer
            const parentIndex = index
            index = state[parentIndex].comments.findIndex(cmt => cmt._id === comment._id )
            state[parentIndex].comments[index].downVotes = [ ...state[parentIndex].comments[index].downVotes, userId ]
            state[parentIndex].comments[index].downVotesCount = state[parentIndex].comments[index].downVotesCount + 1

            if(state[parentIndex].comments[index].upVotes.includes(userId)){
                state[parentIndex].comments[index].upVotes = state[parentIndex].comments[index].upVotes.filter(id => id !== userId)
                state[parentIndex].comments[index].upVotesCount = state[parentIndex].comments[index].upVotesCount - 1
            }
        },

        removeDownVote(state, action){
            //payload = {comment, userId}
            const comment = action.payload.comment
            const userId = action.payload.userId

            //comment or answer
            let index = state.findIndex(cmt => cmt._id === (comment.whereType == "Comment" ? comment.where : comment._id) )

            //its not a answer
            if(comment.whereType !== "Comment"){
                state[index].downVotes = state[index].downVotes.filter(id => id !== userId)
                state[index].downVotesCount = state[index].downVotesCount - 1
                return
            }
    
            //it's a answer
            const parentIndex = index
            index = state[parentIndex].comments.findIndex(cmt => cmt._id === comment._id )
            state[parentIndex].comments[index].downVotes = state[parentIndex].comments[index].downVotes.filter(id => id !== userId)
            state[parentIndex].comments[index].downVotesCount = state[parentIndex].comments[index].downVotesCount - 1
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
