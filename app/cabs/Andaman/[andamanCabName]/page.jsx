import React from 'react'
import style from '@/styles/Home.module.css'
import { Col, Divider, Modal, Row } from 'antd'
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


const Menu = dynamic(() => import("@/components/master/header"))
const Footer = dynamic(() => import('@/components/master/Footer'))

// { data, sortedActivity, sortedFerryData }


// export default async function Cab({ params, searchParams }) {

// const [isMobile, setIsMobile] = useState(false)
// const [height, setHeight] = useState(null)
// const [cabsList, setCabsList] = useState([])

// const [activityDetails, setActivityDetails] = useState({})
// const [open, setOpen] = useState(false)

// useEffect(() => {
//     setIsMobile(mobile())

// }, [isMobile])

// useEffect(() => {
//     if (data != undefined) {
//         db.doc(`rentalAndaman/${data.id}`).collection('cabs').get().then((snap) => {
//             const dataTemp = []
//             snap.forEach(data => {
//                 dataTemp.push({ id: data.id, ...data.data() })
//             })

//             setCabsList(dataTemp)
//         })

//     }
// }, [data])


// const { andamanCabName } = params;
// const res = await db.collection("rentalAndaman").where("slug", "==", `/cabs/Andaman/${andamanCabName}`).get()
// const entry = res.docs.map((entry) => {
//   return ({ id: entry.id, ...entry.data() })
// });


// const resAndaman = await db.collection("activityAndaman").get()
// const entryAndaman = resAndaman.docs.map((entry) => {
//   return ({ id: entry.id, ...entry.data() })
// });

// let sortedData = []

// function GetRand(num) {
//   var ran = Math.floor(Math.random() * num)
//   if (num > 3 && num - ran >= 3) {
//     for (let index = 0; index < 3; index++) {
//       sortedData.push(entryAndaman[ran])
//       ran += 1

//     }
//   }
//   else if (num <= 3) {
//     for (let index = 0; index < num; index++) {
//       sortedData.push(entryAndaman[index])
//     }
//   }
//   else { GetRand(num) }
// }

// GetRand(entryAndaman.length)

// const resCruise = await db.collection("ferry").get()
// const entryCruise = resCruise.docs.map((entry) => {
//   return ({ id: entry.id, ...entry.data() })
// });

// let sortedFerryData = []

// function GetRandFerry(num) {
//   var ran = Math.floor(Math.random() * num)
//   if (num > 3 && num - ran >= 3) {
//     for (let index = 0; index < 3; index++) {
//       sortedFerryData.push(entryCruise[ran])
//       ran += 1

//     }
//   }
//   else if (num <= 3) {
//     for (let index = 0; index < num; index++) {
//       sortedFerryData.push(entryCruise[index])
//     }
//   }
//   else { GetRandFerry(num) }
// }

// GetRandFerry(entryCruise.length)



// if (entry.length == 0) {
//   return {
//     notFound: true
//   };
// }


// const data = entry[0]

// console.log(data)

// const resCabs = await db.doc(`rentalAndaman/${data.id}`).collection('cabs').get()
// const cabsList = resCabs.docs.map((res) => {
//   return ({ id: data.id, ...res.data() })
// });





export default async function AndamanCab({ params, searchParams }) {
  const { andamanCabName } = params;
  const res = await db.collection("rentalAndaman").where("slug", "==", `/cabs/Andaman/${andamanCabName}`).get()
  const entry = res.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  const resCab = await db.doc(`rentalAndaman/${entry[0].id}`).collection('cabs').get()
  const cabsList = resCab.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  // console.log(cabsList)

  const data = entry[0]

  return (
    <main>
      <Menu />
      <React.Fragment>
        <HeadImage title={data.title} image={data.headerImage} />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "3rem", background: "var(--lightBackground)" }}>
          <div style={{ width: '90%', display: mobile() ? "block" : "flex", gap: '3%', marginTop: '3%' }}>
            <div style={{ width: mobile() ? "100%" : "65%", display: 'flex', flexDirection: 'column', gap: "2rem", overflow: 'hidden' }}>
              <h1 style={{ fontWeight: 900, fontSize: mobile() ? "2rem" : "2.5rem" }}>{data.title}</h1>

              {cabsList.map((item, index) => (
                <SingleCab thumbnail={item.thumbnail} price={item.price} title={item.title} distance={item.distance} key={index} />
              ))}
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