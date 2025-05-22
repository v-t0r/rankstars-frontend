import { Outlet, useLocation } from "react-router-dom"
import MainHeader from "../../components/header/MainHeader"
import Modal from "../../components/modal/Modal"
import LoginForm from "../../components/loginForm/LoginForm"
import { useDispatch, useSelector } from "react-redux"
import { loginModalActions } from "../../store"
import { AnimatePresence } from "framer-motion"
import SignupForm from "../../components/loginForm/SignupForm"
import { useEffect, useRef } from "react"
import { calcRemainingTime } from "../../utils/functions"
import { logout } from "../../services/auth"

export default function RootLayout(){
    const {visibility: loginModalVisibility, signupMode} = useSelector(state => state.loginModal)

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
                {loginModalVisibility && 
                    <Modal onEscape={() => dispatch(loginModalActions.setLoginModalVisibility(false))}>
                        { signupMode ? 
                            <SignupForm 
                                onClose={() => dispatch(loginModalActions.setLoginModalVisibility(false))}
                                onLogin={() => dispatch(loginModalActions.setSignupMode(false))}
                            />
                            : 
                            <LoginForm 
                                onClose={() => dispatch(loginModalActions.setLoginModalVisibility(false))}
                                onSignup={() => dispatch(loginModalActions.setSignupMode(true))}
                            />
                        }
                    </Modal>
                }
            </AnimatePresence>

        </main>

        <footer>RankStars 2024 - Um projeto React & Express.JS</footer>
    </>
}