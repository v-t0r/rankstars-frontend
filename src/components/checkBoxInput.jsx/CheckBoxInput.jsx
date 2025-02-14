import { useEffect, useState } from "react"
import classes from "./CheckBoxInput.module.css"

export default function CheckBoxInput({name, value, id=value, label=value, checked=false, size="2rem", fontSize=size}){
    const [isChecked, setIsChecked] = useState()

    useEffect(() => {
        setIsChecked(checked)
    }, [checked])

    return <div className={classes["main-container"]}>
        <label htmlFor={id} hidden>{label}</label>
        <input type="checkbox" name={name} id={id} value={value}  checked={isChecked} hidden/>
        <span 
            className={`${classes["span-box"]} ${isChecked ? classes["checked"] : undefined }`} 
            onClick={() => setIsChecked(prevValue => !prevValue)}
            style={{width: size, height: size }}
        >
            {isChecked && 
                <span 
                    className="material-symbols-outlined"
                    style={{ fontSize: fontSize, fontWeight: "600"}} 
                >
                    check
                </span>
            }
        </span>
    </div>
}