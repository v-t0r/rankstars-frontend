import classes from "./DetailedListCard.module.css"

import { Link, useLocation, useNavigate } from "react-router-dom"

import ImageGrid from "../../imageGrid/ImageGrid"

export default function DetailedListCard({list}){
    const navigate = useNavigate()
    const location = useLocation()

    const images = list.reviews.map(review => review.imagesUrls[0])

    return <div className={classes["card"]}>
            <div
                className={classes["img-div"]}
                onClick={() => navigate(`/list/${list._id}?page=1&sortBy=userOrder&order=1`, { state: { prevPage: location.pathname, linkText: "all lists" }})} 
            >
                <ImageGrid images ={images} />
            </div>
            <div   className={classes["list-info-div"]}>
                <div className={classes["title-div"]}>
                    <Link to= {`/list/${list._id}`} state={ {prevPage: location.pathname, linkText: "all lists"} }>
                        <h1>{list.title}</h1></Link>
                    <Link 
                        to={`/list/${list._id}?page=1&sortBy=userOrder&order=1`}
                        state={{prevPage: location.pathname, linkText: "back to lists"}}    
                    >
                        See more
                    </Link>
                </div>
                <div className={classes["description-div"]}>
                    <Link to={`/profile/${list.author._id}`}>{list.author.username}</Link>
                    <p>{list.description}</p>
                </div>
            </div>
        </div>
}