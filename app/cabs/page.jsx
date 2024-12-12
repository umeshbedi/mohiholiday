import dynamic from 'next/dynamic'

import React from 'react'
import style from '@/styles/packageName.module.css'
import { Divider } from 'antd'
import { db } from '@/firebase'
import SHome from '@/components/skeleton/SHome'
import Tile from '@/components/master/SingleTile'

const Menu = dynamic(() => import("@/components/master/header"))
const HeadImage = dynamic(() => import("@/components/master/HeadImage"))


export default async function Rentals() {

  const resAndaman = await db.collection('rentalAndaman').get()
  const entryAndaman = resAndaman.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });


  const banner = (await db.doc(`pages/allPageBanner`).get()).data().RentalPage;

  if (entryAndaman == undefined) return <SHome />
  
  return (
    <div>
      <main>


        <div>
          <Menu />
          <HeadImage image={banner} title={"Rentals"} />

          <div style={{ padding: "3rem 5%", width: "100%", display: 'flex', flexDirection: 'column', gap: "1rem" }}>
            <h1>Cabs in Andaman</h1>
            <p>{`Discover the tropical paradise of Andaman like never before with Mohi Holidays Leisures, your ultimate gateway to the best cab facility on the islands. At Mohi Holidays Leisures, we take pride in offering an all-encompassing cab service that ensures you experience the breathtaking beauty of Andaman to the fullest.`}</p>

            <div style={{ display: "flex", justifyContent: 'center', width: "100%", marginTop: '2rem' }}>
              <div className={style.packageRow}>
                {entryAndaman.map((item, index) => (
                  <Tile key={index} thumbnail={item.thumbnail} name={item.title} slug={item.slug} />
                ))}
              </div>
            </div>
          </div>




        </div>
      </main>

    </div>
  )
}


// export const getStaticProps = async () => {
//   const resAndaman = await db.collection('rentalAndaman').get()
//   const entryAndaman = resAndaman.docs.map((entry) => {
//     return ({ id: entry.id, ...entry.data() })
//   });


//   const banner = (await db.doc(`pages/allPageBanner`).get()).data().RentalPage;

//   return {
//     props: {
//       entryAndaman,

//       banner
//     },
//     revalidate: 60,

//   }
// }
