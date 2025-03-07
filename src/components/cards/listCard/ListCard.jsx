import classes from "./ListCard.module.css"

import { useNavigate } from "react-router-dom"
import ImageGrid from "../../imageGrid/ImageGrid"

export default function ListCard({list}){
    const navigate = useNavigate()

    const images = list.reviews.map(review => review.imagesUrls[0])


    return <div onClick={()=> navigate(`/list/${list._id}`)} className={classes["card"]}>
        <div className={classes["title-div"]}>
            <h3>{list.title}</h3>
        </div>

        <ImageGrid images={images} />

    </div>
}