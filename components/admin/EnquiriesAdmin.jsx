import React, { useEffect, useState } from 'react'
import { db } from '@/firebase'
import { Table, Button, Divider, Popconfirm, message, Tag, Space, Input } from 'antd'
import { DeleteOutlined, CheckCircleOutlined, SyncOutlined, SearchOutlined } from '@ant-design/icons'

export default function EnquiriesAdmin() {
    const [enquiries, setEnquiries] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [msgApi, contextHolder] = message.useMessage()

    const fetchEnquiries = () => {
        setLoading(true)
        db.collection('enquiry_submissions')
            .orderBy('submittedAt', 'desc')
            .onSnapshot(
                (snapshot) => {
                    const data = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    setEnquiries(data)
                    setLoading(false)
                },
                (error) => {
                    console.error('Error fetching enquiries:', error)
                    msgApi.error('Failed to load enquiries: ' + error.message)
                    setLoading(false)
                }
            )
    }

    useEffect(() => {
        fetchEnquiries()
    }, [])

    const deleteEnquiry = (id) => {
        db.collection('enquiry_submissions')
            .doc(id)
            .delete()
            .then(() => {
                msgApi.success('Enquiry deleted successfully!')
            })
            .catch((err) => {
                msgApi.error('Failed to delete enquiry: ' + err.message)
            })
    }

    const toggleStatus = (id, currentStatus) => {
        const nextStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved'
        db.collection('enquiry_submissions')
            .doc(id)
            .update({ status: nextStatus })
            .then(() => {
                msgApi.success(`Status updated to ${nextStatus}!`)
            })
            .catch((err) => {
                msgApi.error('Failed to update status: ' + err.message)
            })
    }

    const filteredEnquiries = enquiries.filter((item) => {
        const search = searchText.toLowerCase()
        return (
            (item.name || '').toLowerCase().includes(search) ||
            (item.email || '').toLowerCase().includes(search) ||
            (item.mobile || '').toLowerCase().includes(search) ||
            (item.packageName || '').toLowerCase().includes(search)
        )
    })

    const columns = [
        {
            title: 'Submitted At',
            dataIndex: 'submittedAt',
            key: 'submittedAt',
            render: (text) => text ? new Date(text).toLocaleString() : 'N/A',
            sorter: (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt),
        },
        {
            title: 'Service / Activity Name',
            dataIndex: 'packageName',
            key: 'packageName',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Client Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Contact Details',
            key: 'contact',
            render: (_, record) => (
                <div>
                    <div>Email: {record.email || 'N/A'}</div>
                    <div>Mobile: {record.mobile || 'N/A'}</div>
                </div>
            ),
        },
        {
            title: 'Travel Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Travelers',
            key: 'travelers',
            render: (_, record) => (
                <div>
                    <div>Adults: {record.adults || 0}</div>
                    <div>Children: {record.kids || 0}</div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Approved' ? 'green' : 'orange'}>
                    {status || 'Pending'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        size="small"
                        icon={record.status === 'Approved' ? <SyncOutlined /> : <CheckCircleOutlined />}
                        type="dashed"
                        onClick={() => toggleStatus(record.id, record.status)}
                    >
                        {record.status === 'Approved' ? 'Mark Pending' : 'Approve'}
                    </Button>
                    <Popconfirm
                        title="Delete Enquiry"
                        description="Are you sure you want to delete this enquiry?"
                        onConfirm={() => deleteEnquiry(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Enquiry Submissions</h1>
                <Input
                    placeholder="Search by Name, Email, Mobile or Service..."
                    prefix={<SearchOutlined style={{ color: '#ccc' }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: '320px' }}
                    allowClear
                />
            </div>
            <Divider style={{ margin: '15px 0' }} />
            <Table
                columns={columns}
                dataSource={filteredEnquiries}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
                bordered
            />
        </div>
    )
}
