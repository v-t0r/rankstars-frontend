import classes from "./cardContainer.module.css"
import { useQuery } from "@tanstack/react-query"

import { fetchUserReviews } from "../../services/users"

import ReviewCard from "./reviewCard/ReviewCard"
import { Link } from "react-router-dom"
import { fetchUserLists } from "../../services/users"
import ListCard from "./listCard/ListCard"
import LoaderDots from "../loaderDots/LoaderDots"
import ErrorCard from "../errorCard/ErrorCard"

export default function CardContainer({userId, type}) {

    const queryFn = ({signal}) => type === "reviews" ? fetchUserReviews(signal, userId) : fetchUserLists(signal, userId)
    const queryKey = type === "reviews" ? ["reviews", "user", `${userId}`] : ["lists", "user", `${userId}`]

    const {data, isPending, isError} = useQuery({
        queryKey: queryKey,
        queryFn: queryFn
    })

    let content
    if(isPending){
        content = <LoaderDots />
    }

    if(isError){
        content = <ErrorCard title="Fail to fetch this info." message={<p>Try again later!</p>} />
    }

    if(data){
        
        const cardsInfo = type ==="reviews" ? data.reviews.slice(0, 4) : data.lists.slice(0,4)
        
        content = <ul className={cardsInfo.length < 4 ? classes["less-than-four"] : undefined}>

            {cardsInfo.map(card => {
                return <li key={card._id}>
                    {type === "reviews" ? <ReviewCard review = {card} /> : <ListCard list = {card} />}
                </li>
            })}

            {!cardsInfo.length && <h2>This user has no {type} yet...</h2>}
        </ul> 
    }

    return <div className={classes["container"]}>
        <div className={classes["container-header"]}>
            <h1>{type.charAt(0).toUpperCase() + type.slice(1)}</h1>
            {data && type=="reviews" && data.reviews.length !== 0 && <Link to={`reviews`}>See All</Link>}
            {data && type=="lists" && data.lists.length !== 0 && <Link to={`lists`}>See All</Link>}
            
        </div>

        {content}
    </div>

}