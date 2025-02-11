import classes from "./OverflowMenu.module.css"

export default function OverflowMenu({children, handleCloseMenu, left = null, right = null, bottom = null, top = null}){

    const menuAbsolutePosition = {
        left: left ? left : undefined,
        right: right ? right : undefined,
        bottom: bottom ? bottom : undefined,
        top: top ? top : undefined
    }

    return <>
        <div 
            className={`${classes["menu-container"]}`}
            style = {menuAbsolutePosition}
        >
            {children}
        </div>

        {/* Quando o usuário clicar em qualquer lugar com o menu aberto, ele fecha */}
        <div onClick={handleCloseMenu} className={classes["invisible-click-wall"]}></div>
    </>
}