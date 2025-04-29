export function getRatingColorClass(rating){
    
    let boxColor
    let borderColor

    if(rating < 50){
        boxColor = "bad-review"
        borderColor = "bad-border"
    }else if(rating < 76){
        boxColor = "neutral-review"
        borderColor = "neutral-border"
    }else{
        boxColor = "good-review"
        borderColor = "good-border"
    }

    return {boxColor, borderColor}
}

export function calcRemainingTime(date){
    return  date - Date.now()
}

export function feedFormatedDate(rawDate){
    const date = new Date(rawDate)
    
    const now = new Date()
    const today = new Date( now.getFullYear(), now.getMonth(), now.getDate())

    const oneDay = 1000*60*60*24
    const yesterday = new Date( today.getTime() - oneDay)
    
    if(date.getTime() >= today.getTime()){
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    if(date.getTime() >= yesterday.getTime() ){
        return "yesterday"
    }

    //last year or older
    if(date.getFullYear < new Date().getFullYear()){
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    //in this year but older than yesterday
    return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    })
}

export function dateInputFormatedDate(rawDate){
    // This function returns the date in the XXXX-XX-XX format
    const date = new Date(rawDate)
    const formatedDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

    return formatedDate
}

export function stringifyCategories(array){
    let string = ""

    for(let i = 0; i < array.length; i++){
        string += array[i]
        if(i < array.length - 1) {string += ","}
    }

    return string
}