import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { modalActions } from "../../store/index"
import { useMediaQuery } from "react-responsive"

import classes from "./WelcomePage.module.css"
import WelcomeListCard from "../../components/welcomeCards/list/WelcomeListCard"

const verbs = ["watch", "read", "play", "listen", "love"]
const colors = ["rgb(39, 194, 75)", "rgb(56, 127, 209)", "rgb(173, 56, 209)", "rgb(223, 44, 169)", "rgb(223, 44, 44)"]

const lists = [
    {
        title: "Most Influentional Albums of All Time",
        description: "The 100 most influentional albums of all times according to The Audiophile Magazine.",
        author: {
            _id: "1",
            username: "TheAudiophile"
        },
        reviews: [{imagesUrls: ["../../assets/mocklist-1.jpg"]}]
    }, 
    {
        title: "And The Oscar Goes To...",
        description: "My reviews of the Oscar's nominees to the Best Picture award.",
        author: {
            _id: "1",
            username: "ThatMovieGuy"
        },
        reviews: [{imagesUrls: ["../../assets/mocklist-2.jpg"]}]
    },
    {
        title: "My Favorite Videogames",
        description: "Reviews of all my favorite videogames.",
        author: {
            _id: "1",
            username: "doomguy"
        },
        reviews: [{imagesUrls: ["../../assets/mocklist-3.jpg"]}]
    }
]

export default function WelcomePage() {
    const [verbIndex, setsetVerbIndex] = useState(0)

    const isSmallWidth = useMediaQuery({query: '(max-width: 550px)'})

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const loggedUserInfo = useSelector(state => state.user.user)

    useEffect(() => {
        const interval = setInterval(() => {
            setsetVerbIndex(prev => (prev + 1) % verbs.length)
        }, 5000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        if(loggedUserInfo) navigate("/feed", {replace: true})    
    }, [loggedUserInfo, navigate])

    return <div className={classes["general-container"]}>
        <section className={`${classes["title-section"]}`}>
            <div className={`${classes["text-div"]} ${classes["left-side"]}`}>
                <h1>{`Keep track of what you `} 
                    <AnimatePresence mode="wait">
                        <motion.span
                        className="highlight-text"
                        key={verbIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        style={{position: "absolute"}}
                        > 
                            <span style={{color: colors[verbIndex]}}>{` ${verbs[verbIndex]}.`}</span>
                        </motion.span>
                    </AnimatePresence>
                    ‎ 
                </h1>
                <h2>And let people know what you think!</h2>
            </div>

            <div className={classes["link-div"]}>
                <motion.button whileHover={{scale: 1.07}} className={classes["link-wrapper"]}><Link to={"/feed"}>Explore!</Link></motion.button>
            </div>
            
            <div className={classes["outer-image-container"]}>
                <div className={classes["inner-image-container"]}>
                    <img src={isSmallWidth ? "/assets/movie-mobile.jpg" : "/assets/movie.jpg"} alt="picture of a movie" />
                </div>
            </div>
        </section>

        <section className={`${classes["lists-section"]}`}>
            <div className={`${classes["lists-div"]}`}>
                <ul>
                    {lists.map((list, index) => {
                        return <li key={index}>
                            <WelcomeListCard list={list}/>
                        </li>
                    })}
                </ul>
                
            </div>
            
            <div className={`${classes["text-div"]}`}>
                <h1>Create and follow lists based on your interests.</h1>
                <h2>And learn more about them...</h2>
            </div>

        </section>

        <section className={`${classes["comments-section"]}`}>
            <div className={`${classes["comments-text-div"]}`}>
                <h1>A place to talk about everything you like.</h1>
                <h2>And learn what other people think about it.</h2>
            </div>
            <div className={classes["image-container"]}>
                <img className={classes["interaction-image"]} src="/assets/interaction-1.jpg" />
            </div>
            
            
        </section>
        
        <section className={`${classes["title-section"]}`} style={{justifyContent: "start"}}>
            
            <div className={`${classes["text-div"]} ${classes["left-side"]}`}>
                <h1>Interact with people with the same hobbies as you.</h1>
                <h2>And maybe discover new ones...</h2>
                
                {!isSmallWidth && <div className={classes["button-div"]}>
                    <motion.button 
                        whileHover={{scale: 1.07}} 
                        className={`button ${classes["signup-button"]}`}
                        onClick={() => dispatch(modalActions.setModal("signup"))}    
                    >
                        Sign Up
                    </motion.button>
                </div>}

            </div>

            {isSmallWidth && <div className={classes["button-div"]}>
                    <motion.button 
                        whileHover={{scale: 1.07}} 
                        className={`button ${classes["signup-button"]}`}
                        onClick={() => dispatch(modalActions.setModal("signup"))}
                    >
                        Sign Up
                    </motion.button>
            </div>}
            
            <div className={classes["outer-image-container"]}>
                <div className={classes["inner-image-container"]}>
                    <img src={isSmallWidth ? "/assets/videogame-mobile.jpg" : "/assets/videogame.jpg"} />
                </div>
            </div>
        </section>

    </div>
}