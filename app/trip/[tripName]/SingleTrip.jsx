"use client"
import React, { useState } from "react"
import { MdLocationOn } from "react-icons/md";
import Image from 'next/image'
import String2Html from "@/components/master/String2Html";
import { Button, Modal, message } from "antd";

const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.6rem',
    border: '1.5px solid #e0e0e0',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    background: '#fafafa',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
}

const emptyForm = {
    name: '', email: '', mobile: '', persons: '',
    date: '', pickup: '', message: '',
}

export default function SingleTrip({ data, index }) {
    const [open, setOpen] = useState(false)
    const [bookOpen, setBookOpen] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [submitting, setSubmitting] = useState(false)
    const [msgApi, contextHolder] = message.useMessage()

    function handleChange(key, value) {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.name.trim()) { msgApi.error('Name is required'); return }
        if (!form.mobile.trim()) { msgApi.error('WhatsApp number is required'); return }
        if (!form.date.trim()) { msgApi.error('Trip date is required'); return }

        setSubmitting(true)
        try {
            const payload = {
                packageName: data.title || '',
                packageDetail: form.pickup,
                name: form.name,
                mobile: form.mobile,
                email: form.email,
                adults: form.persons,
                kids: '',
                infants: '',
                date: form.date,
                message: form.message,
                submittedAt: new Date().toISOString(),
            }

            const res = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                msgApi.success('Enquiry submitted! We\'ll contact you shortly.')
                setForm(emptyForm)
                setTimeout(() => setBookOpen(false), 1500)
            } else {
                const err = await res.json()
                msgApi.error(err.error || 'Something went wrong. Please try again.')
            }
        } catch (err) {
            msgApi.error('Network error. Please try again.')
        }
        setSubmitting(false)
    }

    return (
        <div className='w-full p-2 '>
            {contextHolder}
            <div className='bg-slate-200 w-full h-full rounded-3xl shadow-md'>

                {/* image section */}
                <div className={`w-full h-[220px] bg-white rounded-3xl relative flex justify-center`}>
                    <Image src={data.thumbnail || "/images/cabimage2.jpg"} fill className='object-cover rounded-3xl p-2 shadow-md' />
                    <div className='bg-white p-2 flex absolute bottom-[-40px] rounded-full gap-9 items-center px-5 shadow-md'>
                        <button
                            onClick={() => setBookOpen(true)}
                            className=' bg-[var(--primaryColor)] py-2 w-full text-center text-white px-3 cursor-pointer rounded-full font-bold'>
                            Book Now
                        </button>
                        <div className='w-fit'>
                            <h2 className='text-nowrap'>₹ {data.price}</h2>
                            <p className='text-sm text-nowrap'>per person</p>
                        </div>
                    </div>
                </div>


                <div className='mt-10 p-4 flex flex-col gap-3'>
                    <h2>{data.title}</h2>
                    <div className='flex gap-2 items-center'>
                        <MdLocationOn size={25} />
                        <p className='font-bold'>{data.location}</p>
                    </div>
                    <p><span className='font-bold'>Trip Duration:</span> {data.duration} hours</p>

                    <div>
                        <p className=" line-clamp-3">{data.metaDescription || ""}</p>
                    </div>
                    {data.about.length > 272 &&
                        <Button
                            type="primary"
                            className="w-fit bg-[var(--primaryColor)]"
                            onClick={() => setOpen(true)}
                        >
                            Read More
                        </Button>
                    }


                </div>

            </div>

            {/* Read More Modal */}
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={[]}
                width={typeof window !== "undefined" && window.innerWidth >= 768 ? 1000 : "90vw"}
            >
                <div className="mt-4 overflow-y-auto">
                    <String2Html string={data.about} id={"erdf343" + data.id} />
                </div>
            </Modal>

            {/* Book Now Modal */}
            <Modal
                open={bookOpen}
                onCancel={() => setBookOpen(false)}
                footer={null}
                width={480}
                styles={{ body: { padding: '0.5rem 0.25rem 0' } }}
            >
                <div style={{ padding: '0.5rem 0.5rem 1rem' }}>
                    <h2 style={{ fontWeight: 900, fontSize: '1.45rem', color: '#111', margin: '0 0 0.25rem' }}>
                        Book Your Day Trip
                    </h2>
                    {data.title && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--primaryColor)', fontWeight: 600, margin: '0 0 0.75rem' }}>
                            {data.title}
                        </p>
                    )}
                    <p style={{ color: '#555', fontSize: '0.9rem', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                        Fill in the details and we'll get back to you as soon as possible!
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Name */}
                        <div style={{ position: 'relative' }}>
                            <input
                                style={inputStyle}
                                placeholder="Name"
                                value={form.name}
                                onChange={e => handleChange('name', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                                required
                            />
                            <span style={{ position: 'absolute', top: 10, right: 10, color: '#111', fontSize: '0.7rem', fontWeight: 700 }}>*</span>
                        </div>

                        {/* Email */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                style={inputStyle}
                                placeholder="Email"
                                value={form.email}
                                onChange={e => handleChange('email', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <span style={{ position: 'absolute', top: 10, right: 10, color: '#111', fontSize: '0.7rem', fontWeight: 700 }}>*</span>
                        </div>

                        {/* WhatsApp */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="tel"
                                style={inputStyle}
                                placeholder="Whatsapp Number"
                                value={form.mobile}
                                onChange={e => handleChange('mobile', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                                required
                            />
                            <span style={{ position: 'absolute', top: 10, right: 10, color: '#111', fontSize: '0.7rem', fontWeight: 700 }}>*</span>
                        </div>

                        {/* Number of Persons */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                min={1}
                                style={inputStyle}
                                placeholder="Number of Persons"
                                value={form.persons}
                                onChange={e => handleChange('persons', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <span style={{ position: 'absolute', top: 10, right: 10, color: '#111', fontSize: '0.7rem', fontWeight: 700 }}>*</span>
                        </div>

                        {/* Trip Date */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="date"
                                style={{ ...inputStyle, color: form.date ? '#111' : '#999' }}
                                placeholder="Trip Date"
                                value={form.date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={e => handleChange('date', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                                required
                            />
                            <span style={{ position: 'absolute', top: 10, right: 10, color: '#111', fontSize: '0.7rem', fontWeight: 700 }}>*</span>
                        </div>

                        {/* Pickup Location */}
                        <div style={{ position: 'relative' }}>
                            <input
                                style={{ ...inputStyle, borderColor: '#b2d8b2' }}
                                placeholder="Pickup Location"
                                value={form.pickup}
                                onChange={e => handleChange('pickup', e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                                onBlur={e => e.target.style.borderColor = '#b2d8b2'}
                            />
                            <span style={{ position: 'absolute', top: 10, right: 10, color: '#111', fontSize: '0.7rem', fontWeight: 700 }}>*</span>
                        </div>

                        {/* Message */}
                        <textarea
                            style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                            placeholder="Ask us anything..."
                            value={form.message}
                            onChange={e => handleChange('message', e.target.value)}
                            onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                background: submitting ? '#555' : '#111',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.6rem',
                                padding: '0.85rem',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                                transition: 'background 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                marginTop: 4,
                            }}
                            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#222' }}
                            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#111' }}
                        >
                            {submitting ? 'Submitting…' : 'Submit →'}
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}