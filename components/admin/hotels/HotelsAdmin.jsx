"use client"
import React, { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Switch, Select, Checkbox, message, Popconfirm, Badge, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, StarFilled } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import { db } from '@/firebase'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

const hotelsCol = db.collection('hotels')

const LOCATIONS = [
    'Port Blair',
    'Havelock Island',
    'Neil Island',
    'Little Andamans',
    'Diglipur (Ross and Smith Islands)',
    'Butler Bay beach in Little Andaman',
    'Ross Island',
    'Baratang Island',
    'Long Island',
]

const AMENITIES = [
    { value: 'restaurant', label: '🍽️ Restaurant' },
    { value: 'wifi', label: '📶 WiFi' },
    { value: 'parking', label: '🅿️ Parking' },
    { value: 'pool', label: '🏊 Swimming Pool' },
    { value: 'bar', label: '🍸 Bar' },
    { value: 'gym', label: '🏋️ Gym' },
    { value: 'spa', label: '💆 Spa' },
    { value: 'ac', label: '❄️ Air Conditioning' },
    { value: 'roomservice', label: '🛎️ Room Service' },
    { value: 'laundry', label: '👕 Laundry' },
    { value: 'airport', label: '✈️ Airport Transfer' },
    { value: 'beach', label: '🏖️ Beach Access' },
]

const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Suite', 'Family Room', 'Deluxe', 'Cottage', 'Villa']

const BADGES = ['', 'Exclusive', 'Most Booked', 'Budget Pick', 'Luxury', 'Best Value', 'New']

function slugify(text) {
    return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

function StarRating({ rating }) {
    return (
        <span style={{ color: '#faad14', fontSize: '0.85rem' }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <StarFilled key={i} style={{ opacity: i < rating ? 1 : 0.2 }} />
            ))}
        </span>
    )
}

const emptyForm = {
    name: '', slug: '', location: '', rating: 3, badge: '',
    description: '', coverImage: '', amenities: [], roomTypes: [],
    content: '', published: false,
}

