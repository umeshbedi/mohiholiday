import React from 'react'
import { Skeleton } from 'antd'
import {GoogleMap, useLoadScript, Marker} from '@react-google-maps/api'

export default function Location({location}) {
    
    const latLong = location.split(",")

    const {isLoaded} = useLoadScript({
        googleMapsApiKey:process.env.NEXT_PUBLIC_MAP_API_KEY
    })

    if (!isLoaded) return <Skeleton/>

    

  return (
    <GoogleMap
    zoom={15}
    center={{lat:Number(latLong[0]), lng:Number(latLong[1])}}
    mapContainerStyle={{width:'100%', height:200}}
    >
      <Marker position={{lat:Number(latLong[0]), lng:Number(latLong[1])}}/>
    </GoogleMap>
  )
}
