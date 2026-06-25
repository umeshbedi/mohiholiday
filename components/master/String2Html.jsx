"use client"
import React, { useEffect } from 'react'

export default function String2Html({string, id}) {
  const containerRef = React.useRef(null)

  useEffect(()=>{
    if (containerRef.current) {
      containerRef.current.innerHTML = string || ''
      const images = containerRef.current.getElementsByTagName('img')
      for (let index = 0; index < images.length; index++) {
        images[index].setAttribute("loading", "lazy")
      }
    }
  },[string])

  return (
    <div ref={containerRef} className='contentDiv' id={id}/>
  )
}
