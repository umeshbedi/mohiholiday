"use client"
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox, Button, Row, Col, DatePicker } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

export default function QuotePopup() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Show popup after a short delay on load
        const timer = setTimeout(() => {
            setIsModalOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Allow any component (e.g. RequestCallbackButton in layout) to open this popup
        const handler = () => setIsModalOpen(true);
        window.addEventListener('open-quote-popup', handler);
        return () => window.removeEventListener('open-quote-popup', handler);
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        setIsModalOpen(false);
    };

    return (
        <Modal
            title={null}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            centered
            width={860}
            styles={{
                body: { padding: 0, borderRadius: 12 },
                content: { padding: 0, borderRadius: 12 },
            }}
        >
            <div className="flex flex-col md:flex-row min-h-[520px] max-h-[90vh] md:max-h-none bg-white">

                {/* ── Left: Image panel ── */}
                <div className="relative w-full md:w-[42%] shrink-0 min-h-[400px] md:min-h-[520px] h-[400px] md:h-auto">
                    <Image
                        src="/images/Contact Form Image.jpg"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        alt="Travel to Andaman"
                    />
                    {/* subtle dark gradient at the bottom so text stays readable if added later */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)'
                    }} />
                </div>

                {/* ── Right: Form panel ── */}
                <div className="flex-1 p-6 md:p-[28px_28px_24px] bg-white">
                    <div style={{ marginBottom: 20 }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2c3e50', marginBottom: 8, marginTop: 4 }}>
                            Get Free Quote
                        </h2>
                        <p style={{ color: '#7f8c8d', fontSize: '13px', lineHeight: '1.6', textAlign: 'left' }}>
                            Please fill in your details below and our team will get back to you shortly to discuss your travel requirements and preferences.
                        </p>
                    </div>

                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        
                    >
                        <Form.Item
                            label={<span style={{ color: '#34495e', fontWeight: 500 }}>Name</span>}
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                            style={{ marginBottom: 14 }}
                        >
                            <Input placeholder="Enter your name" size="large" />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ color: '#34495e', fontWeight: 500 }}>Mobile Number</span>}
                            name="mobile"
                            rules={[{ required: true, message: 'Please input your mobile number!' }]}
                            style={{ marginBottom: 14 }}
                        >
                            <Input placeholder="Enter your mobile number" size="large" />
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ color: '#34495e', fontWeight: 500 }}>Travel Date</span>}
                                    name="travelDate"
                                    style={{ marginBottom: 14 }}
                                >
                                    <DatePicker size="large" placeholder="Select Date" style={{ width: '100%' }} format="DD MMM YYYY" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ color: '#34495e', fontWeight: 500 }}>Travelers</span>}
                                    name="travelers"
                                    style={{ marginBottom: 14 }}
                                    initialValue="1"
                                    rules={[{ required: true, message: 'Required' }]}
                                >
                                    <Input type="number" min={1} placeholder="No. of travelers" size="large" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={<span style={{ color: '#34495e', fontWeight: 500 }}>Services you want</span>}
                            name="services"
                            style={{ marginBottom: 14 }}
                            rules={[{ required: true, message: 'Please select a service!' }]}
                        >
                            <Select size="large" placeholder="Select a service" style={{ width: '100%' }}>
                                <Select.Option value="Package">Package</Select.Option>
                                <Select.Option value="Water Sports">Water Sports</Select.Option>
                                <Select.Option value="Cruise Tickets">Cruise Tickets</Select.Option>
                                <Select.Option value="Cabs">Cabs</Select.Option>
                                <Select.Option value="Boat Tickets">Boat Tickets</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')) }]}
                            style={{ marginBottom: 18 }}
                        >
                            <Checkbox>
                                <span style={{ color: '#7f8c8d', fontSize: 12 }}>
                                    I agree to the{' '}
                                    <Link href="/terms-and-conditions" style={{ color: 'var(--primaryColor)', textDecoration: 'underline' }}>Terms &amp; Conditions</Link>
                                    {' '}and{' '}
                                    <Link href="/privacy-policy" style={{ color: 'var(--primaryColor)', textDecoration: 'underline' }}>Privacy Policy</Link>
                                </span>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{
                                    width: '100%',
                                    backgroundColor: 'var(--primaryColor)',
                                    borderColor: 'var(--primaryColor)',
                                    height: '45px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                }}
                            >
                                Get Free Quote
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}