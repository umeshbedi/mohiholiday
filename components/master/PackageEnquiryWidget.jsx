"use client"
import { Button, Checkbox, DatePicker, Form, Input, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { FaBed, FaCheckCircle } from 'react-icons/fa'
import { db } from '@/firebase'
import firebase from 'firebase/compat/app'
import { useAuth } from './AuthContext'

const { RangePicker } = DatePicker
const { Option } = Select

const countryCodeSelector = (
    <Form.Item name="countryCode" noStyle initialValue="+91">
        <Select style={{ width: 95 }}>
            <Option value="+91">+91 IN</Option>
            <Option value="+1">+1 US</Option>
            <Option value="+44">+44 UK</Option>
            <Option value="+61">+61 AU</Option>
        </Select>
    </Form.Item>
)

export default function PackageEnquiryWidget({ packageName, packageDetail, price, originalPrice, hotelName }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [dateRange, setDateRange] = useState([null, null])
    const [loading, setLoading] = useState(false)
    const [msg, showMsg] = Modal.useModal()
    const { currentUser } = useAuth()
    const [form] = Form.useForm()

    const discountPct = originalPrice && price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 30

    async function sendEmail(values) {
        const fullMobile = `${values.countryCode || '+91'} ${values.mobile}`
        const dateStr = dateRange[0] && dateRange[1]
            ? `${dateRange[0]} → ${dateRange[1]}`
            : 'Not specified'

        const emailBody = {
            sender: { name: 'Mohi Holidays', email: 'no-reply@mohiholidays.com' },
            to: [{ email: 'infomohiholidays@gmail.com', name: 'Mohiholidays' }],
            subject: 'New Package Enquiry from Mohiholidays.com',
            htmlContent: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head><body>
<p><i>Package Enquiry for:</i></p>
<h2>${packageName}</h2>
<h3>${packageDetail || ''}</h3>
<hr/>
<p>Name: <strong>${values.name}</strong></p>
<p>Email: <strong>${values.email}</strong></p>
<p>Mobile: <strong>${fullMobile}</strong></p>
<p>Adults: <strong>${values.adults || 0}</strong></p>
<p>Children (5-12 yrs): <strong>${values.children || 0}</strong></p>
<p>Infants (0-5 yrs): <strong>${values.infants || 0}</strong></p>
<p>Travel Dates: <strong>${dateStr}</strong></p>
</body></html>`,
            replyTo: { email: 'no-reply@mohiholidays.com', name: 'Mohiholidays' },
            tags: ['package', 'enquiry'],
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
                adults: values.adults || '',
                children: values.children || '',
                infants: values.infants || '',
                date: dateStr,
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
                content: 'Your enquiry has been received. Our representative will contact you soon. Happy Journey!',
            })
            form.resetFields()
            setModalOpen(false)
        } catch (err) {
            console.error(err)
            msg.error({ title: 'Error', content: 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    function onSubmit(values) {
        if (!values.agreeTerms) {
            msg.error({ title: 'Attention!', content: 'Please agree to the Package Terms and Conditions.' })
            return
        }
        sendEmail(values)
    }

    return (
        <>
            {showMsg}

            {/* ── PRICE + DATE RANGE CARD ── */}
            <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', width: '100%', marginTop:'2rem' }}>

                {/* Price banner */}
                {price && (
                    <div style={{
                        background: 'var(--primaryColor)',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>Starting from</p>
                            {originalPrice && (
                                <p style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: 2 }}>
                                    ₹{Number(originalPrice).toLocaleString('en-IN')}
                                </p>
                            )}
                            <p style={{ fontWeight: 900, fontSize: '1.7rem', color: '#fff', lineHeight: 1.1 }}>
                                ₹ {Number(price).toLocaleString('en-IN')}
                                <span style={{ fontWeight: 400, fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}> /person</span>
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>(inclusive 5% GST)</p>
                        </div>
                        <div style={{
                            background: '#fff',
                            color: 'var(--primaryColor)',
                            borderRadius: 20,
                            padding: '6px 14px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            marginTop: 4,
                        }}>
                            Save {discountPct}%
                        </div>
                    </div>
                )}

                <div style={{ padding: '16px 20px' }}>
                    {/* Hotel list */}
                    {hotelName && hotelName.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaBed /> Include Hotel
                            </p>
                            {hotelName.map((h, i) => (
                                <p key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: '0.9rem' }}>
                                    <FaCheckCircle style={{ color: 'var(--primaryColor)', flexShrink: 0 }} /> {h}
                                </p>
                            ))}
                        </div>
                    )}

                    <div style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
                        <p style={{ fontWeight: 500, marginBottom: 8, fontSize: '0.95rem' }}>Select Date Range:</p>
                        <RangePicker
                            size="large"
                            style={{ width: '100%', marginBottom: 16 }}
                            format="DD-MM-YYYY"
                            onChange={(_, dateStrings) => setDateRange(dateStrings)}
                        />
                        <Button
                            size="large"
                            style={{
                                width: '100%',
                                background: 'var(--primaryColor)',
                                border: 'none',
                                borderRadius: 50,
                                fontWeight: 700,
                                fontSize: '1rem',
                                color: '#fff',
                                height: 50,
                            }}
                            onClick={() => setModalOpen(true)}
                        >
                            Enquire Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── BOOK YOUR PACKAGE MODAL ── */}
            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={540}
                styles={{ body: { background: 'var(--primaryColor)', borderRadius: 12, padding: '28px 24px' } }}
            >
                <h2 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: 20, color: '#fff' }}>Book Your Package</h2>

                <Form form={form} onFinish={onSubmit} layout="vertical">
                    {/* Package name — pre-filled */}
                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: '#fff' }}>Package You&apos;r going to book:</span>}
                        style={{ marginBottom: 14 }}
                    >
                        <Input size="large" value={packageName} readOnly style={{ background: 'white' }} />
                    </Form.Item>

                    {/* Name */}
                    <Form.Item
                        name="name"
                        label={<span style={{ fontWeight: 600, color: '#fff' }}>Name:</span>}
                        rules={[{ required: true, message: 'Name is required' }]}
                        style={{ marginBottom: 14 }}
                    >
                        <Input size="large" placeholder="Enter Your Name" style={{ background: 'white' }} />
                    </Form.Item>

                    {/* Email — full width */}
                    <Form.Item
                        name="email"
                        label={<span style={{ fontWeight: 600, color: '#fff' }}>Email</span>}
                        rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
                        style={{ marginBottom: 14 }}
                    >
                        <Input size="large" type="email" placeholder="Enter Your Email" style={{ background: 'white' }} />
                    </Form.Item>

                    {/* Mobile + Adults — same row */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Form.Item
                            name="mobile"
                            label={<span style={{ fontWeight: 600, color: '#fff' }}>Mobile No.</span>}
                            rules={[{ required: true, message: 'Mobile is required' }]}
                            style={{ flex: 1, marginBottom: 14 }}
                        >
                            <Input size="large" addonBefore={countryCodeSelector} placeholder="Enter Your Mobile No." type="number" />
                        </Form.Item>
                        <Form.Item
                            name="adults"
                            label={<span style={{ fontWeight: 600, color: '#fff' }}>Adults (&gt;12Years)</span>}
                            rules={[{ required: true, message: 'Required' }]}
                            style={{ flex: 1, marginBottom: 14 }}
                        >
                            <Input size="large" type="number" placeholder="Enter Adults Nu..." style={{ background: 'white' }} />
                        </Form.Item>
                    </div>

                    {/* Child + Infants — same row */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Form.Item
                            name="children"
                            label={<span style={{ fontWeight: 600, color: '#fff' }}>Child (5-12years)</span>}
                            style={{ flex: 1, marginBottom: 14 }}
                        >
                            <Input size="large" type="number" placeholder="Enter Childs Nu..." style={{ background: 'white' }} />
                        </Form.Item>
                        <Form.Item
                            name="infants"
                            label={<span style={{ fontWeight: 600, color: '#fff' }}>Infant (0-5years)</span>}
                            style={{ flex: 1, marginBottom: 14 }}
                        >
                            <Input size="large" type="number" placeholder="Enter Infants Nu..." style={{ background: 'white' }} />
                        </Form.Item>
                    </div>

                    {/* Terms checkbox */}
                    <Form.Item name="agreeTerms" valuePropName="checked" style={{ marginBottom: 20 }}>
                        <Checkbox style={{ color: '#fff' }}>
                            Agree with{' '}
                            <a href="/terms" target="_blank" style={{ color: '#fff', textDecoration: 'underline' }}>
                                Package Terms and Condtions
                            </a>
                        </Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        style={{ width: '100%', background: '#fff', color: 'var(--primaryColor)', border: 'none', borderRadius: 50, fontWeight: 700, fontSize: '1rem', height: 50 }}
                    >
                        Submit
                    </Button>
                </Form>
            </Modal>
        </>
    )
}
