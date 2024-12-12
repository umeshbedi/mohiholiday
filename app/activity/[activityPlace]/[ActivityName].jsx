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
import { useRouter } from 'next/router'
import Tile from '@/components/master/SingleTile'

const Menu = dynamic(() => import("@/components/master/header"), { ssr: false, loading: () => <SHeader /> })
const HeadImage = dynamic(() => import("@/components/master/HeadImage"), { ssr: false, loading: () => <SHome /> })




export default function ActivityName({ data, sortedData }) {
  const { query } = useRouter()
  // console.log(sortedData)
  const [open, setOpen] = useState(false)

  const [activityDetails, setActivityDetails] = useState({})

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(mobile())
  }, [isMobile])

  if (data == undefined) return <Skeleton active style={{ marginTop: '3%' }} />
  return (
    <main>
      <Head>
        <title>{data.name}</title>
        <meta name="description" content={data.metaDescription}></meta>
        <meta property='og:image' content={data.thumbnail}></meta>
      </Head>
      <div>
        <Menu />
        <HeadImage image={data.headerImage} />

        <div
          className='backCurve5'
          style={{ display: 'flex', justifyContent: 'center', background: "var(--lightBackground)" }} id='packageContainer'>
          <div style={{ width: '90%', display: isMobile ? "block" : "flex", gap: '4%', marginTop: '3%' }}>
            <div
              style={{ width: isMobile ? "100%" : "70%", background: 'white', padding: '3%', display: 'flex', flexDirection: 'column', gap: 15 }}>
              <h1>About {data.name}</h1>
              <Divider style={{ margin: "0", backgroundColor: "var(--lightGreyColor)", height: 1 }} />
              <String2Html id={'aboutIsland'} string={data.about} />

            </div>

            <div style={{ width: isMobile ? "100%" : '30%', height: 'fit-content', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
              <div style={{ background: 'white', padding: '5%', }}>

                <h2 style={{ textAlign: "center" }}>Activities in {data.name}</h2>
                <Divider style={{ backgroundColor: "var(--lightGreyColor)", height: 1 }} />
                {data.data.map((item, i) => (
                  <div
                    data-aos="fade-up"
                    data-aos-anchor-placement="top-bottom"
                    data-aos-duration="1000"
                    key={i} id='cardImage'
                    style={{ borderRadius: 10, background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: boxShadow, width: "100%", marginBottom: i != (data.data.length - 1) ? 30 : 0 }}>
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      // preview={false}
                      width={"100%"}
                      style={{ objectFit: 'cover', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                    <h2 style={{ padding: '5% 5% 0 5%', textAlign: 'center' }}>{item.name}</h2>

                    <Divider>
                      <p style={{ padding: '2px 10px', borderRadius: 20, border: `solid 1px ${"var(--lightGreyColor)"}` }}>{item.duration}</p>
                    </Divider>

                    <div style={{ display: 'flex', width: '100%' }}>
                      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: "grey" }}>
                        <h1 style={{ textAlign: 'center', color: 'white', fontSize: '2rem' }}>₹{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>
                      </div>
                      <div
                        onClick={() => {
                          setOpen(true);
                          setActivityDetails({
                            name: item.name,
                            duration: item.duration,
                            price: item.price
                          })
                        }}
                        style={{ height: 50, width: '50%', background: "var(--primaryColor)", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                        <p style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Book Now</p>
                      </div>
                    </div>

                  </div>

                ))}
              </div>
              <div style={{ background: 'white', padding: '5%', marginTop: "2rem", display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Other Activities of {query.activityPlace}</h2>
                {sortedData.map((item, i) => {
                  if (item.id !== data.id) {
                    return (<Tile key={i} name={item.title} slug={item.slug} thumbnail={item.thumbnail} />)
                  } else {
                    return <Empty key={i}/>
                  }
                })

                }
              </div>
            </div>
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

    </main>
  )
}

export async function getStaticPaths() {
  const allpaths = []
  db.collection("activityAndaman").get().then((snap) => {
    snap.forEach((sndata) => {
      sndata.data().data.map(dta => {
        allpaths.push(dta.slug)
      })
    })
  })
  db.collection("activityBali").get().then((snap) => {
    snap.forEach((sndata) => {
      sndata.data().data.map(dta => {
        allpaths.push(dta.slug)
      })
    })
  })


  return {
    paths: allpaths.map((path) => (
      { params: { ActivityName: path } }
    )),
    fallback: true
  }
}

export const getStaticProps = async (context) => {
  const { activityPlace, ActivityName } = context.params;

  const res = await db.collection(`activity${activityPlace}`).where("slug", "==", `/activity/${activityPlace}/${ActivityName}`).get()
  const entry = res.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  const resAll = await db.collection(`${activityPlace == "Andaman" ? "activityAndaman" : "activityBali"}`).get()
  // console.log(resAll.size)

  const entryAll = resAll.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  let sortedData = []

  function GetRand(num) {
    var ran = Math.floor(Math.random() * num)
    if (num > 4 && num - ran >= 4) {
      for (let index = 0; index < 4; index++) {
        sortedData.push(entryAll[ran])
        ran += 1

      }
    }
    else if (num <= 4) {
      for (let index = 0; index < num; index++) {
        sortedData.push(entryAll[index])
      }
    }
    else { GetRand(num) }
  }

  GetRand(entryAll.length)

  if (entry.length == 0) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      data: entry[0],
      sortedData
    },
    revalidate: 60,

  }

}
