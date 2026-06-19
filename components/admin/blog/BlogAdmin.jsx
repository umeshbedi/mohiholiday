"use client"
import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, Input, Modal, Switch, Tag, message, Popconfirm, Badge } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import { db } from '@/firebase'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

const blogsCol = db.collection('blogs')

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

const emptyForm = {
    title: '',
    slug: '',
    excerpt: '',
    author: '',
    coverImage: '',
    tags: '',
    content: '',
    published: false,
}

export default function BlogAdmin() {
    const [posts, setPosts] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [msgApi, contextHolder] = message.useMessage()

    // Real-time listener
    useEffect(() => {
        const unsub = blogsCol.orderBy('createdAt', 'desc').onSnapshot(snap => {
            const data = []
            snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
            setPosts(data)
        })
        return () => unsub()
    }, [])

    function openAdd() {
        setForm(emptyForm)
        setEditId(null)
        setModalOpen(true)
    }

    function openEdit(post) {
        setForm({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            author: post.author || '',
            coverImage: post.coverImage || '',
            tags: (post.tags || []).join(', '),
            content: post.content || '',
            published: post.published || false,
        })
        setEditId(post.id)
        setModalOpen(true)
    }

    function handleChange(key, value) {
        setForm(prev => {
            const next = { ...prev, [key]: value }
            if (key === 'title' && !editId) {
                next.slug = slugify(value)
            }
            return next
        })
    }

    async function handleSave() {
        if (!form.title.trim()) { msgApi.error('Title is required'); return }
        if (!form.slug.trim()) { msgApi.error('Slug is required'); return }
        setLoading(true)
        const payload = {
            title: form.title.trim(),
            slug: form.slug.trim(),
            excerpt: form.excerpt.trim(),
            author: form.author.trim(),
            coverImage: form.coverImage.trim(),
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            content: form.content,
            published: form.published,
        }
        try {
            if (editId) {
                await blogsCol.doc(editId).update(payload)
                msgApi.success('Post updated!')
            } else {
                await blogsCol.add({ ...payload, createdAt: new Date() })
                msgApi.success('Post created!')
            }
            setModalOpen(false)
        } catch (e) {
            msgApi.error(e.message)
        }
        setLoading(false)
    }

    async function handleDelete(id) {
        try {
            await blogsCol.doc(id).delete()
            msgApi.success('Post deleted')
        } catch (e) {
            msgApi.error(e.message)
        }
    }

    async function togglePublish(post) {
        try {
            await blogsCol.doc(post.id).update({ published: !post.published })
            msgApi.success(post.published ? 'Post unpublished' : 'Post published')
        } catch (e) {
            msgApi.error(e.message)
        }
    }

    return (
        <div style={{ padding: '0 0 3rem' }}>
            {contextHolder}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ margin: 0, color: '#111' }}>Blog Posts</h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>{posts.length} total posts</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} size="large"
                    style={{ background: 'var(--primaryColor)', border: 'none' }}>
                    New Post
                </Button>
            </div>

            {/* Posts list */}
            {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
                    <p style={{ fontSize: '1rem' }}>No blog posts yet. Create your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {posts.map(post => (
                        <div key={post.id} style={{
                            background: '#fff',
                            border: '1px solid #e8e8e8',
                            borderRadius: 12,
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}>
                            {/* Cover thumb */}
                            {post.coverImage ? (
                                <img src={post.coverImage} alt={post.title}
                                    style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                            ) : (
                                <div style={{
                                    width: 72, height: 52, borderRadius: 8, background: '#f0f0f0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ccc', fontSize: '1.4rem', flexShrink: 0,
                                }}>📝</div>
                            )}

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>{post.title}</span>
                                    <Badge
                                        status={post.published ? 'success' : 'default'}
                                        text={post.published ? 'Published' : 'Draft'}
                                        style={{ fontSize: '0.8rem' }}
                                    />
                                </div>
                                <p style={{ color: '#888', fontSize: '0.82rem', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {post.excerpt || <i>No excerpt</i>}
                                </p>
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                                    {(post.tags || []).map(tag => (
                                        <Tag key={tag} color="blue" style={{ fontSize: '0.72rem', lineHeight: '18px' }}>{tag}</Tag>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                <Switch
                                    size="small"
                                    checked={post.published}
                                    onChange={() => togglePublish(post)}
                                    title={post.published ? 'Unpublish' : 'Publish'}
                                />
                                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(post)} />
                                <Popconfirm
                                    title="Delete this post?"
                                    description="This action cannot be undone."
                                    onConfirm={() => handleDelete(post.id)}
                                    okText="Delete"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button size="small" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            <Modal
                open={modalOpen}
                title={editId ? 'Edit Blog Post' : 'New Blog Post'}
                onCancel={() => setModalOpen(false)}
                width={860}
                footer={[
                    <Button key="cancel" onClick={() => setModalOpen(false)}>Cancel</Button>,
                    <Button key="save" type="primary" loading={loading} onClick={handleSave}
                        style={{ background: 'var(--primaryColor)', border: 'none' }}>
                        {editId ? 'Update Post' : 'Create Post'}
                    </Button>
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '12px 0' }}>

                    <Form layout="vertical" component="div">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <Form.Item label="Title" required style={{ margin: 0 }}>
                                <Input
                                    value={form.title}
                                    onChange={e => handleChange('title', e.target.value)}
                                    placeholder="My Andaman Travel Guide"
                                />
                            </Form.Item>
                            <Form.Item label="Slug (URL)" required style={{ margin: 0 }}>
                                <Input
                                    value={form.slug}
                                    onChange={e => handleChange('slug', e.target.value)}
                                    placeholder="my-andaman-travel-guide"
                                    addonBefore="/blog/"
                                />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                            <Form.Item label="Author" style={{ margin: 0 }}>
                                <Input
                                    value={form.author}
                                    onChange={e => handleChange('author', e.target.value)}
                                    placeholder="Mohi Holidays Team"
                                />
                            </Form.Item>
                            <Form.Item label="Tags (comma separated)" style={{ margin: 0 }}>
                                <Input
                                    value={form.tags}
                                    onChange={e => handleChange('tags', e.target.value)}
                                    placeholder="Andaman, Travel, Beach"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item label="Cover Image URL" style={{ margin: '14px 0 0' }}>
                            <Input
                                value={form.coverImage}
                                onChange={e => handleChange('coverImage', e.target.value)}
                                placeholder="https://..."
                            />
                            {form.coverImage && (
                                <img src={form.coverImage} alt="cover preview"
                                    style={{ marginTop: 8, height: 100, objectFit: 'cover', borderRadius: 8, width: '100%' }}
                                    onError={e => e.target.style.display = 'none'} />
                            )}
                        </Form.Item>

                        <Form.Item label="Excerpt (short description)" style={{ margin: '14px 0 0' }}>
                            <Input.TextArea
                                rows={2}
                                value={form.excerpt}
                                onChange={e => handleChange('excerpt', e.target.value)}
                                placeholder="A brief summary of the post..."
                            />
                        </Form.Item>

                        <Form.Item label="Content" style={{ margin: '14px 0 0' }}>
                            <JoditEditor
                                value={form.content}
                                onBlur={val => handleChange('content', val)}
                            />
                        </Form.Item>

                        <Form.Item label="Published" style={{ margin: '14px 0 0' }}>
                            <Switch
                                checked={form.published}
                                onChange={val => handleChange('published', val)}
                                checkedChildren="Published"
                                unCheckedChildren="Draft"
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
