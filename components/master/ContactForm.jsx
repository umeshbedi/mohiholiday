import { DeleteFilled, PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Modal, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { mobile } from '../utils/variables'

export default function ContactForm({ packageName, packageDetail, to, data }) {
    const [date, setDate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [msg, showMsg] = Modal.useModal()

    const [passengers, setPassengers] = useState([])

    const genders = ["Male", "Female", "Other"]

    const [psName, setPsName] = useState(null)
    const [psAge, setPsAge] = useState(null)
    const [psGender, setPsGender] = useState(null)
    const [psAadhar, setPsAadhar] = useState(null)

    const [isMobile, setIsMobile] = useState(false)

    // console.log(sortedData)

    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])
    

    async function sendEmail(e) {
        const emailBody = {
            "sender": { "name": "Mohi Holidays", "email": "no-reply@mohiholidays.com" },
            "to": [{ "email": "infomohiholidays@gmail.com", "name": "Mohiholidays" }],
            "htmlContent": `<!DOCTYPE html> 
          <html> 
          <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
          <div>
          <p><i>Query for:</i></p>
          <h2>${packageName}</h2>
          <h3>${packageDetail}</h3>
          <hr/>
          <p>Name: <span style="font-weight: bold;"> ${e.name}</span></p>
          <p>Mobile: <span style="font-weight: bold;">${e.mobile}</span></p>
          <p>Email: <span style="font-weight: bold;">${e.email}</span></p>
          <p>Total Adults: <span style="font-weight: bold;">${e.adults}</span></p>
          <p>Total Infants: <span style="font-weight: bold;">${e.infants}</span></p>
          <p>Total Childs: <span style="font-weight: bold;">${e.kids}</span></p>
          <p>Date of Travel: <span style="font-weight: bold;">${date}</span></p>
          <p>Message: <span style="font-weight: bold;">${e.message}</span></p>
        
          ${to == "ferry"?
            `
            <hr/>
            <h2>Passengers' List</h2>
            <table style="border-collapse: collapse;width: 100%;">
            <tr>
            <th style="border: 1px solid #dddddd;padding: 8px;text-align: left;">Name</th>
            <th style="border: 1px solid #dddddd;padding: 8px;text-align: left;">Age</th>
            <th style="border: 1px solid #dddddd;padding: 8px;text-align: left;">Gender</th>
            <th style="border: 1px solid #dddddd;padding: 8px;text-align: left;">Aadhar Card No.</th>
            </tr>

            ${passengers.map((item, i)=>(
                `<tr>
                <td style="border: 1px solid #dddddd;padding: 8px;text-align: left;">${item.psName}</td>
                <td style="border: 1px solid #dddddd;padding: 8px;text-align: left;">${item.psAge}</td>
                <td style="border: 1px solid #dddddd;padding: 8px;text-align: left;">${item.psGender}</td>
                <td style="border: 1px solid #dddddd;padding: 8px;text-align: left;">${item.psAadhar}</td>
                </tr>
                `
            ))
            }


            </table>
            `
            :
            "<p></p>"
            }

          </div>
          </body> </html>`,

            "subject": "New Query from Mohiholidays.com",
            "replyTo": { "email": "no-reply@mohiholidays.com", "name": "Mohiholidays" },
            "tags": ["hotel", "room"]
        }
        setLoading(true)

        fetch("https://api.sendinblue.com/v3/smtp/email", {
            method: 'POST',
            headers: {
                "api-key": process.env.NEXT_PUBLIC_SEND_EMAIL,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(emailBody)
        })
            .then(res => res.json())
            .then(res => {
                msg.success({
                    title: "Query sent successfully!",
                    content: "Congratulations! Your query has been received. Our representative will contact you soon with email or phone. Happy Journey!"
                });
                setLoading(false)
            })
            .catch(err => { console.log(err); setLoading(false) })

    }

    function addPassenger() {
        if (psAge != null && psAadhar != null && psGender != null && psName != null) {
            setPassengers([...passengers, {
                psName, psAge, psGender, psAadhar
            }])
        } else { msg.info({ title: 'Attention!', content: "All fields are rquired" }) }
    }

    return (
        <div>
            {showMsg}
            <Form style={{}}
                onFinish={(e) => {
                    if (date != null) {
                        // console.log({date:date, ...e})
                        sendEmail(e)
                    } else { msg.error({ title: "Attention!", content: "All fields are required." }) }
                }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <Form.Item name={"name"} style={{ margin: 0 }} required >
                        <Input size='large' placeholder='Enter Your Name' required />
                    </Form.Item>
                    <Form.Item name={"mobile"} style={{ margin: 0 }} required >
                        <Input size='large' type='number' placeholder='Enter Mobile Number' required />
                    </Form.Item>
                    <Form.Item name={"email"} style={{ margin: 0 }} required >
                        <Input size='large' type='email' placeholder='Enter Email ID' required />
                    </Form.Item>
                    <Space>
                        <Form.Item name={"adults"} style={{ margin: 0 }} required >
                            <Input size='large' type='number' placeholder='Adults' required />
                        </Form.Item>
                        <Form.Item name={"infants"} style={{ margin: 0 }} required >
                            <Input size='large' type='number' placeholder='Infants' required />
                        </Form.Item>
                        <Form.Item name={"kids"} style={{ margin: 0 }} required >
                            <Input size='large' type='number' placeholder='Kids(>2Y)' required />
                        </Form.Item>

                    </Space>
                    <DatePicker size='large'
                        onChange={(e, d) => setDate(d)}
                        format={"DD-MM-YYYY"}

                    />

                    <Form.Item name={"message"} style={{ margin: 0 }} required >
                        <Input.TextArea rows={4} placeholder='Write Message' required />
                    </Form.Item>

                    {to == 'ferry' &&
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <h3>Add Passenger Details (including self)</h3>
                            {passengers.map((ps, i) => (
                                <p key={i}><i><b>#{i + 1}</b> {ps.psName} | {ps.psAge} | {ps.psGender} | {ps.psAadhar} </i>
                                    <DeleteFilled onClick={() => {
                                        setPassengers([
                                            ...passengers.slice(0, i),
                                            ...passengers.slice(i + 1, passengers.length)
                                        ]);
                                    }}
                                        style={{ color: 'red', cursor: 'pointer', marginLeft: 5 }} /></p>
                            ))}
                            <Space direction={isMobile?"vertical":"horizontal"}>
                                <Input placeholder='Full Name' required onChange={(e) => setPsName(e.target.value)} />
                                <Input type='number' placeholder='Age' required onChange={(e) => setPsAge(e.target.value)} />
                                <Select
                                    placeholder={"Gender"}
                                    onSelect={setPsGender}
                                    options={genders.map((item, i) => {
                                        return ({
                                            label: item,
                                            value: item
                                        })
                                    })} />
                                <Input type='number' placeholder='Aadhar Card' required onChange={(e) => setPsAadhar(e.target.value)} />

                            </Space>
                            <div>
                                <Button onClick={addPassenger} type='dashed'><PlusOutlined /> Add Passengers</Button>
                            </div>

                        </div>
                    }


                    <Button type='primary' style={{background:"var(--primaryColor)"}} htmlType='submit' size='large' loading={loading}>Send Query</Button>
                </div>
            </Form>
        </div>
    )
}
