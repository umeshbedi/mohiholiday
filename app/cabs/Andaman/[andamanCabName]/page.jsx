import React from 'react'
import style from '@/styles/Home.module.css'
import { Col, Divider, Empty, Modal, Row } from 'antd'
import Image from 'next/image'
import { FaMap, FaUser } from 'react-icons/fa'
import { CarFilled } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import SHeader from '@/components/skeleton/SHeader'
import { boxShadow, mobile } from '@/components/utils/variables'
import SHome from '@/components/skeleton/SHome'
import { db } from '@/firebase'
import HeadImage from '@/components/master/HeadImage';
import Tile from '@/components/master/SingleTile'
import ContactForm from '@/components/master/ContactForm'
import SingleCab from './SingleCabl'
import { notFound } from 'next/navigation'


const Menu = dynamic(() => import("@/components/master/header"))
const Footer = dynamic(() => import('@/components/master/Footer'))

export default async function AndamanCab({ params, searchParams }) {

  function Scooty({name, price, image}) {
      return (
        <div className='flex flex-col bg-white justify-start items-center p-4 w-[250px] border gap-4 rounded-2xl hover:shadow-xl'>
          <div className='w-full h-[180px] relative'><Image src={image} className=' object-contain' fill /></div>
  
          <div>
            <h2 className='text-xl font-bold'>{name}</h2>
            <p className='text-center'>{price}/day</p>
          </div>
  
          <p className=' bg-red-400 py-2 w-full text-center cursor-pointer rounded-full'>BOOK NOW</p>
        </div>
      )
    }

  const { andamanCabName } = params;
  const res = await db.collection("rentalAndaman").where("slug", "==", `/cabs/Andaman/${andamanCabName}`).get()
  const entry = res.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  const resCab = await db.doc(`rentalAndaman/${entry[0].id}`).collection('cabs').get()
  const cabsList = resCab.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });
  
  const data = entry[0]

  if (entry.length==0)return notFound()

  const wheeler2 = cabsList.filter((f)=>f.type=="2")
  const wheeler4 = cabsList.filter((f)=>f.type==undefined || f.type=="4")
  
  console.log(wheeler2)

  // console.log(cabsList)



  return (
    <main>
      <Menu />
      <React.Fragment>
        <HeadImage title={data.title} image={data.headerImage} />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "3rem", background: "var(--lightBackground)" }}>
          <div style={{ width: '90%', display: mobile() ? "block" : "flex", gap: '3%', marginTop: '3%' }}>
            <div style={{ width: mobile() ? "100%" : "65%", display: 'flex', flexDirection: 'column', gap: "2rem", overflow: 'hidden' }}>
              <h1 style={{ fontWeight: 900, fontSize: mobile() ? "2rem" : "2.5rem" }}>{data.title}</h1>
              <hr />
              <h2 >Four Wheeler Rental</h2>
              {wheeler4.map((item, index) => (
                <SingleCab thumbnail={item.thumbnail} price={item.price} title={item.title} distance={item.distance} key={index} />
              ))}
            </div>

            <div style={{ width: mobile() ? "100%" : '35%', height: 'fit-content', marginTop: mobile() ? "4.5rem" : null }}>
            <div style={{ padding: '5%', marginTop: "2rem", display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap:20 }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", padding: '0 10%' }}>Two Wheeler Rental</h2>
                { wheeler2.length > 0 &&
                wheeler2.map((item, i)=>(<Scooty key={i} name={item.title} price={item.price} image={item.thumbnail}/>))
                }
                {
                  wheeler2.length==0 &&
                  <Empty imageStyle={{width:"100%"}}/>
                }
              </div>
            </div>

            {/* <div style={{ width: mobile() ? "100%" : '35%', height: 'fit-content', marginTop: mobile() ? "4.5rem" : null }} id='ticketCollapse'>
              <div style={{ padding: '5%', marginTop: "2rem", display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", padding: '0 10%' }}>Popular Cruises of Andaman</h2>
                {sortedFerryData.map((item, i) => {
                  return (<Tile key={i} name={item.name} slug={item.slug} thumbnail={item.image} />)

                })
                }
              </div>
              <div style={{ padding: '0 20%' }}><Divider /></div>
              <div style={{ padding: '5%', marginTop: "2rem", display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", padding: '0 10%' }}>Activities of Andaman</h2>
                {sortedData.map((item, i) => {
                  return (<Tile key={i} name={item.name} slug={item.slug} thumbnail={item.thumbnail} />)

                })
                }
              </div>



            </div> */}

          </div>
        </div>
      </React.Fragment>

    </main>
  )


}


export async function generateMetadata({ params, searchParams }, parent) {

  return {
    title: "Cabs in Andaman",
    description: "Cabs in andaman",
    openGraph: {
      images: "/something.jpg",
      title: "Cabs in Andaman",
      description: "Cabs in Andaman",
    },

  }
}