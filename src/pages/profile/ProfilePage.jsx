import classes from "./ProfilePage.module.css"

import { useLocation, useParams } from "react-router-dom"

import { useEffect, useState } from "react"

import { useDispatch, useSelector } from "react-redux"
import { loginModalActions, userActions } from "../../store"

import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "../../services/queryClient"
import { imageBackendUrl } from "../../utils/constants"
import { fetchUserInfo } from "../../services/users"
import { followUser, unfollowUser } from "../../services/users"

import CardContainer from "../../components/cards/CardContainer"
import Modal from "../../components/modal/Modal"
import UserList from "../../components/userList/UserList"
import { AnimatePresence } from "framer-motion"
import LoaderDots from "../../components/loaderDots/LoaderDots"
import ErrorCard from "../../components/errorCard/ErrorCard"

export default function ProfilePage(){
    const {id} = useParams()
    const loggedUserInfo = useSelector(state => state.user.user)

    const location = useLocation()
    const dispatch = useDispatch()

    const [followersModalOpen, setFollowersModalOpen] = useState(false)
    const [followingModalOpen, setFollowingModalOpen] = useState(false)

    useEffect(()=> {
        setFollowersModalOpen(false)
        setFollowingModalOpen(false)
    }, [location])

    let loggedUserProfile = false
    let loggedUserFollows = false
    let followingLoggedUser = false
    
    if(loggedUserInfo){
        loggedUserProfile = id == loggedUserInfo._id //This profile is from the logged user?
        loggedUserFollows = loggedUserInfo.following.includes(id)
        followingLoggedUser = loggedUserInfo.followers.includes(id)
    }
    
    //query para recupear informações do user
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["users", "profile", `${id}`],
        queryFn: ({signal}) => fetchUserInfo({signal, id}),
        retry: false
    })

    // o usuario logado deve seguir ou deixar de seguir?
    const mutationFunction = loggedUserFollows ? unfollowUser : followUser
    const followOp = loggedUserFollows ? "unfollow" : "follow"
    let buttonText = "follow"
    if(followingLoggedUser) {buttonText = "follow back"}
    if(loggedUserFollows) {buttonText = "unfollow"}
    
    //mutation para o usuário logado (deixar de) seguir o usuário
    const { mutate } = useMutation({
        mutationFn: mutationFunction,
        onSuccess: () => updateUserContext(followOp)
    }) 

    function updateUserContext(operation){
        let newLoggedUserInfo = structuredClone(loggedUserInfo)

        if(operation == "follow"){
            newLoggedUserInfo.following = [...loggedUserInfo.following, data.user._id]
        }
        if(operation == "unfollow"){
            newLoggedUserInfo.following = loggedUserInfo.following.filter(user => user !== data.user._id)
        }
        
        queryClient.invalidateQueries({
            queryKey: ["users", "profile", `${data.user._id}`],
            refetchType: "active"
        })

        dispatch(userActions.updateUserInfo({user: newLoggedUserInfo}))
    }

    function handleModal(type){
        switch(type) {
            case "followers":
                setFollowersModalOpen(state => !state)
                break;
            case "following":
                setFollowingModalOpen(state => !state)
                break;
        }
    }

    let content
    if(isPending){
        content = <LoaderDots/>
    }
    if(isError){
        content = <>
            {error.status === 404 ? 
                <ErrorCard title="User not exist!" message={<p>Are you shure this is the address you are looking for?</p>} />
                :
                <ErrorCard />
            }
        </>
    }
    if(data){
        const followers = data.user.followers
        const following = data.user.following
        const totalFollowers = followers.length
        const totalFollowing = following.length

        content = <>
            <div className={classes["profile-banner"]}>
                <div className={classes["banner"]}>
                    {/* <img src="https://play-lh.googleusercontent.com/proxy/yJkNj-NHyg85380cJwG3EGnvYnUh_ySQ8U0nUFCYtM25bgaOfBA6mp62pu7vbXrRD8U1m-xsbWJUm5GXHKzJUJa9y04f0Nzl2f1Gg2DbTmihM4Y0apzhkZSi=s3840-w3840-h2160" alt="" /> */}
                </div>
                <div className={classes["user-info"]}>
                    <div className={classes["pic-username"]}>
                        <img src={`${imageBackendUrl}/${data.user.profilePicUrl}`} alt="profile picture" />
                        <div className={classes["username-status"]}>
                            <h2>{data.user.username}</h2>
                            <p>{data.user.status}</p>
                        </div>
                    </div>

                    <div className={classes["followers-following"]}>
                        <p onClick={() => handleModal("following")}>{totalFollowing} Following</p>
                        <p onClick={() => handleModal("followers")} >{totalFollowers} {totalFollowers === 1? "Follower" : "Followers"}</p>
                        {!loggedUserProfile && 
                            <button 
                                className={followOp == "follow" ? classes["follow-button"] : classes["unfollow-button"]} 
                                onClick={() => loggedUserInfo ? mutate(id) : dispatch(loginModalActions.setLoginModalVisibility(true))}>{buttonText}
                            </button>
                        }
                    </div>

                </div>
                
            </div>

            <section className={classes["review-section"]}>
                <div className={classes["review-container"]}>
                    <CardContainer userId={id} type="reviews"/>
                </div>
            </section>

            <section className={classes["list-section"]}>
                <div className={classes["list-container"]}>
                    <CardContainer userId={id} type="lists"/>
                </div>
            </section>

            <AnimatePresence>
                {followersModalOpen && <Modal onClose={() => handleModal("followers")}>
                        <UserList username={data.user.username} profileUserId={data.user._id} type="followers" users={followers} onClose={() => handleModal("followers")}/>
                    </Modal>
                }
                {followingModalOpen && <Modal onClose={() => handleModal("following")}>
                        <UserList username={data.user.username} profileUserId={data.user._id} type="following" users={following} onClose={() => handleModal("following")}/>
                    </Modal>
                }
            </AnimatePresence>
            
        </>
    }
    
    return <>
        {content}
    </>
}