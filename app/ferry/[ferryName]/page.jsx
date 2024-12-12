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

const Menu = dynamic(() => import("@/components/master/header"))
const HeadImage = dynamic(() => import("@/components/master/HeadImage"))

export default async function Slug({ params }) {



  const { ferryName } = params;
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

  if (entry.length == 0) {
    return {
      notFound: true
    };
  }

  const data = entry[0]

  console.log(data.ticket)

  if (data == undefined) return <Skeleton active style={{ marginTop: '3%' }} />

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

  return (
    <main>
      <div>
        
        <Menu />
        <HeadImage image={data.image} />

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
              <Ticket ticketData={data.ticket} ticketClass={data.classes} ferryName={data.name}/>
             
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
