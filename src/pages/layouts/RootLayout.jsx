import { Outlet, useLocation } from "react-router-dom"
import MainHeader from "../../components/header/MainHeader"
import Modal from "../../components/modal/Modal"
import LoginForm from "../../components/loginForm/LoginForm"
import { useDispatch, useSelector } from "react-redux"
import { modalActions } from "../../store"
import { AnimatePresence } from "framer-motion"
import SignupForm from "../../components/loginForm/SignupForm"
import { useEffect, useRef } from "react"
import { calcRemainingTime } from "../../utils/functions"
import { logout } from "../../services/auth"

export default function RootLayout(){
    const {currentModal} = useSelector(state => state.modal)

    const expDate = useSelector(state => state.user.expDate)
    const dispatch = useDispatch()
    const timeoutRef = useRef(null)
    
    const location = useLocation()
    const isWidePage = location.pathname === "/"

    useEffect(()=>{
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        
        if(expDate){
            timeoutRef.current = setTimeout(() => {
                logout()
            }, calcRemainingTime(expDate))
        }
    }, [expDate])

    return <>
        <MainHeader />
        <main className={isWidePage ? "wide-main" : undefined}>
            <Outlet />

            <AnimatePresence>
                {currentModal && 
                    <Modal onEscape={() => dispatch(modalActions.closeModal())}>
                        {currentModal === "signup" && 
                            <SignupForm 
                                onClose={() => dispatch(modalActions.closeModal())}
                                onLogin={() => dispatch(modalActions.setModal("login"))}
                            />
                        }

                        {currentModal === "login" && 
                            <LoginForm 
                                onClose={() => dispatch(modalActions.closeModal())}
                                onSignup={() => dispatch(modalActions.setModal("signup"))}
                            />
                        }
                    </Modal>
                }
            </AnimatePresence>

        </main>

        <footer>
            <p>RankStars 2025 - Build with React & Express.JS</p>
            <ul>
                <li><a href="https://www.github.com/v-t0r/rankstars-frontend">About</a></li>
                <li><a href="https://www.github.com/v-t0r">Github</a></li>
                <li><a href="https://www.linkedin.com/in/vitor-b-05bba2124/">Linkedin</a></li>
                <li><a href="mailto:vitorlemes.com@hotmail.com">Contact</a></li>
            </ul>
            
        </footer>
    </>
}