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

        <footer>RankStars 2024 - Um projeto React & Express.JS</footer>
    </>
}