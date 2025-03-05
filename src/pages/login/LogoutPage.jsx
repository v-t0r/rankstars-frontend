import store, { userActions } from "../../store"
import { useNavigate } from "react-router-dom"

import { useEffect } from "react"

export default function LogoutPage(){
    const navigate = useNavigate()


    useEffect(() => {
        store.dispatch(userActions.updateUserInfo({user: null}))

        navigate("/login")
    }, [navigate])

    return <></>
}