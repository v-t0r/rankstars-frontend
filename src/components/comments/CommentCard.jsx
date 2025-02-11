import classes from "./CommentCard.module.css"
import { useState } from "react"
import CommentInput from "./CommentInput"
import CommentCore from "./CommentCore"


export default function CommentCard({comment}){
    //controla a visibilidade do caixa de texto de resposta
    const [answerInput, setAnswerInput] = useState(false)
    const [answersVisibility, setAnswersVisibility] = useState(false)

    function handleAnswerInput(){
        setAnswerInput(state => !state)
    }

    function handleAnswersVisibility(){
        setAnswersVisibility(state => !state)
    }

    return <>
        <CommentCore comment={comment} type={"comment"} onReplyClick={handleAnswerInput}/>
        
        {answerInput && <CommentInput parent={comment} type={"comments"}/>}
        
        <div className={classes["answers-div"]}>
            {comment.comments.length > 0 && !answersVisibility && <button onClick={handleAnswersVisibility}>+{comment.comments.length} answer{comment.comments.length === 1 ? "" : "s"}</button>}

            {answersVisibility && <>
                {comment.comments.map(comment => <CommentCore key={comment._id} comment={comment} type="answer" />)}
                {comment.comments.length !== 0 && <button onClick={handleAnswersVisibility}>hide this answers</button>}
            </>}        
        </div>
    </>

}