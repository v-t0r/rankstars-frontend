/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
import { useNavigate } from "react-router-dom"
import classes from "./UserList.module.css"

import { imageBackendUrl, queryClient } from "../../util/http"
import { useDispatch, useSelector } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import { followUser, unfollowUser } from "../../util/fetch/users"
import { userActions } from "../../store"

export default function UsersList({username, profileUserId, users, type, onClose}) {
    
    const navigate = useNavigate()

    const loggedUserInfo = useSelector(state => state.user.user)
    const dispatch = useDispatch()

    const {mutate: mutateFollowUser} = useMutation({
        mutationFn: followUser,
        onSuccess: (_data, variables, _context) => updateUserContext("follow", variables)
    })

    const {mutate: mutateUnfollowUser} = useMutation({
        mutationFn: unfollowUser,
        onSuccess: (_data, variables, _context) => updateUserContext("unfollow", variables)
    })

    function updateUserContext(operation, userId){
        const user = users.filter(user => user._id === userId) //lista com somente o user (des)seguido
        let newLoggedUserInfo = structuredClone(loggedUserInfo)
        
        //adiociona ou removo o user
        if(operation == "follow"){
            newLoggedUserInfo.following = [...loggedUserInfo.following, ...user]
        }
        if(operation == "unfollow"){
            newLoggedUserInfo.following = loggedUserInfo.following.filter(user => user._id !== userId)
        }

        //invalido as queries para atualizar a ui
        queryClient.invalidateQueries({
            queryKey: ["users", "profile", `${profileUserId}`],
            refetchType: "active"
        })

        //atualizo o estado do contexto das informações do usuário logado
        dispatch(userActions.updateUserInfo({user: newLoggedUserInfo}))
    }

    function handleFollow(userId){
        
        mutateFollowUser(userId)
    }

    function handleUnfollow(userId){
        
        mutateUnfollowUser(userId)
    }

    // verify if the logged user follows or not the users in the list
    // and if the user in the list follows the logged users
    const following_status = users.map(user => {
        if(user._id == loggedUserInfo._id){
            return "it's you!"
        }
        if(loggedUserInfo.following.filter(value => value._id === user._id).length){
            return "unfollow"
        }
        if(loggedUserInfo.followers.filter(value => value._id === user._id).length){
            return "follow back"
        }else{
            return "follow"
        }
    })

    return <div className={classes["container"]}>
        <div className={classes["title-container"]}>
            <h1>{username}&apos;s {type}</h1>
            <button onClick={onClose} className="negative-button" id={classes["close-button"]}>X</button>
        </div>

        <ul>
            {users.map((user, index) => {
                return <li key={user._id}>
                    <div className={classes["img-and-username"]}>
                        <img src={`${imageBackendUrl}/${user.profilePicUrl}`} alt={`${user.username}'s profile picture`} onClick={() => navigate(`/profile/${user._id}`)}></img>
                        <div className={classes["username-status"]}>
                            <p id={classes["username"]} onClick={() => navigate(`/profile/${user._id}`)}>{user.username}</p>
                            <p id={classes["status"]}>{user.status}</p>
                        </div>
                        
                    </div>
                    <div className={classes["button-container"]}>
                        {!(following_status[index] === "it's you!") && 
                            <button 
                                className={
                                    (following_status[index] === "follow" || following_status[index] === "follow back") ? 
                                    classes["follow-button"] : classes["unfollow-button"]
                                }
                                onClick={following_status[index] === "unfollow"? () => handleUnfollow(user._id) : () => handleFollow(user._id)}
                            >        
                                {following_status[index]}
                            </button>
                        }
                    </div>
                    

                </li>                
            })}

            {!users.length && type=="followers" && <div className={classes["empty-warning"]}><p >Looks like this user doesn&apos;t have any followers yet...</p> <p>Why not be the first?</p></div>}
            {!users.length && type=="following" && <p className={classes["empty-warning"]}>Looks like this user doesn&apos;t follows anyone yet...</p>}
    
        </ul>

    </div>
}