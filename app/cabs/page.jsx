import dynamic from 'next/dynamic'

import React from 'react'
import style from '@/styles/packageName.module.css'
import { Divider } from 'antd'
import { db } from '@/firebase'
import SHome from '@/components/skeleton/SHome'
import Tile from '@/components/master/SingleTile'
import Image from 'next/image'

const Menu = dynamic(() => import("@/components/master/header"))
const HeadImage = dynamic(() => import("@/components/master/HeadImage"))


export default async function Rentals() {

  const resAndaman = await db.collection('rentalAndaman').get()
  const entryAndaman = resAndaman.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });


  const banner = (await db.doc(`pages/allPageBanner`).get()).data().RentalPage;

  function Scooty() {
    return (
      <div className='flex flex-col justify-start items-center p-4 w-[250px] border gap-4 rounded-2xl hover:shadow-xl'>
        <div className='w-full h-[180px] relative'><Image src={"/jupiter-scooty.jpg"} className=' object-contain' fill /></div>

        <div>
          <h2 className='text-xl font-bold'>Jupiter Scooty</h2>
          <p className='text-center'>699/day</p>
        </div>

        <p className=' bg-red-400 py-2 w-full text-center cursor-pointer rounded-full'>BOOK NOW</p>
      </div>
    )
  }

  if (entryAndaman == undefined) return <SHome />


  return (
    <div>
      <main>


        <div>
          <Menu />
          <HeadImage image={banner} title={"Rentals"} />

          <div style={{ padding: "3rem 5%", width: "100%", display: 'flex', flexDirection: 'column', gap: "1rem" }}>
            <h1 className='text-center'>Cabs in Andaman</h1>
            <p>{`Discover the tropical paradise of Andaman like never before with Mohi Holidays Leisures, your ultimate gateway to the best cab facility on the islands. At Mohi Holidays Leisures, we take pride in offering an all-encompassing cab service that ensures you experience the breathtaking beauty of Andaman to the fullest.`}</p>

            <div style={{ display: "flex", justifyContent: 'center', width: "100%", marginTop: '2rem' }}>
              <div className={style.packageRow}>
                {entryAndaman.map((item, index) => (
                  <Tile key={index} thumbnail={item.thumbnail} name={item.title} slug={item.slug} />
                ))}
              </div>
            </div>
            <hr />

            {/* Two wheeler section */}

            <h1 className='text-center'>Two Wheeler Rental In Andaman</h1>
            <div className='flex justify-center mt-[1rem] w-full'>
              <div className='flex gap-4 flex-wrap justify-center'>
                {Array(10).fill(0).map((item, i)=>(<Scooty key={i}/>))}
              </div>
            </div>
          </div>




        </div>
      </main>

    </div>
  )
}


