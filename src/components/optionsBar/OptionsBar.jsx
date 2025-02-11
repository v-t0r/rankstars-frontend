/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
import classes from "./OptionsBar.module.css"

import { useState } from "react"

import { userActions } from "../../store"
import { useDispatch, useSelector } from "react-redux"

import { useMutation } from "@tanstack/react-query"
import { deletePost, likeReview } from "../../util/fetch/posts"
import { queryClient } from "../../util/http"

import { useNavigate } from "react-router-dom"

import OverflowMenu from "../overflowMenu/overflowMenu"
import CommentInput from "../comments/CommentInput"
import ConfirmationModal from "../modal/ConfirmationModal"

export default function OptionsBar({post, type}){
    const loggedUserInfo = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [overflowMenuVisibility, setOverflowMenuVisibility] = useState(false)
    const [modalVisibility, setModalVisibility] = useState(false)

    //the post was liked/followed by the logged user?
    let liked
    let following
    if(type === "reviews"){
        liked = loggedUserInfo.likedReviews.filter(likedReview => likedReview === post._id).length === 1
    }
    if(type == "lists"){
        following = loggedUserInfo.followingLists.filter(followedList => followedList === post._id).length === 1
    }

    const { mutate: likeMutate } = useMutation({
        mutationFn: likeReview,
        onSuccess: (_data, variables, _context) => updateUserContext(variables)
    })

    const { mutate: deleteMutate } = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            navigate(`/profile/${post.author._id}/`)
        }
    })

    function updateUserContext({reviewId, operation}){
        let newLoggedUserInfo = structuredClone(loggedUserInfo)

        if(operation == "like"){
            newLoggedUserInfo.likedReviews = [reviewId, ...newLoggedUserInfo.likedReviews]
        }
        if(operation == "deslike"){
            newLoggedUserInfo.likedReviews = newLoggedUserInfo.likedReviews.filter(likedReview => likedReview !== reviewId)
        }

        //invalido as queries para atualizar o numero de likes no post
        queryClient.invalidateQueries({
            queryKey: ["review", `${reviewId}`],
            refetchType: "active"
        })

        dispatch(userActions.updateUserInfo({user: newLoggedUserInfo}))
    }

    function handleLike(){
        likeMutate({reviewId: post._id, operation: liked ? "deslike" : "like"})
    }
    

    return <div className={classes["options-bar"]}>
            
        {type === "reviews" && 
            <div className={classes["like-div"]}>
                <button className={`${classes["like-button"]} ${liked ? classes["liked-button"] : undefined}`} onClick={handleLike}>
                    <span className={`material-symbols-outlined  ${classes["like-icon"]} ${liked ? classes["liked-icon"] : undefined}`}>
                        favorite
                    </span>
                </button>
                <p>{post.totalLikes}</p>
            </div>
        }

        <CommentInput parent={post} type={type} />
        
        <div className={classes["more-options-div"]}>  
            <button onClick={() => setOverflowMenuVisibility(state => !state)} className={classes["more-options-button"]}>
                <span className={`material-symbols-outlined`}>
                    more_vert
                </span>
            </button>

            {overflowMenuVisibility && <OverflowMenu right={"0"} top={"25px"} handleCloseMenu={() => setOverflowMenuVisibility(false)}>
                <ul className={classes["overflow-menu-list"]}>
                    
                    {/* Menu options exclusvie to reviews */}
                    {type === "reveiws" && 
                        <li>
                            <button className="text-button">
                                <span className={`material-symbols-outlined ${classes["list-icon"]}`}>library_add</span>Add to a List
                            </button>
                        </li>
                    }

                    {/* Menu options exclusive to the owner post */}
                    {loggedUserInfo._id === post.author._id && <>
                        <span className={classes["divider-line"]}></span>
                        
                        <li>
                            <button className="text-button" onClick={() => navigate(type ==="reviews" ? "edit-review" : "edit-list" )}>
                                <span className={`material-symbols-outlined ${classes["list-icon"]}`}>edit_square</span>Edit {type ==="reviews" ? "Review" : "List" }
                            </button>
                        </li>

                        <li>
                            <button onClick={() => setModalVisibility(true)} className="negative-button">
                                <span className={`material-symbols-outlined ${classes["list-icon"]}`}>delete</span>Delete {type ==="reviews" ? "Review" : "List" }
                            </button>
                        </li>
                    </>}
                    
                </ul>
            </OverflowMenu>}
        </div>
        
        {modalVisibility && <ConfirmationModal 
            title={`Delete ${type ==="reviews" ? "Review" : "List" }`}
            message={`Are you shure you want to delete this ${type ==="reviews" ? "review" : "list" }?`}
            onConfirm={() => deleteMutate({id: post._id, type: type})}
            onCancel={() => setModalVisibility(false)}
            onClose={() => setModalVisibility(false)}
        />}

    </div>
}