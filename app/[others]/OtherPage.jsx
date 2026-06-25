import HeadImage from '@/components/master/HeadImage'
import SHome from '@/components/skeleton/SHome'
import SHeader from '@/components/skeleton/SHeader'
import dynamic from 'next/dynamic'
import React from 'react'

const String2Html = dynamic(() => import('@/components/master/String2Html'), { ssr: true, loading:()=> <SHome /> })
const Menu = dynamic(() => import("@/components/master/header"), { ssr: true, loading: () => <SHeader /> })

export default function OtherPage({data}) {
    return (
        <>
        <Menu />
        <HeadImage image={data?.headerImage} title={data?.title} isHalf={true}/>
        <div className='p-10 md:p-20'>
        <String2Html string={data?.about || data?.content} />
        </div>
        
        </>
    )
}
