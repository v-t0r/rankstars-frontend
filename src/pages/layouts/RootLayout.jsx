import { Outlet, useLoaderData, useSubmit } from "react-router-dom"
import MainHeader from "../../components/header/MainHeader"
import { useEffect } from "react"
import { getTokenRemainingTime } from "../../services/auth"

export default function RootLayout(){
    const token = useLoaderData()
    const submit = useSubmit()

    useEffect(() => {
        if(!token) { //if thats no token, dont do anything
            return 
        }

        if(token === "EXPIRED"){
            submit(null, {action: "/logout", method: "post"})
        }

        const tokenRemainingTime = getTokenRemainingTime()

        setTimeout(() => {
            submit(null, {action: "/logout", method: "post"})
        }, tokenRemainingTime) //set a time to remaining time
    }, [token, submit])

    return <>
        <MainHeader />
        <main>
            <Outlet />
        </main>

        <footer>RankStars 2024 - Um projeto React & Express.JS</footer>

        {/* <div className={classes["new-review-button"]}></div> */}

    </>
}