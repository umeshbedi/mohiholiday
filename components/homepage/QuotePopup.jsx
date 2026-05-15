"use client"
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Radio, Checkbox, Button, Row, Col, DatePicker } from 'antd';
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

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        // Add form submission logic here
        setIsModalOpen(false);
    };

    return (
        <Modal
            title={null}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            centered
            width={500}
            styles={{ body: { padding: '10px' } }}
        >
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2c3e50', marginBottom: '10px', marginTop: 10 }}>Get Free Quote</h2>
                <p style={{ color: '#7f8c8d', fontSize: '14px', lineHeight: '1.5' }}>
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
                    style={{ marginBottom: 16 }}
                >
                    <Input placeholder="Enter your name" size="large" />
                </Form.Item>

                <Form.Item
                    label={<span style={{ color: '#34495e', fontWeight: 500 }}>Mobile Number</span>}
                    name="mobile"
                    rules={[{ required: true, message: 'Please input your mobile number!' }]}
                    style={{ marginBottom: 16 }}
                >
                    <Input placeholder="Enter your mobile number" size="large" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={<span style={{ color: '#34495e', fontWeight: 500 }}>Travel Date</span>}
                            name="travelDate"
                            style={{ marginBottom: 16 }}
                        >
                            <DatePicker size="large" placeholder="Select Date" style={{ width: '100%' }} format="DD MMM YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span style={{ color: '#34495e', fontWeight: 500 }}>Number of Travelers</span>}
                            name="travelers"
                            style={{ marginBottom: 16 }}
                            initialValue="1"
                            rules={[{ required: true, message: 'Please enter number of travelers!' }]}
                        >
                            <Input type="number" min={1} placeholder="Enter travelers" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={<span style={{ color: '#34495e', fontWeight: 500 }}>Services you want</span>}
                    name="services"
                    style={{ marginBottom: 16 }}
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
                    style={{ marginBottom: 24 }}
                >
                    <Checkbox>
                        <span style={{ color: '#7f8c8d' }}>I agree to the <Link href="/terms-and-conditions" style={{ color: '#8e44ad', textDecoration: 'underline' }}>Terms & Conditions</Link> and <Link href="/privacy-policy" style={{ color: '#8e44ad', textDecoration: 'underline' }}>Privacy Policy</Link></span>
                    </Checkbox>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" size="large" style={{ width: '100%', backgroundColor: 'var(--primaryColor)', borderColor: 'var(--primaryColor)', height: '45px', fontSize: '16px', fontWeight: 500 }}>
                        Get Free Quote
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}