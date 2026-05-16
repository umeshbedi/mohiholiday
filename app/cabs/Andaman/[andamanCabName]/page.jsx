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
import FAQ from '@/components/master/FAQ'


const Menu = dynamic(() => import("@/components/master/header"))
const Footer = dynamic(() => import('@/components/master/Footer'))

import CabClientLayout from './CabClientLayout';

export default async function AndamanCab({ params, searchParams }) {

  const { andamanCabName } = await params;
  const res = await db.collection("rentalAndaman").where("slug", "==", `/cabs/Andaman/${andamanCabName}`).get()
  const entry = res.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  if (entry.length === 0) return notFound();

  const resCab = await db.doc(`rentalAndaman/${entry[0].id}`).collection('cabs').get()
  const cabsList = resCab.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  const data = entry[0];

  const wheeler2 = cabsList.filter((f) => f.type == "2")
  const wheeler4 = cabsList.filter((f) => f.type == undefined || f.type == "4")

  // console.log(wheeler2)

  // console.log(cabsList)



  return (
    <main>
      <Menu />
      <React.Fragment>
        <HeadImage title={data.title} image={data.headerImage} />
        <CabClientLayout data={data} wheeler2={wheeler2} wheeler4={wheeler4} />
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