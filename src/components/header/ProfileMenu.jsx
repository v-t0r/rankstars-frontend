import classes from "./ProfileMenu.module.css"

import { useEffect, useState } from "react"
import {Form, useLocation} from "react-router-dom"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

import { motion, AnimatePresence } from "framer-motion"

import { getUserId } from "../../services/auth"
import { backendUrl } from "../../utils/constants"

export default function PofileMenu(){
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const location = useLocation()
    const userId = getUserId()

    const {profilePicUrl} = useSelector(state => state.user.user)

    useEffect(()=>{
        setMenuIsOpen(false)
    }, [location])

    function handleOpenMenu(){
        setMenuIsOpen(state => !state)
    }

    return(
        <>
            <div className={classes["img-container"]}>
                <img className={classes["profile-img"]} src={`${backendUrl}/${profilePicUrl}`} alt="Profile Picture" onClick={handleOpenMenu}/>
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
                                {/* when redirected, its closes de side menu */}

                                <li>
                                    <Link to={`/profile/${userId}`}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>account_box</span>My Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/review/new-review`}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>rate_review</span>New Review
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/profile/${userId}/reviews`}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>library_books</span>My Reviews
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/profile/${userId}/lists`}>
                                        <span className={`material-symbols-outlined ${classes["menu-icon"]}`}>list_alt</span>My Lists
                                    </Link>
                                </li>

                                <li><Link to={`/`}><span className={`material-symbols-outlined ${classes["menu-icon"]}`}>info</span>About RankStars</Link></li>                    
                            </ul>
                            <Form action="/logout" method="post"><button className={`negative-button ${classes["logout-button"]}`} type="submit"><span className={`material-symbols-outlined ${classes["menu-icon"]}`}>logout</span>Logout</button></Form>
                        </motion.div>
                    </div> 
                    
                }
            </AnimatePresence>
            {/* Quando o usuário clicar em qualquer lugar com o menu aberto, ele fecha */}

        </>
    )

}