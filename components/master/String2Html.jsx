import React, { useEffect } from 'react'

export default function String2Html({string, id}) {
  useEffect(()=>{
    const element = document.getElementById(`${id}`)
    element.innerHTML = string
    const image = document.getElementsByTagName('img')
    for (let index = 0; index < image.length; index++) {
      image[index].setAttribute("loading", "lazy")
      
      // console.log(image[index])
    }

  },[])
  return (
    <div className='contentDiv' id={id}/>
  )
}
