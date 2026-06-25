"use client"
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { db } from '@/firebase'
import firebase from 'firebase/compat/app'
import { useAuth } from './AuthContext'

const { Option } = Select

const countryCodeSelector = (
    <Form.Item name="countryCode" noStyle initialValue="+91">
        <Select style={{ width: 100 }}>
            <Option value="+91">+91 IN</Option>
            <Option value="+1">+1 US</Option>
            <Option value="+44">+44 UK</Option>
            <Option value="+61">+61 AU</Option>
        </Select>
    </Form.Item>
)

export default function CabEnquiryForm({ packageName, packageDetail }) {
    const [date, setDate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [msg, showMsg] = Modal.useModal()
    const { currentUser } = useAuth()
    const [form] = Form.useForm()

    // step: 'form' | 'summary'
    const [step, setStep] = useState('form')
    const [summary, setSummary] = useState(null)

    async function sendEmail(values) {
        const fullMobile = `${values.countryCode || '+91'} ${values.mobile}`

        const emailBody = {
            sender: { name: 'Mohi Holidays', email: 'no-reply@mohiholidays.com' },
            to: [{ email: 'infomohiholidays@gmail.com', name: 'Mohiholidays' }],
            subject: 'New Cab Enquiry from Mohiholidays.com',
            htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<p><i>Cab Enquiry for:</i></p>
<h2>${packageName}</h2>
<h3>${packageDetail}</h3>
<hr/>
<p>Name: <strong>${values.name}</strong></p>
<p>Email: <strong>${values.email}</strong></p>
<p>Mobile: <strong>${fullMobile}</strong></p>
<p>No. of People: <strong>${values.people}</strong></p>
<p>Date &amp; Time: <strong>${date || 'Not specified'}</strong></p>
<p>Pickup Place: <strong>${values.pickupPlace}</strong></p>
<p>Drop Place: <strong>${values.dropPlace}</strong></p>
</body>
</html>`,
            replyTo: { email: 'no-reply@mohiholidays.com', name: 'Mohiholidays' },
            tags: ['cab', 'enquiry'],
        }

        setLoading(true)
        try {
            await fetch('https://api.sendinblue.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'api-key': process.env.NEXT_PUBLIC_SEND_EMAIL,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(emailBody),
            })

            const enquiryPayload = {
                packageName: packageName || '',
                packageDetail: packageDetail || '',
                name: values.name || '',
                mobile: fullMobile,
                email: values.email || '',
                people: values.people || '',
                date: date || '',
                pickupPlace: values.pickupPlace || '',
                dropPlace: values.dropPlace || '',
                userName: currentUser?.displayName || '',
                userEmail: currentUser?.email || '',
                submittedAt: new Date().toISOString(),
            }

            await Promise.allSettled([
                currentUser
                    ? db.collection('enquiries').doc(currentUser.uid).collection('items').add({
                          ...enquiryPayload,
                          status: 'Pending',
                          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      })
                    : Promise.resolve(),
                fetch('/api/enquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(enquiryPayload),
                }).catch((err) => console.error('Google Sheets append failed:', err)),
            ])

            msg.success({
                title: 'Enquiry sent successfully!',
                content:
                    'Your enquiry has been received. Our representative will contact you soon. Happy Journey!',
            })
            form.resetFields()
            setStep('form')
            setSummary(null)
            setDate(null)
        } catch (err) {
            console.error(err)
            msg.error({ title: 'Error', content: 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    // Step 1 → Step 2: validate form then show summary
    function onNext(values) {
        if (!date) {
            msg.error({ title: 'Attention!', content: 'Please select a date and time.' })
            return
        }
        setSummary({ ...values, date, fullMobile: `${values.countryCode || '+91'} ${values.mobile}` })
        setStep('summary')
    }

    // Step 2 → send enquiry
    function onBookNow() {
        sendEmail(summary)
    }

    /* ─── Summary row helper ─── */
    function SummaryRow({ label, value }) {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#888', fontSize: '0.95rem' }}>{label}</span>
                <span style={{ fontWeight: 500, fontSize: '0.95rem', textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
            </div>
        )
    }

    return (
        <div>
            {showMsg}

            {/* ── STEP 1: FORM ── */}
            {step === 'form' && (
                <Form form={form} onFinish={onNext} layout="vertical">
                    {/* Service name — pre-filled & read-only */}
                    <Form.Item label="Services You'r going to book:" style={{ marginBottom: 16 }}>
                        <Input size="large" value={packageName} readOnly />
                    </Form.Item>

                    {/* Name + Email */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
                        <Form.Item
                            name="name"
                            label="Name:"
                            rules={[{ required: true, message: "'name' is required" }]}
                            style={{ flex: 1, marginBottom: 16 }}
                        >
                            <Input size="large" placeholder="Enter Your Name" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email:"
                            rules={[{ required: true, type: 'email', message: "'email' is required" }]}
                            style={{ flex: 1, marginBottom: 16 }}
                        >
                            <Input size="large" type="email" placeholder="Enter Your Email" />
                        </Form.Item>
                    </div>

                    {/* Mobile No. — full width on its own row */}
                    <Form.Item
                        name="mobile"
                        label="Mobile No."
                        rules={[{ required: true, message: "'mobile' is required" }]}
                        style={{ marginBottom: 16 }}
                    >
                        <Input size="large" addonBefore={countryCodeSelector} placeholder="Enter Your Mobile Number" type="number" />
                    </Form.Item>

                    {/* No. of People + Date & Time */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
                        <Form.Item
                            name="people"
                            label="No. of People"
                            style={{ flex: 1, marginBottom: 16 }}
                        >
                            <Input size="large" type="number" placeholder="Enter No. of People" />
                        </Form.Item>
                        <Form.Item
                            label="Date and Time"
                            style={{ flex: 1, marginBottom: 16 }}
                            required
                        >
                            <DatePicker
                                size="large"
                                style={{ width: '100%' }}
                                showTime
                                format="DD-MM-YYYY HH:mm"
                                placeholder="Select Date & Time"
                                onChange={(_, dateStr) => setDate(dateStr)}
                            />
                        </Form.Item>
                    </div>

                    {/* Pickup + Drop */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
                        <Form.Item
                            name="pickupPlace"
                            label="Pickup Place"
                            rules={[{ required: true, message: "'pickupPlace' is required" }]}
                            style={{ flex: 1, marginBottom: 16 }}
                        >
                            <Input size="large" placeholder="Enter Pickup Place" />
                        </Form.Item>
                        <Form.Item
                            name="dropPlace"
                            label="Drop Place"
                            rules={[{ required: true, message: "'dropPlace' is required" }]}
                            style={{ flex: 1, marginBottom: 16 }}
                        >
                            <Input size="large" placeholder="Enter Drop Place" />
                        </Form.Item>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        style={{ width: '100%', background: 'var(--primaryColor)', borderRadius: 50 }}
                    >
                        Next
                    </Button>
                </Form>
            )}

            {/* ── STEP 2: BOOKING SUMMARY ── */}
            {step === 'summary' && summary && (
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Booking Summary</h3>

                    <div style={{ background: '#f7f7f7', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
                        {/* Package title row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid #e8e8e8', marginBottom: 4 }}>
                            <div style={{ width: 56, height: 56, background: '#e0e0e0', borderRadius: 8, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{packageName}</div>
                                <div style={{ color: '#888', fontSize: '0.85rem' }}>{summary.people ? `${summary.people} Person(s)` : '1 Vehicle'}</div>
                            </div>
                        </div>

                        <SummaryRow label="Date & Time" value={summary.date} />
                        <SummaryRow label="Pickup" value={summary.pickupPlace} />
                        <SummaryRow label="Dropoff" value={summary.dropPlace} />
                        <SummaryRow label="Name" value={summary.name} />
                        <SummaryRow label="Mobile" value={summary.fullMobile} />
                        <SummaryRow label="Email" value={summary.email} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#888', fontSize: '0.82rem', marginBottom: 20 }}>
                        <span>🔒</span> No hidden charges
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <Button
                            size="large"
                            style={{ flex: 1, borderRadius: 50 }}
                            onClick={() => setStep('form')}
                        >
                            Back
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            style={{ flex: 2, background: 'var(--primaryColor)', borderRadius: 50 }}
                            onClick={onBookNow}
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
