import classes from "./FiltersForm.module.css"

import "react-datepicker/dist/react-datepicker.css";
import { dateInputFormatedDate, stringifyCategories } from "../../utils/functions";
import { useEffect, useState } from "react";
import CheckBoxInput from "../checkBoxInput.jsx/CheckBoxInput";

export default function FiltersForm({type, categoriesCount = [], inicialFilterValues, onSetFilters}){
    const [filters, setFilters] = useState({
        minRating: "",
        maxRating: "",
        minDate: "",
        maxDate: "",
        category: "",
    })
       
    useEffect(() => {
        setFilters({
            minRating: inicialFilterValues.minRating ?? "",
            maxRating: inicialFilterValues.maxRating ?? "",
            minDate: inicialFilterValues.minDate ?? "",
            maxDate: inicialFilterValues.maxDate ?? "",
            category: inicialFilterValues.category ? inicialFilterValues.category.split(",") : []
        })
    }, [inicialFilterValues])

    function handleChangeCategories(isChecked, categoryName) {

        setFilters(prev => {
            let newCategories = [...prev.category]
            newCategories = isChecked ? newCategories.concat(categoryName) : newCategories.filter(cat => cat !== categoryName) 
            return {...prev, category: newCategories}
        })
    }

    function handleChangeRating(newValue, inputId){
        // console.log(newValue)
        if(newValue < 0 || newValue > 100) return 
        
        setFilters(prev => ({...prev, [inputId]: newValue}))
    }

    function handleApply(){
        onSetFilters(
            Object.fromEntries(
                Object.entries({
                        ...filters,
                        category: stringifyCategories(filters.category)
                    })
                    // eslint-disable-next-line no-unused-vars
                    .filter(([_key, value]) => {
                        return (value != null && value != "")
                    })
            )
        )
    }

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
                            onKeyDown={(e) => [".", ",", "-", "+"].includes(e.key) && e.preventDefault()}
                            onChange={(e) => handleChangeRating(e.target.value, e.target.id)} 
                        />
                    </div>
                    <div className={classes["label-input"]}>  
                        <label htmlFor="maxRating">Max</label>
                        <input 
                            id="maxRating" 
                            type="number" 
                            placeholder="100" 
                            value={filters.maxRating}
                            onKeyDown={(e) => [".", ",", "-", "+"].includes(e.key) && e.preventDefault()}  
                            onChange={(e) => handleChangeRating(e.target.value, e.target.id)}
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
                <div className={classes["checkbox-list"]}>
                    {categoriesCount.map((category) => {
                        
                        const nameField = type === "users" ? "interestName" : "categoryName"
                        const idField = type === "users" ? "interestId" : "categoryId"
                        
                        return <div className={classes["category-checkbox-div"]} key={category}>
                            <CheckBoxInput 
                                size="1.4rem"
                                value={category[nameField]}
                                checked = {filters.category.includes(category[idField])}
                                onCheck={(newStatus) => handleChangeCategories(newStatus, category[idField])}
                            />
                            <div className={classes["category-text"]}>
                                <p>{category[nameField]}</p>
                                <span>[{category.count}]</span>
                            </div>
                        </div>
                        
                    })}
                    {categoriesCount.length === 0 && <p style={{textAlign: "center", color: "var(--blue-gray)"}} >No results...</p>}
                </div>
                
            </div>
        </div>
        
        <button 
            className={`button secondary-button ${classes["apply-button"]}`}
            onClick={handleApply}    
        >Apply Filters</button>

    </div>
}