import { db } from '@/firebase';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react'
import JoditEditor from 'jodit-react';

export default function FooterAdmin() {
    const [content, setContent] = useState("")
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    function Submit() {
        setLoading(true)
        db.collection('pages').doc('footer').set({
            about: content
        }, { merge: true }).then(() => {
            messageApi.success("Footer Updated Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
            setLoading(false)
        })
    }

    useEffect(() => {
        db.collection('pages').doc('footer').get()
            .then((snap) => {
                const data = snap.data()
                if (data !== undefined) {
                    setContent(data.about || "")
                }
            })
    }, [])

    const config = {
        cleanHTML: {
            removeEmptyNodes: false
        }
    }

    return (
        <div>
            {contextHolder}

            <h1 style={{ fontSize: '200%', marginBottom: 20 }}>Footer Settings</h1>
            <Form layout="vertical">
                <Form.Item label="Footer Rich Text Content">
                    <JoditEditor config={config} onBlur={e => setContent(e)} value={content} />
                </Form.Item>

                <Button loading={loading} onClick={Submit} type='primary' style={{ marginBottom: '5%' }}>
                    Save Footer
                </Button>
            </Form>
        </div>
    )
}
