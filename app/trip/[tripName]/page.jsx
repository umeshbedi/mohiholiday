import { db } from '@/firebase'
import dynamic from 'next/dynamic'

import React from 'react'

const Menu = dynamic(() => import("@/components/master/header"))
const HeadImage = dynamic(() => import("@/components/master/HeadImage"))

import SingleTrip from './SingleTrip'


export default async function Trip({ params }) {
    const { tripName } = await params

    const resAndaman = await db.collection('dayTrip').where("type", "==", `${tripName}`).get()
    const tripAndaman = resAndaman.docs.map((entry) => {
        return ({ id: entry.id, ...entry.data() })
    });

    // console.log("getting trip data",tripAndaman)

   

    return (
        <main>
            <Menu />
            <HeadImage image='/images/cabimage2.jpg' title={`${tripName} Trips in Andaman`} />

            <div className='py-[3rem] mt-10 flex w-full justify-center'>
                <div className='flex sm:w-[80%] flex-wrap'>
                    {tripAndaman.map((item, i) => (<SingleTrip key={i} data={item}/>))}
                </div>
            </div>
        </main>
    )
}
