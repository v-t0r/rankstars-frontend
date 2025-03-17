import classes from "./CategoriesList.module.css"

import CheckBoxInput from "../checkBoxInput.jsx/CheckBoxInput"

import { INTERESTS_LIST } from "../../utils/constants"

export default function UserHobbiesForm({user}){

    return <ul className={classes["list"]}>
        {INTERESTS_LIST.map((category, index) => {
            return <li key={index}>
                <CheckBoxInput
                    name={"category"}
                    value={category[0]}
                    label={category[1]}
                    checked={user ? user.interests.includes(category[0]) : false}
                    size="25px"
                />
                <p>{category[1]}</p>
            </li>
        })}
        
    </ul>
}