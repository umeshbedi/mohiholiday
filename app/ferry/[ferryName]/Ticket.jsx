"use client"
import React, { useState } from 'react'
import { Button, Collapse, Divider, Skeleton, Tabs, message, Modal } from 'antd'
import TicketQuery from '@/components/master/TicketQuery'

export default function Ticket({ ticketData, ticketClass, ferryName }) {

    const [msg, showMsg] = message.useMessage()
    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState({})
    const bookStyle = { flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center' }

    return (
        <div>
            {showMsg}
            <h2 style={{ marginBottom: '5%', textAlign: 'center' }}>Get Instant Ticket</h2>
            
            {ticketData.map((tk, i) => {
                const classes = ticketClass.filter(f => {
                    return f.ticketId == tk.ticketId
                })
                return (
                    <div
                        data-aos="fade-up"
                        data-aos-anchor-placement="top-bottom"
                        data-aos-duration="1000"
                        id='ticketCollapse'
                        key={i}
                    >
                        <Collapse accordion style={{ border: "none", marginBottom: '4%', background: 'white' }}>
                            <Collapse.Panel showArrow={false}
                                header={
                                    <div
                                        style={{ display: 'flex', gap: '3%' }}>
                                        <div style={{ width: '70%' }}>
                                            <p>From</p>
                                            <p style={{ color: "var(--primaryColor)" }}><b>{tk.from} {">>"} {tk.to}</b></p>
                                            <p>Dep: {tk.departure} | Arr: {tk.arrival}</p>
                                            <Divider>
                                                <p style={{ color: 'white', background: "grey", padding: '2px 10px', borderRadius: 20 }}>Distance {tk.distance}</p>
                                            </Divider>
                                        </div>

                                        <div style={{ flexDirection: 'column', display: 'flex', width: '30%' }}>
                                            <div style={{ ...bookStyle, height: '63%', }}>
                                                <p><b>Duration:</b></p>
                                                <p><b>{tk.duration}</b></p>
                                            </div>
                                            <div style={{ ...bookStyle, background: "var(--primaryColor)", height: '30%' }}>
                                                <p style={{ color: 'white', padding: 5, textAlign: 'center' }}><b>Book Here</b></p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            >
                                <div >
                                    {classes.map((cl, j) => (
                                        <div key={j} >
                                            <div style={{ display: 'flex', gap: '3%' }}>

                                                <div style={{ width: '60%' }}>
                                                    <p style={{ marginBottom: 15 }}>Class: <span style={{ fontWeight: 'bold', fontSize: '130%' }}>{cl.className}</span></p>
                                                    <p>For Kids (0-1 yrs): </p> <p>No Charges</p>
                                                </div>

                                                <div style={{ flexDirection: 'column', display: 'flex', width: '40%', alignItems: 'center' }}>
                                                    <div style={{ ...bookStyle, height: '50%', }}>
                                                        <p><b>Price:</b></p>
                                                        <p><span style={{ fontWeight: 'bold', fontSize: '130%' }}>₹ {cl.price}</span> /adult</p>
                                                    </div>
                                                    <div style={{ height: '50%', marginTop: 15 }}>
                                                        <Button
                                                            onClick={() => { setOpenModal(true); setModalData({ ...tk, ...cl, ferryName: ferryName }) }}
                                                            style={{ background: "var(--primaryColor)", color: 'white' }}>Book Now</Button>
                                                    </div>

                                                </div>
                                            </div>

                                            {j != classes.length - 1 &&
                                                <Divider />
                                            }
                                        </div>
                                    ))}
                                </div>
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                )
            })

            }

            

            <TicketQuery
                open={openModal}
                cancel={() => setOpenModal(false)}
                data={modalData}
                to={"ferry"}
            /> 
        </div>
    )
}
