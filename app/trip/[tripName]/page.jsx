import dynamic from 'next/dynamic'
import Image from 'next/image'
import React from 'react'

const Menu = dynamic(() => import("@/components/master/header"))
const HeadImage = dynamic(() => import("@/components/master/HeadImage"))
import { MdLocationOn } from "react-icons/md";

export default async function Trip({ params }) {
    const { tripName } = await params

    function Trip() {
        return (
            <div className='w-[100%] sm:w-[50%] p-8'>
                <div className='bg-slate-200 w-full h-full rounded-3xl'>

                    {/* image section */}
                    <div className='wfull h-[300px] bg-white rounded-3xl relative flex justify-center'>
                        <Image src={"/images/cabimage2.jpg"} fill className='object-cover rounded-3xl p-2 shadow-md' />
                        <div className='bg-white p-3 flex absolute bottom-[-40px] rounded-full gap-9 items-center px-5 shadow-md'>
                            <p className=' bg-red-400 py-2 w-full text-center text-white px-3 cursor-pointer rounded-full font-bold'>BOOK NOW</p>
                            <div className='w-fit'>
                                <h2 className='text-nowrap'>₹ 2000</h2>
                                <p className='text-sm text-nowrap'>per person</p>
                            </div>
                        </div>
                    </div>


                    <div className='mt-20 p-6 flex flex-col gap-4'>
                        <h2>Day Trip to Chidiyatapu Beach</h2>
                        <div className='flex gap-2 items-center'>
                            <MdLocationOn size={25} />
                            <p className='font-bold'>Chidiya tapu, Port Blair</p>
                        </div>
                        <p><span className='font-bold'>Trip Duration:</span> 8 hours</p>
                        
                        <div className='h-30 overflow-y-scroll'>
                            <p>25 km away from Port Blair, Chidyatapu is also known as Sunset point as it offers you a majestic view of a seaside sunset. A 45-minute drive from Port Blair will take you to this place. Birds watching & a trek to Munda Pahad are some of the major attractions of this place.</p>
                        </div>
                    </div>

                </div>

            </div>
        )
    }

    return (
        <main>
            <Menu />
            <HeadImage image='/images/cabimage2.jpg' title={`${tripName} Trips in Andaman`} />

            <div className='py-[3rem] mt-10 flex w-full justify-center'>
                <div className='flex w-[80%] flex-wrap'>
                    {Array(3).fill(0).map((item, i) => (<Trip key={i} />))}
                </div>
            </div>
        </main>
    )
}
