import { Outlet, redirect } from "react-router-dom"
import MainHeader from "../../components/header/MainHeader"
import { useEffect } from "react"
import { useSelector } from "react-redux"

export default function RootLayout(){
    const user = useSelector(state => state.user.user)
    
    useEffect(() => {
        if(!user) { //if thats no user, go to login
            redirect("/login")
            return 
        }

    }, [user])

    return <>
        <MainHeader />
        <main>
            <Outlet />
        </main>

        <footer>RankStars 2024 - Um projeto React & Express.JS</footer>
        
    </>
}