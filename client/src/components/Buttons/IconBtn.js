import React from 'react'

function IconBtn({icon,color,bgColor,onClick}) {
  return (
    <button className={"iconBtn"} style={{color:color,background:bgColor}} onClick={()=>onClick()}>
        {icon}
    </button>
  )
}

export default IconBtn