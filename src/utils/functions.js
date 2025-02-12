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