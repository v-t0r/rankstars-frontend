import classes from "./PageSelector.module.css"

import { motion } from "framer-motion"

export default function PageSelector({currentPage, totalPages, onPageChange}){

    const pagesArray = [...Array(totalPages)].map((_, index) => index + 1)
    const firstPage = 1
    const lastPage = pagesArray[pagesArray.length - 1]

    return <div className={classes["buttons-container"]}>
        
        {(firstPage < (currentPage - 2)) &&
            <>
                <PageButton key={firstPage} pageNumber={firstPage} currentPage={currentPage} onPageChange ={onPageChange} />
                ...
            </>
        }

        {pagesArray.map(pageNumber => {

            if((pageNumber >= currentPage - 2 && pageNumber >= 0) &&
               (pageNumber <= currentPage + 2 && pageNumber <= totalPages) 
            ){
                return <PageButton key={pageNumber} pageNumber={pageNumber} currentPage={currentPage} onPageChange ={onPageChange} />
            }
        
        })}
        
        {(lastPage > (currentPage + 2)) && 
            <>
                ...
                <PageButton key={lastPage} pageNumber={lastPage} currentPage={currentPage} onPageChange ={onPageChange} />
            </>
        }
        
    </div>
}

function PageButton({pageNumber, currentPage, onPageChange}){
    
    return <motion.button 
        whileHover={{scale: 1.05}}
        key={pageNumber} 
        className={`${classes["button"]} ${currentPage == pageNumber && classes["current-page"]}`}
        onClick={() => onPageChange(pageNumber)}
    >
        {pageNumber}
    </motion.button>
}