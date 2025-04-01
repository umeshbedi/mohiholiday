import { Button, Collapse, Divider, Skeleton, Tabs, message, Modal } from 'antd'
import Head from 'next/head'
import React from 'react'

import Image from 'next/image'
import String2Html from '@/components/master/String2Html'
import { mobile } from '@/components/utils/variables'
import { db } from '@/firebase'
import TicketQuery from '@/components/master/TicketQuery'
import dynamic from 'next/dynamic'
import SHeader from '@/components/skeleton/SHeader'
import SHome from '@/components/skeleton/SHome'
import Tile from '@/components/master/SingleTile'
import Ticket from './Ticket'

import { FaAnglesRight } from "react-icons/fa6";
import { notFound } from 'next/navigation'

const Menu = dynamic(() => import("@/components/master/header"))
const HeadImage = dynamic(() => import("@/components/master/HeadImage"))

export default async function Slug({ params }) {

  const { ferryName } = await params;

  const res = await db.collection("ferry").where("slug", "==", `/ferry/${ferryName}`).get()
  // console.log(res)

  const entry = res.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });


  const resAndaman = await db.collection("activityAndaman").get()
  const entryAndaman = resAndaman.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });


  let sortedData = []

  function GetRand(num) {
    var ran = Math.floor(Math.random() * num)
    if (num > 4 && num - ran >= 4) {
      for (let index = 0; index < 4; index++) {
        sortedData.push(entryAndaman[ran])
        ran += 1

      }
    }
    else if (num <= 4) {
      for (let index = 0; index < num; index++) {
        sortedData.push(entryAndaman[index])
      }
    }
    else { GetRand(num) }
  }

  GetRand(entryAndaman.length)

  const data = entry[0]

  // console.log(data.ticket)

    if (entry.length==0)return notFound()

  const tabItem = [
    {
      label: `About ${data.name}`,
      key: 1,
      children: <String2Html id={'aboutFerry'} string={data.about} />,
    },
    {
      label: `Terms and Conditions`,
      key: 2,
      children: <String2Html id={'termAndCondtionFerry'} string={data.termAndCondtion} />,
    }
  ]

  const iconCard = [
    { title: "1. Search", desc: "and compare ferry from wide range of choices", icon: "/icons/Search.png", color:"sky-100" },
    { title: "2. Select", desc: "ferry based on timing and choose seat type", icon: "/icons/Select.png", color:"sky-200" },
    { title: "3. Pay", desc: "in full for instant tickets or small advance for 'On Request' tickets", icon: "/icons/Pay.png", color:"sky-300" },
    { title: "4. Receive", desc: "your confirmed ticket instantly or in 3-4 working hours", icon: "/icons/Receive Tickets Via Email.png", color:"sky-400" },
  ]


  return (
    <main>
      <div>

        <Menu />
        <HeadImage image={data.image} />

        <div className='sm:flex flex flex-col sm:flex-row gap-6 w-full bg-[var(--lightBackground)] px-[5%] pt-10 justify-center items-center'>

          {iconCard.map((itm, i) => (
            <div key={i} className={`w-[250px] bg-${itm.color} flex flex-col items-center rounded-2xl justify-center relative border border-sky-500`}>
              
              <FaAnglesRight size={30} className={`absolute ${i==3?'hidden':'block'} text-orange-600 right-[-15px]`} />

              <div className='w-full h-[175px] my-5 relative'>
                <Image src={itm.icon} fill className='object-contain' />
              </div>

              <div className='p-4 h-[160px]'>
                <h2>{itm.title}</h2>
                <p>{itm.desc}</p>
              </div>

            </div>
          ))}


        </div>

        <div className='backCurve5' style={{ display: 'flex', justifyContent: 'center', background: "var(--lightBackground)" }}>

          <div style={{ width: '90%', display: mobile() ? "block" : "flex", gap: '3%', marginTop: '3%' }}>
            <div style={{ width: mobile() ? "100%" : "65%", background: 'white', padding: '3%', display: 'flex', flexDirection: 'column', gap: 15 }}>
              <Tabs
                size='large'
                type='card'
                items={tabItem}

              />

            </div>

            <div style={{ width: mobile() ? "100%" : '35%', height: 'fit-content' }} id='ticketCollapse'>
              <Ticket ticketData={data.ticket} ticketClass={data.classes} ferryName={data.name} />

              <div style={{ background: 'white', padding: '5%', marginTop: "2rem", display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Activities of Andaman</h2>
                {sortedData.map((item, i) => {
                  return (<Tile key={i} name={item.title} slug={item.slug} thumbnail={item.thumbnail} />)

                })

                }
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  )
}


// export const getStaticPaths = async () => {
//   const entries = await db.collection("ferry").get()
//   const paths = entries.docs.map(entry => ({
//     params: {
//       ferryName: entry.data().slug
//     }
//   }));
//   return {
//     paths,
//     fallback: true
//   }
// }

// export const getStaticProps = async (context) => {
//   const { ferryName } = context.params;
//   const res = await db.collection("ferry").where("slug", "==", `/ferry/${ferryName}`).get()
//   // console.log(res)

//   const entry = res.docs.map((entry) => {
//     return ({ id: entry.id, ...entry.data() })
//   });


//   const resAndaman = await db.collection("activityAndaman").get()
//   const entryAndaman = resAndaman.docs.map((entry) => {
//     return ({ id: entry.id, ...entry.data() })
//   });


//   let sortedData = []

//   function GetRand(num) {
//     var ran = Math.floor(Math.random() * num)
//     if (num > 4 && num - ran >= 4) {
//       for (let index = 0; index < 4; index++) {
//         sortedData.push(entryAndaman[ran])
//         ran += 1

//       }
//     }
//     else if (num <= 4) {
//       for (let index = 0; index < num; index++) {
//         sortedData.push(entryAndaman[index])
//       }
//     }
//     else { GetRand(num) }
//   }

//   GetRand(entryAndaman.length)

//   if (entry.length == 0) {
//     return {
//       notFound: true
//     };
//   }

//   return {
//     props: {
//       data: entry[0],
//       sortedData
//     },
//     revalidate: 60,

//   }

// }
