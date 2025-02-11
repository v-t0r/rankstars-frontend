import classes from "./MainHeader.module.css"

import {Link, useNavigate, useRouteLoaderData} from "react-router-dom"

import ProfileMenu from "./ProfileMenu"

export default function MainHeader(){
    const token = useRouteLoaderData("root")
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

            {token && <input className={classes["search-bar"]} type="text"/>}

            {!token && <Link to="/login">Login/Signup </Link>}
            {token && <ProfileMenu/>}
            
        </header>
    </>
}