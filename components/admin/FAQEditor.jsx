import React from 'react';
import { Button, Input, Card } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

export default function FAQEditor({ faqs = [], setFaqs }) {
    const addFaq = () => {
        setFaqs([...faqs, { question: '', answer: '' }]);
    };

    const removeFaq = (index) => {
        const newFaqs = [...faqs];
        newFaqs.splice(index, 1);
        setFaqs(newFaqs);
    };

    const updateFaq = (index, field, value) => {
        const newFaqs = [...faqs];
        newFaqs[index][field] = value;
        setFaqs(newFaqs);
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10 }}>Frequently Asked Questions (FAQs)</h3>
            {faqs.map((faq, index) => (
                <Card 
                    key={index} 
                    size="small" 
                    style={{ marginBottom: 10 }} 
                    extra={
                        <Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeFaq(index)} />
                    }
                >
                    <Input 
                        placeholder="Question" 
                        value={faq.question} 
                        onChange={(e) => updateFaq(index, 'question', e.target.value)} 
                        style={{ marginBottom: 10 }}
                    />
                    <Input.TextArea 
                        placeholder="Answer" 
                        value={faq.answer} 
                        rows={3}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)} 
                    />
                </Card>
            ))}
            <Button type="dashed" onClick={addFaq} block icon={<PlusOutlined />}>
                Add FAQ
            </Button>
        </div>
    );
}