export default function HotelsAdmin() {
    const [hotels, setHotels] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [msgApi, contextHolder] = message.useMessage()

    useEffect(() => {
        const unsub = hotelsCol.onSnapshot(snap => {
            const data = []
            snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
            data.sort((a, b) => {
                const at = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0
                const bt = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0
                return bt - at
            })
            setHotels(data)
        })
        return () => unsub()
    }, [])

    function openAdd() {
        setForm(emptyForm)
        setEditId(null)
        setModalOpen(true)
    }

    function openEdit(hotel) {
        setForm({
            name: hotel.name || '',
            slug: hotel.slug || '',
            location: hotel.location || '',
            rating: hotel.rating || 3,
            badge: hotel.badge || '',
            description: hotel.description || '',
            coverImage: hotel.coverImage || '',
            amenities: hotel.amenities || [],
            roomTypes: hotel.roomTypes || [],
            content: hotel.content || '',
            published: hotel.published || false,
        })
        setEditId(hotel.id)
        setModalOpen(true)
    }

    function handleChange(key, value) {
        setForm(prev => {
            const next = { ...prev, [key]: value }
            if (key === 'name' && !editId) next.slug = slugify(value)
            return next
        })
    }

    async function handleSave() {
        if (!form.name.trim()) { msgApi.error('Hotel name is required'); return }
        if (!form.slug.trim()) { msgApi.error('Slug is required'); return }
        if (!form.location) { msgApi.error('Location is required'); return }
        setLoading(true)
        const payload = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            location: form.location,
            rating: form.rating,
            badge: form.badge,
            description: form.description.trim(),
            coverImage: form.coverImage.trim(),
            amenities: form.amenities,
            roomTypes: form.roomTypes,
            content: form.content,
            published: form.published,
        }
        try {
            if (editId) {
                await hotelsCol.doc(editId).update(payload)
                msgApi.success('Hotel updated!')
            } else {
                await hotelsCol.add({ ...payload, createdAt: new Date() })
                msgApi.success('Hotel added!')
            }
            setModalOpen(false)
        } catch (e) {
            msgApi.error(e.message)
        }
        setLoading(false)
    }

    async function handleDelete(id) {
        try {
            await hotelsCol.doc(id).delete()
            msgApi.success('Hotel deleted')
        } catch (e) {
            msgApi.error(e.message)
        }
    }

    async function togglePublish(hotel) {
        try {
            await hotelsCol.doc(hotel.id).update({ published: !hotel.published })
            msgApi.success(hotel.published ? 'Unpublished' : 'Published')
        } catch (e) {
            msgApi.error(e.message)
        }
    }

    return (
        <div style={{ padding: '0 0 3rem', width: '100%', overflow: 'hidden' }}>
            {contextHolder}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ margin: 0, color: '#111' }}>Hotels</h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>{hotels.length} total hotels</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} size="large"
                    style={{ background: 'var(--primaryColor)', border: 'none' }}>
                    Add Hotel
                </Button>
            </div>

            {/* Hotel list */}
            {hotels.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
                    <p style={{ fontSize: '1rem' }}>No hotels yet. Add your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {hotels.map(hotel => (
                        <div key={hotel.id} style={{
                            background: '#fff', border: '1px solid #e8e8e8',
                            borderRadius: 12, padding: '1rem 1.25rem',
                            display: 'flex', alignItems: 'center', gap: 16,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            maxWidth: '100%', overflow: 'hidden',
                        }}>
                            {hotel.coverImage ? (
                                <img src={hotel.coverImage} alt={hotel.name}
                                    style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                            ) : (
                                <div style={{
                                    width: 80, height: 56, borderRadius: 8, background: '#f0f0f0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.6rem', flexShrink: 0,
                                }}>🏨</div>
                            )}

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>{hotel.name}</span>
                                    {hotel.badge && <Tag color="blue" style={{ fontSize: '0.72rem' }}>{hotel.badge}</Tag>}
                                    <Badge status={hotel.published ? 'success' : 'default'}
                                        text={hotel.published ? 'Published' : 'Draft'} style={{ fontSize: '0.8rem' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                                    <span style={{ color: '#888', fontSize: '0.82rem' }}>📍 {hotel.location}</span>
                                    <StarRating rating={hotel.rating} />
                                </div>
                                {/* <p style={{ color: '#888', fontSize: '0.82rem', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {hotel.description || <i>No description</i>}
                                </p> */}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, minWidth: 110 }}>
                                <Switch size="small" checked={hotel.published} onChange={() => togglePublish(hotel)} />
                                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(hotel)} />
                                <Popconfirm title="Delete this hotel?" onConfirm={() => handleDelete(hotel.id)}
                                    okText="Delete" okButtonProps={{ danger: true }}>
                                    <Button size="small" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            <Modal open={modalOpen} title={editId ? 'Edit Hotel' : 'Add Hotel'}
                onCancel={() => setModalOpen(false)} width={900}
                footer={[
                    <Button key="cancel" onClick={() => setModalOpen(false)}>Cancel</Button>,
                    <Button key="save" type="primary" loading={loading} onClick={handleSave}
                        style={{ background: 'var(--primaryColor)', border: 'none' }}>
                        {editId ? 'Update Hotel' : 'Add Hotel'}
                    </Button>
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '12px 0' }}>
                    <Form layout="vertical" component="div">

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <Form.Item label="Hotel Name" required style={{ margin: 0 }}>
                                <Input value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Lemon Tree Hotel Port Blair" />
                            </Form.Item>
                            <Form.Item label="Slug (URL)" required style={{ margin: 0 }}>
                                <Input value={form.slug} onChange={e => handleChange('slug', e.target.value)}
                                    placeholder="lemon-tree-hotel-port-blair" addonBefore="/hotels/" />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
                            <Form.Item label="Location" required style={{ margin: 0 }}>
                                <Select value={form.location} onChange={v => handleChange('location', v)} placeholder="Select location" style={{ width: '100%' }}>
                                    {LOCATIONS.map(l => <Select.Option key={l} value={l}>{l}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Star Rating" style={{ margin: 0 }}>
                                <InputNumber min={1} max={5} value={form.rating} onChange={v => handleChange('rating', v)} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Badge (optional)" style={{ margin: 0 }}>
                                <Select value={form.badge} onChange={v => handleChange('badge', v)} style={{ width: '100%' }}>
                                    {BADGES.map(b => <Select.Option key={b} value={b}>{b || '— None —'}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item label="Cover Image URL" style={{ margin: '14px 0 0' }}>
                            <Input value={form.coverImage} onChange={e => handleChange('coverImage', e.target.value)} placeholder="https://..." />
                            {form.coverImage && (
                                <img src={form.coverImage} alt="preview"
                                    style={{ marginTop: 8, height: 100, objectFit: 'cover', borderRadius: 8, width: '100%' }}
                                    onError={e => e.target.style.display = 'none'} />
                            )}
                        </Form.Item>

                        <Form.Item label="Short Description (shown on card)" style={{ margin: '14px 0 0' }}>
                            <Input.TextArea rows={2} value={form.description}
                                onChange={e => handleChange('description', e.target.value)}
                                placeholder="A brief description of the hotel..." />
                        </Form.Item>

                        <Form.Item label="Amenities" style={{ margin: '14px 0 0' }}>
                            <Checkbox.Group value={form.amenities} onChange={v => handleChange('amenities', v)}
                                style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {AMENITIES.map(a => (
                                    <Checkbox key={a.value} value={a.value}>{a.label}</Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item label="Room Types" style={{ margin: '14px 0 0' }}>
                            <Checkbox.Group value={form.roomTypes} onChange={v => handleChange('roomTypes', v)}
                                style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {ROOM_TYPES.map(r => (
                                    <Checkbox key={r} value={r}>{r}</Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item label="Full Content (Detail Page)" style={{ margin: '14px 0 0' }}>
                            <JoditEditor value={form.content} onBlur={val => handleChange('content', val)} />
                        </Form.Item>

                        <Form.Item label="Published" style={{ margin: '14px 0 0' }}>
                            <Switch checked={form.published} onChange={v => handleChange('published', v)}
                                checkedChildren="Published" unCheckedChildren="Draft" />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
