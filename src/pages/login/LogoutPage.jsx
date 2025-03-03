import store, { userActions } from "../../store"
import { useNavigate } from "react-router-dom"

import { backendUrl } from "../../utils/constants"
import { useEffect } from "react"

export default function LogoutPage(){
    const navigate = useNavigate()


    useEffect(() => {
        store.dispatch(userActions.updateUserInfo({user: null}))
        async function logout(){
            await fetch(`${backendUrl}/logout`, {
                credentials: "include"
            })
        }
        logout()
        navigate("/login")
    }, [navigate])

    return <></>
}