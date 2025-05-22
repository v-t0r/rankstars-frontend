import classes from "../../cards/listCard/DetailedListCard.module.css"

import WelcomeGridImage from "./WelcomeGridImage"

import React from "react"
import { Link } from "react-router-dom"


export default React.memo(function WelcomeListCard({list = {reviews: [], title: "", author: {_id: "", username: ""}, description: ""}}){
    const images = list.reviews.map(review => review.imagesUrls[0])

    return <div className={classes["card"]}>
        <div
            className={classes["img-div"]}
        >
            <WelcomeGridImage images={images} />
        </div>
        <div   className={classes["list-info-div"]}>
            <div className={classes["title-div"]}>
                <Link to= {`/`}>
                    <h1>{list.title}</h1>
                </Link>
            </div>
            <div className={classes["description-div"]}>
                <Link to={`/`}>{list.author.username}</Link>
                <p>{list.description}</p>
            </div>
        </div>
    </div>
})