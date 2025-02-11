import classes from "./AltListCard.module.css"

import { imageBackendUrl } from "../../../util/http"

export default function AltListCard ({list}){
    console.log(list)

    return <div className={classes["card"]}>
        <div className={classes["title-div"]}>
            <h3>{list.title}</h3>
        </div>

        <div className={classes["image-grid"]}>
            <div className={classes["image-container"]}>
                <img src={`${imageBackendUrl}/${list.reviews[0].imagesUrls[0]}`} alt="image" />
            </div>
            <div className={classes["image-container"]}>
                <img src={`${imageBackendUrl}/${list.reviews[1].imagesUrls[0]}`} alt="image" />
            </div>
            <div className={classes["image-container"]}>
                <img src={`${imageBackendUrl}/${list.reviews[2].imagesUrls[0]}`} alt="image" />
            </div>
            <div className={classes["image-container"]}>
            <img src={`${imageBackendUrl}/${list.reviews[3].imagesUrls[0]}`} alt="image" />
            </div>
        </div>

    </div>
}