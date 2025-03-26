import classes from "./MainHeader.module.css"

import {useLocation, useNavigate} from "react-router-dom"

import SideMenu from "../sideMenu/SideMenu"
import { useDispatch, useSelector } from "react-redux"
import { loginModalActions } from "../../store"
import { useEffect, useRef } from "react"

export default function MainHeader(){
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const location = useLocation()
    const inputRef =  useRef()

    useEffect( () => {
        if(location.pathname !== "/search"){
            inputRef.current.value = ""
        }
    }, [location])


    function handleHome() {
        navigate("/")    
    }

    function handleSearch(e){
        e.preventDefault()
        navigate(`/search?search=${encodeURIComponent(inputRef.current.value)}`)
    }

    return <>
        <header className={classes["header"]}>
            <div className={classes["header-logo"]}>
                <img onClick={handleHome} src="/assets/logos/starranks-logo-150px.png" alt="StarRanks Logo"></img>
                <h1 onClick={handleHome}>rankstars</h1>
            </div>

            <form className={classes["search-bar-form"]} onSubmit={handleSearch}>
                <input ref={inputRef} className={classes["search-bar"]} type="text"/>
                <button className="button">Search</button>
            </form>

            {!user && <button className="text-button" onClick={() => dispatch(loginModalActions.setLoginModalVisibility(true))}>Login/Signup</button>}
            {user && <SideMenu/>}
            
        </header>
    </>
}