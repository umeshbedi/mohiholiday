"use client"
import React, { useState } from "react"
import { MdLocationOn } from "react-icons/md";
import Image from 'next/image'
import String2Html from "@/components/master/String2Html";
import { Button, Modal } from "antd";

export default function SingleTrip({ data, index }) {
    const [open, setOpen] = useState(false)
    return (
        <div className='w-[100%] sm:w-[50%] p-8'>
            <div className='bg-slate-200 w-full h-full rounded-3xl'>

                {/* image section */}
                <div className={`wfull h-[300px] bg-white rounded-3xl relative flex justify-center`}>
                    <Image src={"/images/cabimage2.jpg"} fill className='object-cover rounded-3xl p-2 shadow-md' />
                    <div className='bg-white p-3 flex absolute bottom-[-40px] rounded-full gap-9 items-center px-5 shadow-md'>
                        <p className=' bg-[var(--primaryColor)] py-2 w-full text-center text-white px-3 cursor-pointer rounded-full font-bold'>BOOK NOW</p>
                        <div className='w-fit'>
                            <h2 className='text-nowrap'>₹ {data.price}</h2>
                            <p className='text-sm text-nowrap'>per person</p>
                        </div>
                    </div>
                </div>


                <div className='mt-20 p-6 flex flex-col gap-4'>
                    <h2>{data.title}</h2>
                    <div className='flex gap-2 items-center'>
                        <MdLocationOn size={25} />
                        <p className='font-bold'>{data.location}</p>
                    </div>
                    <p><span className='font-bold'>Trip Duration:</span> {data.duration} hours</p>

                    <div className='h-[200px] sm:h-[130px] overflow-hidden'>
                        <String2Html string={data.about} id={data.id} />
                    </div>
                    {data.about.length > 272 &&
                        <Button
                            type="primary"
                            className="w-fit bg-[var(--primaryColor)]"
                            onClick={()=>setOpen(true)}
                        >
                            Read More
                        </Button>
                    }


                </div>

            </div>
            <Modal
                open = {open}
                onCancel={() => setOpen(false)}
                footer={[]}
            >
                <div className="mt-4 overflow-y-auto">
                    <String2Html string={data.about} id={"erdf343"+data.id} />
                </div>
            </Modal>
        </div>
    )
}