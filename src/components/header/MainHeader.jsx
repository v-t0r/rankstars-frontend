import classes from "./MainHeader.module.css"

import {useLocation, useNavigate, useSearchParams} from "react-router-dom"

import SideMenu from "../sideMenu/SideMenu"
import { useDispatch, useSelector } from "react-redux"
import { modalActions } from "../../store"
import { useEffect, useRef } from "react"

export default function MainHeader(){
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const location = useLocation()
    const inputRef =  useRef()

    useEffect( () => {
        if(location.pathname !== "/search"){
            inputRef.current.value = ""
        }
        
        if(location.pathname === "/search"){
            inputRef.current.value = searchParams.get("search")
        }
    }, [location, searchParams])

    function handleHome() {
        navigate("/feed")    
    }

    function handleSearch(e){
        e.preventDefault()

        if(inputRef.current.value.trim() === "") { return }
        
        if(location.pathname !== "/search")
            navigate(`/search?search=${encodeURIComponent(inputRef.current.value.trim())}`)
    
        navigate(`/search?search=${encodeURIComponent(inputRef.current.value.trim())}&where=${searchParams.get("where")}`)

    }

    return <>
        <header className={classes["header"]}>
            <div className={classes["header-logo"]}>
                <img onClick={handleHome} src="/assets/logos/starranks-logo-150px.png" alt="StarRanks Logo"></img>
                <h1 onClick={handleHome}>rankstars</h1>
            </div>

            <form className={classes["search-bar-form"]} onSubmit={handleSearch}>
                <input ref={inputRef} className={classes["search-bar"]} type="text" placeholder="Search..." />
                <button><span className={`material-symbols-outlined ${classes["menu-icon"]}`}>search</span></button>
            </form>

            <div className={classes["profile-div"]}>
                {!user && <button className="text-button" onClick={() => dispatch(modalActions.setModal("login"))}>Login/Signup</button>}
                {user && <SideMenu/>}
            </div>

            
        </header>
    </>
}