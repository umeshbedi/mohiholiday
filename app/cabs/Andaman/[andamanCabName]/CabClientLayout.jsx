"use client"
import React, { useState } from 'react';
import { Divider, Empty, Modal } from 'antd';
import Image from 'next/image';
import { mobile } from '@/components/utils/variables';
import FAQ from '@/components/master/FAQ';
import SingleCab from './SingleCabl';
import CabEnquiryForm from '@/components/master/CabEnquiryForm';

export default function CabClientLayout({ data, wheeler2, wheeler4 }) {
    const [open, setOpen] = useState(false);
    const [activityDetails, setActivityDetails] = useState({ name: '', price: '', distance: '' });

    function handleBookNow(details) {
        setActivityDetails(details);
        setOpen(true);
    }

    function Scooty({ name, price, image }) {
        return (
            <div className='flex flex-col bg-white justify-start items-center p-4 w-[250px] border gap-4 rounded-2xl hover:shadow-xl'>
                <div className='w-full h-[180px] relative'><Image src={image} className=' object-contain' fill alt={name} /></div>
                <div>
                    <h2 className='text-xl font-bold'>{name}</h2>
                    <p className='text-center'>{price}/day</p>
                </div>
                <p 
                    style={{ background: 'var(--primaryColor)', fontSize: '1.2rem' }} 
                    className=' text-white py-2 w-full text-center cursor-pointer rounded-full'
                    onClick={() => handleBookNow({ name, price: `₹${price}`, distance: 0 })}
                >
                    Book Now
                </p>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "3rem", background: "var(--lightBackground)" }}>
          <div style={{ width: '90%', display: mobile() ? "block" : "flex", gap: '3%', marginTop: '3%' }}>
            <div style={{ width: mobile() ? "100%" : "65%", display: 'flex', flexDirection: 'column', gap: "2rem", overflow: 'hidden' }}>
              <h1 style={{ fontWeight: 900, fontSize: mobile() ? "2rem" : "2.5rem" }}>{data.title}</h1>
              <hr />
              <h2 >Four Wheeler Rental</h2>
              {wheeler4.map((item, index) => (
                <SingleCab 
                    thumbnail={item.thumbnail} 
                    price={item.price} 
                    title={item.title} 
                    distance={item.distance} 
                    key={index} 
                    onBookNow={handleBookNow}
                />
              ))}

              <FAQ faqData={data.faqs} />
            </div>

            <div style={{ width: mobile() ? "100%" : '35%', height: 'fit-content', marginTop: mobile() ? "4.5rem" : null }}>
              <div style={{ padding: '5%', marginTop: "2rem", display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 20 }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", padding: '0 10%' }}>Two Wheeler Rental</h2>
                {wheeler2.length > 0 &&
                  wheeler2.map((item, i) => (<Scooty key={i} name={item.title} price={item.price} image={item.thumbnail} />))
                }
                {
                  wheeler2.length == 0 &&
                  <Empty imageStyle={{ width: "100%" }} />
                }
              </div>
            </div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={[]}
            >
                <h2 style={{textAlign:'center'}}>Book Your Ride</h2>
                <Divider style={{ margin: '1%' }} />
                <CabEnquiryForm
                    packageName={`${activityDetails.name}`}
                    packageDetail={`
          <p>Cab Name: ${activityDetails.name}</p>
          <p>Price: ${activityDetails.price}</p>
          <p>Distance: ${activityDetails.distance} kms</p>
        `}
                />
            </Modal>

          </div>
        </div>
    )
}
