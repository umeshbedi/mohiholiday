"use client"

import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { Button, Divider, Empty, Modal, Skeleton, Form, Input, DatePicker, Select, message } from 'antd'
import firebase from 'firebase/compat/app'

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
import FAQ from '@/components/master/FAQ'
import { 
    ArrowRightOutlined, 
    HeartOutlined, 
    HeartFilled, 
    ClockCircleOutlined, 
    StarFilled 
} from '@ant-design/icons';

function OtherActivityCard({ item }) {
    const normalized = (item.title || "").toLowerCase();
    let mock = {
        price: 4500,
        originalPrice: 5400,
        discount: "20% OFF",
        duration: "60 min",
        rating: 5,
        certified: true
    };
    
    if (normalized.includes("north bay")) {
        mock = { price: 3500, originalPrice: 4500, discount: "22% OFF", duration: "45 min", rating: 5, certified: true };
    } else if (normalized.includes("nemo")) {
        mock = { price: 4000, originalPrice: 5000, discount: "20% OFF", duration: "60 min", rating: 5, certified: true };
    } else if (normalized.includes("chidiyatapu")) {
        mock = { price: 4800, originalPrice: 6000, discount: "20% OFF", duration: "60 min", rating: 5, certified: true };
    }

    const price = item.price || mock.price;
    const originalPrice = Math.round(price * 1.20);
    const discount = "Save 20%";
    const duration = item.duration || mock.duration;
    const rating = item.rating || mock.rating;
    const certified = item.certified !== undefined ? item.certified : mock.certified;

    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="w-full max-w-[300px] bg-white rounded-[20px] shadow-md overflow-hidden border border-gray-100 flex flex-col group mb-6 transition-all duration-300 hover:shadow-xl">
            {/* Image Section */}
            <div className="relative w-full h-[180px] overflow-hidden">
                <Image 
                    src={item.thumbnail || "/images/cabimage2.jpg"} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Heart Button */}
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                >
                    {isFavorite ? (
                        <HeartFilled className="text-red-500 text-sm" />
                    ) : (
                        <HeartOutlined className="text-gray-400 hover:text-red-500 text-sm transition-colors" />
                    )}
                </button>

                {/* Rating Stars */}
                <div className="absolute bottom-10 left-3 z-10 flex gap-0.5">
                    {Array.from({ length: rating }).map((_, idx) => (
                        <StarFilled key={idx} className="text-yellow-400 text-xs" />
                    ))}
                </div>

                {/* Badges */}
                {certified && (
                    <div className="absolute bottom-2.5 left-3 z-10 bg-[rgba(5,35,50,0.85)] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide border border-white/10 backdrop-blur-[2px]">
                        Certified
                    </div>
                )}

                <div className="absolute bottom-2.5 right-3 z-10 bg-[rgba(255,255,255,0.9)] text-gray-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm backdrop-blur-[2px]">
                    <ClockCircleOutlined className="text-gray-600" /> {duration}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow justify-between gap-2.5 text-left">
                <div>
                    {/* Title */}
                    <h3 className="text-gray-950 font-extrabold text-[0.95rem] leading-snug line-clamp-2 h-[2.5rem] group-hover:text-[var(--primaryColor)] transition-colors duration-200" title={item.title}>
                        {item.title}
                    </h3>

                    {/* Price and Discount */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-gray-400 line-through text-[10px] font-semibold">₹{originalPrice}</span>
                            <span className="text-gray-900 font-extrabold text-base">₹{price}</span>
                        </div>
                        {discount && (
                            <span className="bg-black text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                                {discount}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mt-2 font-normal h-[2.0rem]">
                        {item.metaDescription || (item.about ? item.about.replace(/<[^>]*>/g, '').slice(0, 80) : '')}
                    </p>
                </div>

                {/* Book Now Button */}
                <Link href={item.slug} className="block mt-1">
                    <button className="w-full bg-[var(--primaryColor)] hover:bg-[#0f9cd3] text-white font-extrabold py-2.5 px-4 rounded-full flex items-center justify-between transition-all duration-300 shadow-md hover:shadow-lg shadow-blue-500/10">
                        <span className="tracking-wider text-[10px] font-black text-white">BOOK NOW</span>
                        <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[var(--primaryColor)] font-bold">
                            <ArrowRightOutlined className="text-[9px] font-black" />
                        </span>
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default function SingleActivity({ data, sortedData, parentActivity }) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [msgApi, contextHolder] = message.useMessage()

  useEffect(() => {
    setIsMobile(mobile())
  }, [])

  if (data == undefined) return <Skeleton active style={{ marginTop: '3%' }} />

  const price = data.price || 3400
  const originalPrice = Math.round(price * 1.20)
  const discount = "Save 20%"
  const duration = data.duration || "3 Hours"
  const rating = data.rating || 5
  const place = data.place || data.location || (data.slug ? data.slug.split('/')[2] : '')
  const formattedPlace = place ? place.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Andaman'

  const handleBookingSubmit = async (values) => {
    setFormLoading(true)
    const submittedAt = new Date().toISOString()
    const activityDate = values.date ? values.date.format('DD-MM-YYYY') : ''
    const mobileNo = `${values.countryCode || '+91'} ${values.mobile}`

    const enquiryPayload = {
      packageName: data.title || '',
      packageDetail: `Price: ₹${price} | Place: ${formattedPlace} | Duration: ${duration}`,
      name: values.name || '',
      mobile: mobileNo || '',
      email: values.email || '',
      adults: values.adults || '1',
      kids: values.kids || '0',
      infants: '0',
      date: activityDate || '',
      message: 'Activity Ride Booking Request',
      submittedAt: submittedAt,
      status: 'Pending',
    }

    try {
      // 1. Send Email via Brevo API
      const emailBody = {
        "sender": { "name": "Mohi Holidays", "email": "no-reply@mohiholidays.com" },
        "to": [{ "email": "infomohiholidays@gmail.com", "name": "Mohiholidays" }],
        "htmlContent": `<!DOCTYPE html> 
        <html> 
        <body>
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #007a78;">New Activity Booking Enquiry</h2>
        <hr style="border: 1px solid #eee;" />
        <p><strong>Activity Name:</strong> ${data.title}</p>
        <p><strong>Place:</strong> ${formattedPlace}</p>
        <p><strong>Name:</strong> ${values.name}</p>
        <p><strong>Email:</strong> ${values.email}</p>
        <p><strong>Mobile No:</strong> ${mobileNo}</p>
        <p><strong>Date of Activity:</strong> ${activityDate}</p>
        <p><strong>Adults:</strong> ${values.adults}</p>
        <p><strong>Children:</strong> ${values.kids}</p>
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
        </div>
        </body> </html>`,
        "subject": `Activity Enquiry: ${data.title}`,
        "replyTo": { "email": values.email, "name": values.name }
      }

      await fetch("https://api.sendinblue.com/v3/smtp/email", {
        method: 'POST',
        headers: {
          "api-key": process.env.NEXT_PUBLIC_SEND_EMAIL || '',
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(emailBody)
      })

      // 2. Save to global Firestore collection enquiry_submissions
      await db.collection('enquiry_submissions').add({
        ...enquiryPayload,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })

      // 3. Post to Google Sheets
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryPayload),
      }).catch(sheetErr => console.error('Spreadsheet save failed:', sheetErr))

      msgApi.success('Your booking request has been submitted successfully!')
      setOpen(false)
    } catch (err) {
      console.error(err)
      msgApi.error('Failed to submit booking: ' + err.message)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <div
        className='backCurve5'
        style={{ display: 'flex', justifyContent: 'center', }} id='packageContainer'>
        <div style={{ width: '90%', display: mobile() ? "block" : "flex", gap: '4%', marginTop: '3%' }}>
          <div
            style={{ width: mobile() ? '100%' : "70%", background: 'white', padding: '3%', display: 'flex', flexDirection: 'column', gap: 15 }}>
            <h1>{data.title}</h1>
            <Divider style={{ margin: "0", backgroundColor: "var(--lightGreyColor)", height: 1 }} />
            <String2Html id={'aboutIsland'} string={data.about} />
            <FAQ faqData={data.faqs} />
          </div>

          <div style={{ width: mobile() ? '100%' : '30%', background: 'white', padding: '3%', height: 'fit-content', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
            
            {/* Booking Price & Info Card */}
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8ee',
              overflow: 'hidden',
              width: '100%',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'var(--primaryColor)',
                padding: '1.5rem',
                color: '#fff',
                position: 'relative',
                borderRadius: '24px 24px 0 0'
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.85, marginBottom: '0.25rem', color: 'rgba(255,255,255,0.85)' }}>Starting from</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  {originalPrice && <span style={{ textDecoration: 'line-through', fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>₹{originalPrice}</span>}
                  <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{price}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>/person</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '0.25rem', color: 'rgba(255,255,255,0.85)' }}>(inclusive 5% GST)</div>
                
                {discount && (
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: '#fff',
                    color: 'var(--primaryColor)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 800
                  }}>
                    {discount}
                  </div>
                )}
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 500, color: '#333' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <strong style={{ fontWeight: 700 }}>Rating:</strong>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: rating }).map((_, idx) => (
                        <StarFilled key={idx} style={{ color: '#fcb415', fontSize: '0.85rem' }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong style={{ fontWeight: 700 }}>Duration:</strong> {duration}
                  </div>
                  <div>
                    <strong style={{ fontWeight: 700 }}>Place:</strong> {formattedPlace}
                  </div>
                </div>

                <button
                  onClick={() => setOpen(true)}
                  style={{
                    width: '100%',
                    background: 'var(--primaryColor)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '0.9rem',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(12, 139, 189, 0.25)',
                    transition: 'all 0.3s'
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>

            <Divider style={{ backgroundColor: "var(--lightGreyColor)", height: 1, marginBottom: '1.5rem' }} />
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 800 }}>Visit Other Activities of {parentActivity}</h2>
            {sortedData.map((item, i) => (
              <div
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-duration="2000"
                key={i}>
                <OtherActivityCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Your Ride Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={isMobile ? '95%' : '650px'}
        styles={{ body: { padding: 0 } }}
        centered
      >
        <div style={{ background: 'var(--primaryColor)', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: '8px', position: 'relative' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>Book Your Ride</h2>
          
          <Form
            layout="vertical"
            onFinish={handleBookingSubmit}
            initialValues={{
              countryCode: '+91',
              adults: 1,
              kids: 0
            }}
          >
            {/* Services You're going to book */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                <span style={{ color: 'red' }}>*</span> Services You're going to book:
              </label>
              <Form.Item name="serviceName" initialValue={data.title} style={{ margin: 0 }}>
                <Input size="large" readOnly style={{ background: '#fff', border: 'none', borderRadius: '8px', color: '#333' }} />
              </Form.Item>
            </div>

            {/* Row 1: Name and Email */}
            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row', marginBottom: '1.2rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'red' }}>*</span> Name:
                </label>
                <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true, message: 'Please enter your name' }]}>
                  <Input size="large" placeholder="Enter Your Name" style={{ borderRadius: '8px', border: 'none' }} />
                </Form.Item>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'red' }}>*</span> Email:
                </label>
                <Form.Item name="email" style={{ margin: 0 }} rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                  <Input size="large" placeholder="Enter Your Email" style={{ borderRadius: '8px', border: 'none' }} />
                </Form.Item>
              </div>
            </div>

            {/* Row 2: Mobile No and Date of Activity */}
            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row', marginBottom: '1.2rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'red' }}>*</span> Mobile No.
                </label>
                <Form.Item style={{ margin: 0 }} required>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <Form.Item name="countryCode" noStyle initialValue="+91">
                      <Select size="large" style={{ width: '95px' }} dropdownStyle={{ zIndex: 10000 }}>
                        <Select.Option value="+91">+91 IN</Select.Option>
                        <Select.Option value="+1">+1 US</Select.Option>
                        <Select.Option value="+44">+44 UK</Select.Option>
                        <Select.Option value="+971">+971 AE</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="mobile" noStyle rules={[{ required: true, message: 'Please enter mobile number' }]}>
                      <Input size="large" placeholder="Enter Your Mobile No." style={{ flex: 1, borderRadius: '8px', border: 'none' }} />
                    </Form.Item>
                  </div>
                </Form.Item>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'red' }}>*</span> Date of Activity
                </label>
                <Form.Item name="date" style={{ margin: 0 }} rules={[{ required: true, message: 'Please select date' }]}>
                  <DatePicker size="large" style={{ width: '100%', borderRadius: '8px', border: 'none' }} format="DD-MM-YYYY" placeholder="Select Date" />
                </Form.Item>
              </div>
            </div>

            {/* Row 3: Adults and Childs */}
            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row', marginBottom: '1.8rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'red' }}>*</span> Adults (&gt;12 years)
                </label>
                <Form.Item name="adults" style={{ margin: 0 }} rules={[{ required: true, message: 'Required' }]}>
                  <Input size="large" type="number" placeholder="Enter Adult number" min={1} style={{ borderRadius: '8px', border: 'none', width: '100%' }} />
                </Form.Item>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                  Childs (3-12 years)
                </label>
                <Form.Item name="kids" style={{ margin: 0 }}>
                  <Input size="large" type="number" placeholder="Enter Child number" min={0} style={{ borderRadius: '8px', border: 'none', width: '100%' }} />
                </Form.Item>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="primary"
              htmlType="submit"
              loading={formLoading}
              style={{
                width: '100%',
                background: '#fff',
                color: 'var(--primaryColor)',
                border: 'none',
                borderRadius: '50px',
                height: '50px',
                fontSize: '1.1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
              }}
            >
              Submit Enquiry
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  )
}
