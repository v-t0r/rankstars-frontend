import { imageBackendUrl } from "../../../utils/constants"
import classes from "./UserCard.module.css"

import { Link } from "react-router-dom"

export default function UserCard({user}){
    
    return <div className={classes["card"]}>
        <div className={classes["image-container"]}>
            <img src={`${imageBackendUrl}/${user.profilePicUrl}`} />
        </div>
        <div className={classes["user-info"]}>
            <div className={classes["username-div"]}>
                <Link to={`/profile/${user._id}`}>{user.username}</Link>
            </div>
            <p>{user.status}</p>
        </div>
 
    </div>
}