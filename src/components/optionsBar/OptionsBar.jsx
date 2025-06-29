/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
import classes from "./OptionsBar.module.css"

import { useState } from "react"

import { modalActions, userActions } from "../../store"
import { useDispatch, useSelector } from "react-redux"

import { useMutation } from "@tanstack/react-query"
import { deletePost, likeReview } from "../../services/posts"
import { queryClient } from "../../services/queryClient"

import { useNavigate } from "react-router-dom"

import OverflowMenu from "../overflowMenu/overflowMenu"
import CommentInput from "../comments/CommentInput"
import ConfirmationModal from "../modal/ConfirmationModal"
import Modal from "../modal/Modal"
import AddToListForm from "../addToListForm/AddToListForm"
import NewListForm from "../newListForm/newListForm"
import EditListForm from "../editListForm.jsx/EditListForm"
import NewReviewForm from "../newReviewForm/NewReviewForm"
import { motion, AnimatePresence } from "framer-motion"

export default function OptionsBar({post, type}){
    const loggedUserInfo = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [modalsVisibility, setModalsVisibility] = useState({
        overflowMenu: false, 
        deleteModal: false, 
        listsModal: false,
        newListModal: false,
        editListModal: false,
        editReviewModal: false
    })

    //the post was liked/followed by the logged user?
    let liked
    // let following
    if(type === "reviews"){
        liked = loggedUserInfo ? loggedUserInfo.likedReviews.filter(likedReview => likedReview === post._id).length === 1 : false
    }
    if(type == "lists"){
        // following = loggedUserInfo.followingLists.filter(followedList => followedList === post._id).length === 1
    }

    const { mutate: likeMutate } = useMutation({
        mutationFn: likeReview,
        onSuccess: (_data, variables, _context) => updateUserContext(variables)
    })

    const { mutate: deleteMutate } = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            navigate(-1)
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
        if(!loggedUserInfo){
            dispatch(modalActions.setModal("login"))
            return
        }

        likeMutate({reviewId: post._id, operation: liked ? "deslike" : "like"})
    }

    function handleEditPost() {
        if(type === "reviews"){
            setModalsVisibility(prevState=>({...prevState, editReviewModal: true, overflowMenu: false}))
        }
        if(type === "lists"){
            setModalsVisibility(prevState=>({...prevState, editListModal: true, overflowMenu: false}))
        }
    }
    
    return <div className={classes["options-bar"]}>
            
        {type === "reviews" && 
            <div className={classes["like-div"]}>
                <motion.button whileTap={{scale: 1.2}} className={`${classes["like-button"]} ${liked ? classes["liked-button"] : undefined}`} onClick={handleLike}>
                    <span className={`material-symbols-outlined  ${classes["like-icon"]} ${liked ? classes["liked-icon"] : undefined}`}>
                        favorite
                    </span>
                </motion.button>
                <p>{post.totalLikes}</p>
            </div>
        }

        <CommentInput parent={post} type={type} />
        
        {(loggedUserInfo?._id === post.author._id || type === "reviews") &&
            <div className={classes["more-options-div"]}>  
                <button onClick={() => setModalsVisibility(prevState => ({...prevState, overflowMenu: true }))} className={classes["more-options-button"]}>
                    <span className={`material-symbols-outlined`}>
                        more_vert
                    </span>
                </button>

                {modalsVisibility.overflowMenu && <OverflowMenu right={"0"} top={"25px"} handleCloseMenu={() => setModalsVisibility(prevState => ({...prevState, overflowMenu: false }))}>
                    <ul className={classes["overflow-menu-list"]}>
                        
                        {/* Menu options exclusive to reviews */}
                        {type === "reviews" && 
                            <li>
                                <button 
                                    onClick={() => {
                                        setModalsVisibility(prevState => ({...prevState, overflowMenu: false }))
                                        if(!loggedUserInfo){
                                            dispatch(modalActions.setModal("login"))
                                            return
                                        }
                                        setModalsVisibility(prevState => ({...prevState, listsModal: true }))
                                    }} 
                                    className="text-button">
                                    <span className={`material-symbols-outlined ${classes["list-icon"]}`}>library_add</span>Add to a List
                                </button>
                            </li>
                        }

                        {/* Menu options exclusive to the owner post */}
                        {loggedUserInfo?._id === post.author._id && <>
                            {type === "reviews" &&<span className={classes["divider-line"]}></span>}
                            
                            <li>
                                <button className="text-button" onClick={handleEditPost}>
                                    <span className={`material-symbols-outlined ${classes["list-icon"]}`}>edit_square</span>Edit {type ==="reviews" ? "Review" : "List" }
                                </button>
                            </li>

                            <li>
                                <button onClick={() => setModalsVisibility(prevState => ({...prevState, deleteModal: true}))} className="negative-button">
                                    <span className={`material-symbols-outlined ${classes["list-icon"]}`}>delete</span>Delete {type ==="reviews" ? "Review" : "List" }
                                </button>
                            </li>
                        </>}
                        
                    </ul>
                </OverflowMenu>}
            </div>
        }
        <AnimatePresence>

            {modalsVisibility.deleteModal && <ConfirmationModal 
                title={`Delete ${type ==="reviews" ? "Review" : "List" }`}
                message={`Are you sure you want to delete this ${type ==="reviews" ? "review" : "list" }?`}
                onConfirm={() => { setModalsVisibility(prev => ({...prev, deleteModal: false})); deleteMutate({id: post._id, type: type}) }}
                onCancel={() => setModalsVisibility(prevState => ({...prevState, deleteModal: false}))}
                onEscape={() => setModalsVisibility(prevState => ({...prevState, deleteModal: false}))}
            />}

            {(modalsVisibility.listsModal || modalsVisibility.newListModal) && <Modal onEscape={() => setModalsVisibility(prevState => ({...prevState, listsModal: false, newListModal: false}))}>
                {modalsVisibility.listsModal && <AddToListForm 
                    review={post} 
                    onClose={() => setModalsVisibility(prevState => ({...prevState, listsModal: false}))}
                    onNewList={() => {
                        setModalsVisibility(prevState => ({...prevState, listsModal: false, newListModal: true}))
                    }}
                />}
                {modalsVisibility.newListModal && <NewListForm 
                    review={post} 
                    onClose={() => setModalsVisibility(prevState => ({...prevState, newListModal: false}))}
                    onCancel={() => setModalsVisibility(prevState => ({...prevState, newListModal: false, listsModal: true}))}
                    onReviewPage = {true}
                />}
            </Modal>}

            {modalsVisibility.editListModal && <Modal onEscape={() => setModalsVisibility(prevState => ({...prevState, editListModal: false}))}>
                <EditListForm 
                    listId={post._id}
                    onClose={() => setModalsVisibility(prevState => ({...prevState, editListModal: false}))} 
                />
            </Modal>}

            {modalsVisibility.editReviewModal && <Modal onEscape={() => setModalsVisibility(prevState => ({...prevState, editReviewModal: false}))}>
                <NewReviewForm reviewId={post._id} onCancel={() => setModalsVisibility(prevState => ({...prevState, editReviewModal: false}))}/>
            </Modal>}

        </AnimatePresence>

    </div>
}