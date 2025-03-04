import { Outlet, useNavigate } from "react-router-dom"
import MainHeader from "../../components/header/MainHeader"
import { useSelector } from "react-redux"
import { useEffect, useRef } from "react"
import { calcRemainingTime } from "../../utils/functions"

export default function RootLayout(){
    const {user, expDate} = useSelector(state => state.user)
    const navigate = useNavigate()
    const timeoutRef = useRef(null)
    
    useEffect(()=> {
            
        //apaga timeout anterior se houver
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
            
        //se user está logado, deve setar timeout
        if(user){
            timeoutRef.current = setTimeout(()=> {
                navigate("/logout")
            }, calcRemainingTime(expDate))
        }

        //se por algum motivo houver uma re-run, apaga timeout anterior
        return () => clearTimeout(timeoutRef.current)
    }, [user, expDate, navigate])
    
    return <>
        <MainHeader />
        <main>
            <Outlet />
        </main>

        <footer>RankStars 2024 - Um projeto React & Express.JS</footer>
    </>
}