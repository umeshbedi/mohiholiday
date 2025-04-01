"use client"

import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { Button, Divider, Empty, Modal, Skeleton } from 'antd'

import Link from 'next/link'

import Image from 'next/image'
import { db } from '@/firebase'
import { boxShadow, mobile } from '@/components/utils/variables'
import ContactForm from '@/components/master/ContactForm'
import String2Html from '@/components/master/String2Html'
import dynamic from 'next/dynamic'
import SHeader from '@/components/skeleton/SHeader'
import SHome from '@/components/skeleton/SHome'

import Tile from '@/components/master/SingleTile'



export default function SingleActivity({ data, sortedData, parentActivity }) {

  // console.log(sortedData)
  const [open, setOpen] = useState(false)

  const [activityDetails, setActivityDetails] = useState({})

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(mobile())
  }, [isMobile])

  if (data == undefined) return <Skeleton active style={{ marginTop: '3%' }} />

  return (
    <>
        <div
          className='backCurve5'
          style={{ display: 'flex', justifyContent: 'center', }} id='packageContainer'>
          <div style={{ width: '90%', display: mobile() ? "block" : "flex", gap: '4%', marginTop: '3%' }}>
            <div
              style={{ width: mobile() ? '100%' : "70%", background: 'white', padding: '3%', display: 'flex', flexDirection: 'column', gap: 15 }}>
              <h1>{data.title}</h1>
              <Divider style={{ margin: "0", backgroundColor: "var(--lightGreyColor)", height: 1 }} />
              <String2Html id={'aboutIsland'} string={data.about} />

            </div>

            <div style={{ width: mobile() ? '100%' : '30%', background: 'white', padding: '3%', height: 'fit-content', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'center' }}>Visit Other Activities of {parentActivity}</h2>
              <Divider style={{ backgroundColor: "var(--lightGreyColor)", height: 1 }} />
              {sortedData.map((item, i) => (
                <Link
                  data-aos="fade-up"
                  data-aos-anchor-placement="top-bottom"
                  data-aos-duration="2000"
                  key={i} target='blank' href={item.slug}>
                  <div id='cardImage' style={{ borderRadius: 10, background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: boxShadow, width: 260, marginBottom: 30 }}>
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      preview={false}
                      width={260}
                      height={280}
                      style={{ objectFit: 'cover', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                    <h2 style={{ padding: '5%', textAlign: 'center' }}>{item.title}</h2>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
      >
        <h2>Booking:</h2>
        <Divider style={{ margin: '1%' }} />
        <h1 style={{ margin: '1% 0', fontSize: '2rem' }}>₹{activityDetails.price}</h1>
        <ContactForm
          to={'activity'}
          packageName={data.name}
          packageDetail={`
          <p>Activity Name: ${activityDetails.name}</p>
          <p>Price: ₹${activityDetails.price}</p>
          <p>Duration: ${activityDetails.duration}</p>
        `}
        />
      </Modal>

    </>
  )
}

// export async function getStaticPaths() {
//   const allpaths = []
//   db.collection("activityAndaman").get().then((snap) => {
//     snap.forEach((sndata) => {
//       sndata.data().data.map(dta => {
//         allpaths.push(dta.slug)
//       })
//     })
//   })
//   db.collection("activityBali").get().then((snap) => {
//     snap.forEach((sndata) => {
//       sndata.data().data.map(dta => {
//         allpaths.push(dta.slug)
//       })
//     })
//   })


//   return {
//     paths: allpaths.map((path) => (
//       { params: { ActivityName: path } }
//     )),
//     fallback: true
//   }
// }

// export const getStaticProps = async (context) => {
//   const { activityPlace, ActivityName } = context.params;

//   const res = await db.collection(`activity${activityPlace}`).where("slug", "==", `/activity/${activityPlace}/${ActivityName}`).get()
//   const entry = res.docs.map((entry) => {
//     return ({ id: entry.id, ...entry.data() })
//   });

//   const resAll = await db.collection(`${activityPlace == "Andaman" ? "activityAndaman" : "activityBali"}`).get()
//   // console.log(resAll.size)

//   const entryAll = resAll.docs.map((entry) => {
//     return ({ id: entry.id, ...entry.data() })
//   });

//   let sortedData = []

//   function GetRand(num) {
//     var ran = Math.floor(Math.random() * num)
//     if (num > 4 && num - ran >= 4) {
//       for (let index = 0; index < 4; index++) {
//         sortedData.push(entryAll[ran])
//         ran += 1

//       }
//     }
//     else if (num <= 4) {
//       for (let index = 0; index < num; index++) {
//         sortedData.push(entryAll[index])
//       }
//     }
//     else { GetRand(num) }
//   }

//   GetRand(entryAll.length)

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
