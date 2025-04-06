import classes from "./TabButton.module.css"

import { motion } from "framer-motion"

export default function TabButton({onClick, isActive, children}){
    return <div className={classes["tab-button"]}>
        <button onClick={onClick}>{children}</button>
        {isActive && <motion.div layoutId="active-tab" className={classes["active-tab"]}></motion.div>}
    </div>
}