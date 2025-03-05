import classes from "./MainHeader.module.css"

import {useNavigate} from "react-router-dom"

import SideMenu from "../sideMenu/SideMenu"
import { useDispatch, useSelector } from "react-redux"
import { loginModalActions } from "../../store"

export default function MainHeader(){
    const user = useSelector(state => state.user.user)
    const  dispatch = useDispatch()
    const navigate = useNavigate()
    
    function handleHome() {
        navigate("/")    
    }

    return <>
        <header className={classes["header"]}>
            <div className={classes["header-logo"]}>
                <img onClick={handleHome} src="/assets/logos/starranks-logo-150px.png" alt="StarRanks Logo"></img>
                <h1 onClick={handleHome}>rankstars</h1>
            </div>

            {user && <input className={classes["search-bar"]} type="text"/>}

            {!user && <button className="text-button" onClick={() => dispatch(loginModalActions.setLoginModalVisibility(true))}>Login/Signup</button>}
            {user && <SideMenu/>}
            
        </header>
    </>
}