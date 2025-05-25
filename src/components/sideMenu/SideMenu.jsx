import classes from "./sideMenu.module.css"

import { useEffect, useState } from "react"
import { useLocation} from "react-router-dom"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

import { motion, AnimatePresence } from "framer-motion"

import { imageBackendUrl } from "../../utils/constants"
import Modal from "../modal/Modal"
import NewReviewForm from "../newReviewForm/NewReviewForm"
import { logout } from "../../services/auth"
import NewListForm from "../newListForm/newListForm"

export default function SideMenu(){
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [modalVisibility, setModalVisibility] = useState({newReview: false, newList: false})

    const location = useLocation()

    const {profilePicUrl, _id: userId} = useSelector(state => state.user.user)

    useEffect(()=>{
        setMenuIsOpen(false)
    }, [location])

    function handleOpenMenu(){
        setMenuIsOpen(state => !state)
    }

    return(
        <>
            <div className={classes["image-container"]}>
                <img src={`${imageBackendUrl}/${profilePicUrl}`} alt="Profile Picture" onClick={handleOpenMenu}/>
            </div>
            
            <AnimatePresence>
                {menuIsOpen &&
                    <div onClick={handleOpenMenu} className={classes["invisible-click-wall"]}>
                        <motion.div 
                            className={classes["side-menu"]} 
                            initial={{opacity: 0, x: 100}} 
                            animate={{opacity: 1, x: 0}} 
                            exit={{opacity: 0.5,  x: 300}}
                            transition={{type: "spring", bounce: 0.3, duration: 0.4}}
                        >
                            <ul>

                                <li>
                                    <Link to={`/profile/${userId}`}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>account_box</span>My Profile
                                    </Link>
                                </li>
                                <li>
                                    <p onClick={() => setModalVisibility(prevState => ({...prevState, newReview: true}))}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>rate_review</span>New Review
                                    </p>
                                </li>
                                <li>
                                    <Link to={`/profile/${userId}/reviews`}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>library_books</span>My Reviews
                                    </Link>
                                </li>
                                <li>
                                    <p onClick={() => setModalVisibility(prevState => ({...prevState, newList: true}))}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>list_alt_add</span>New List
                                    </p>
                                </li>
                                <li>
                                    <Link to={`/profile/${userId}/lists`}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>list_alt</span>My Lists
                                    </Link>
                                </li>

                                <li><Link to={`https://github.com/v-t0r/rankstars-frontend`}><span className={`material-symbols-outlined ${classes["menu-icon"]}`}>info</span>About RankStars</Link></li>                    
                            </ul>
                            <button onClick={logout} className={`negative-button ${classes["logout-button"]}`}>
                                <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>logout</span>Logout
                            </button>
                        </motion.div>
                    </div>  
                }

                {modalVisibility.newReview &&
                    <Modal onEscape={() => setModalVisibility(prevState => ({...prevState, newReview: false}))}>
                        <NewReviewForm onCancel={() => setModalVisibility(prevState => ({...prevState, newReview: false}))}/>
                    </Modal>                    
                }

                {modalVisibility.newList && 
                    <Modal onEscape={() => setModalVisibility(prevState => ({...prevState, newList: false}))}>
                        <NewListForm 
                            onCancel={() => setModalVisibility(prevState => ({...prevState, newList: false}))}
                            onClose={() => setModalVisibility(prevState => ({...prevState, newList: false}))}/>
                    </Modal>
                }

            </AnimatePresence>
        </>
    )
}