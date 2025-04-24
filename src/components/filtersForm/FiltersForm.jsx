import classes from "./FiltersForm.module.css"

import "react-datepicker/dist/react-datepicker.css";
import { dateInputFormatedDate } from "../../utils/functions";
import { useEffect, useState } from "react";

export default function FiltersForm({type, topCategories, inicialFilterValues, onSetFilters}){
    const [filters, setFilters] = useState({
        minRating: "",
        maxRating: "",
        minDate: "",
        maxDate: "",
        selectedCategories: ""
    })
        
    useEffect(() => {
        setFilters({
            minRating: inicialFilterValues.minRating ?? "",
            maxRating: inicialFilterValues.maxRating ?? "",
            minDate: inicialFilterValues.minDate ?? "",
            maxDate: inicialFilterValues.maxDate ?? "",
            selectedCategories: inicialFilterValues.categories ?? ""
        })
    }, [inicialFilterValues])

    function handleApply(){
        onSetFilters(Object.fromEntries(Object.entries(filters).filter(([_, value]) => (value != null && value != ""))))
    }

    console.log(topCategories)

    return <div className={classes["card"]}>
        
        <div className={classes["filters-div"]}>
            <h2>Filters</h2>
            {type === "reviews" && <div className={classes["filter-div"]}>
                <h3>Rating</h3>
                <div className={classes["column-flexbox-div"]}>
                    <div className={classes["label-input"]}>
                        <label htmlFor="minRating">Min</label>
                        <input 
                            id="minRating" 
                            type="number" 
                            placeholder="0"
                            value={filters.minRating}   
                            onChange={(e) => setFilters(prev => ({...prev, minRating: e.target.value}))} 
                        />
                    </div>
                    <div className={classes["label-input"]}>  
                        <label htmlFor="maxRating">Max</label>
                        <input 
                            id="max-rating" 
                            type="number" 
                            placeholder="100" 
                            value={filters.maxRating}   
                            onChange={(e) => setFilters(prev => ({...prev, maxRating: e.target.value}))}
                        />
                    </div>
                </div>            
            </div>}

            {type != "users" && <div className={classes["filter-div"]}>
                <h3>Date</h3>
                <div className={classes["column-flexbox-div"]}>
                    <div className={classes["label-input"]}>
                        <label htmlFor="minRating">Min</label>
                        <input 
                            type="date" 
                            max={dateInputFormatedDate(Date.now())}
                            value={filters.minDate}   
                            onChange={(e) => setFilters(prev => ({...prev, minDate: e.target.value}))}    
                        />
                    </div>
                    <div className={classes["label-input"]}>  
                        <label htmlFor="maxRating">Max</label>
                        <input 
                            type="date" 
                            max={dateInputFormatedDate(Date.now())}
                            value={filters.maxDate}   
                            onChange={(e) => setFilters(prev => ({...prev, maxDate: e.target.value}))}    
                        />
                    </div>
                </div> 
            </div>}

            <div className={classes["filter-div"]}>
                <h3>Category</h3>
                {/* {filters.categories.map((category, index) => <p key={index}>{category}</p>)} */}
            </div>
        </div>
        
        <button 
            className={`button secondary-button ${classes["apply-button"]}`}
            onClick={handleApply}    
        >Apply Filters</button>

    </div>
}