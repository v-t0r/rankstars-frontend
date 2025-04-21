import classes from "./FiltersForm.module.css"

import "react-datepicker/dist/react-datepicker.css";
import { dateInputFormatedDate } from "../../utils/functions";

export default function FiltersForm({type}){
    return <div className={classes["card"]}>
        <h2>Filters</h2>

        {type === "reviews" && <div className={classes["filter-div"]}>
            <h3>Rating</h3>
            <div className={classes["min-max-div"]}>
                <div className={classes["label-input"]}>
                    <label htmlFor="minRating">Min</label>
                    <input id="minRating" type="number" placeholder="0"/>
                </div>
                <div className={classes["label-input"]}>  
                    <label htmlFor="maxRating">Max</label>
                    <input id="max-rating" type="number" placeholder="100" />
                </div>
            </div>            
        </div>}

        <div className={classes["filter-div"]}>
            <h3>Date</h3>
            <div >
                <div className={classes["label-input"]}>
                    <label htmlFor="minRating">Min</label>
                    <input type="date" max={dateInputFormatedDate(Date.now())}/>
                </div>
                <div className={classes["label-input"]}>  
                    <label htmlFor="maxRating">Max</label>
                    <input type="date" max={dateInputFormatedDate(Date.now())}/>
                </div>
            </div> 
        </div>


    </div>
}