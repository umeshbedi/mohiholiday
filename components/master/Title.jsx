import React from 'react'
import style from './Title.module.css'

export default function Title({title="", isdark=false, extra=React.Component, center=false, margin}) {
  return (
    <div className={style.titleContainer} style={{margin:margin}}>
        <h1 className={style.title} style={{ color:isdark?"white":'black', textAlign:center?"center":"left"}}>{title}</h1>
        {extra}
    </div>
  )
}
