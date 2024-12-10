import React, { useEffect, useState } from 'react'
import JoditEditor from 'jodit-react';
import { db } from '@/firebase';
import { Button, Divider, Select, Space, message } from 'antd';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { v4 as uuid } from 'uuid'
import firebase from 'firebase/compat/app';


const ferrydb = db.collection('ferry')

export default function AddFerryDetails({ details, ferryId }) {

    const [msg, showMsg] = message.useMessage()

    const [ticket, setTicket] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [classes, setClasses] = useState([])

    const [about, setAbout] = useState(details.about)
    const [terms, setTerms] = useState(details.termAndCondtion)
    const [metaDescription, setMetaDescription] = useState(details.metaDescription)
    const [metaTag, setMetaTag] = useState(details.metaTag)
    const [image, setImage] = useState(details.image)

    // console.log(terms)
    function updateTicket() {
        ferrydb.doc(`${ferryId}`).get().then((snap) => {
            setTicket(snap.data().ticket)
            setClasses(snap.data().classes)
            // setSelectedTicket(null)
        })
    }

    useEffect(() => {
        updateTicket()
    }, [])


    function addTicket(e) {
        e.preventDefault();
        const tg = e.target
        const uid = uuid().slice(0, 8)
        const ticket = {
            from: tg.from.value,
            to: tg.to.value,
            arrival: tg.arrival.value,
            departure: tg.departure.value,
            distance: tg.distance.value,
            duration: tg.duration.value,
            ticketId: uid
        }
        // console.log(ticket)
        ferrydb.doc(`${ferryId}`).update({
            ticket: firebase.firestore.FieldValue.arrayUnion(ticket)
        }).then(() => {
            updateTicket()
            // console.log("added")
        })

    }
    //
    function addClass(e) {
        e.preventDefault();
        const tg = e.target
        const ticketClass = {
            ticketId: selectedTicket,
            className: tg.class.value,
            price: tg.price.value
        }
        ferrydb.doc(`${ferryId}`).update({
            classes: firebase.firestore.FieldValue.arrayUnion(ticketClass)
        }).then(() => {
            updateTicket()
            // console.log("added")
        })
    }

    function deleteTicket(i) {

        const removedClass = classes.filter(f => f.ticketId != ticket[i].ticketId)
        // console.log(removedClass)
        ferrydb.doc(`${ferryId}`).update({
            classes: removedClass
        })
        const temPTicket = ticket
        temPTicket.splice(i, 1)
        ferrydb.doc(`${ferryId}`).update({
            ticket: temPTicket
        }).then(() => {
            msg.success("deleted");
            setSelectedTicket(null);
            updateTicket()
        })


    }

    function submit() {
        ferrydb.doc(`${ferryId}`).update({
            about,
            termAndCondtion: terms,
            metaDescription,
            metaTag,
            image
        })
            .then(() => msg.success("updated successfully!"))
            .catch(err => msg.error(err.message))
    }

    function Classes() {
        const result = classes.filter((f) => { return f.ticketId == selectedTicket })
        return (
            <div>
                {result.map((cl, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, color: '#25527b' }}>
                        <p> <b> #{i + 1}:</b></p>
                        <div style={{ marginBottom: 10 }}>
                            <p>Class Name: {cl.className} {" | "}
                                <span>Price: ₹{cl.price}</span>
                            </p>
                        </div>

                    </div>
                ))

                }
            </div>
        )
    }

    return (
        <div style={{ marginTop: '2%', flexDirection: 'column', display: 'flex', gap: 20 }}>
            {showMsg}
            <div>
                <Space>
                    <h3 >Header Image Url:</h3>
                    <input required defaultValue={details.image} placeholder='Enter Url' onChange={(e) => setImage(e.target.value)} />
                </Space>
            </div>
            <div>
                <h3 style={{ marginBottom: 10 }}>About {details.name}:</h3>
                <JoditEditor onBlur={e => { setAbout(e) }} value={details.about} />
            </div>
            <div>
                <h3 style={{ marginBottom: 10 }}>Terms and Conditions of {details.name}:</h3>
                <JoditEditor onBlur={e => { setTerms(e) }} value={details.termAndCondtion} />
            </div>
            <Divider />
            <div>
                <h3 style={{ marginBottom: 10 }}>Tickets:</h3>
                {ticket.map((tk, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, color: '#25527b' }}>
                        <p> <b> #{i + 1}:</b></p>
                        <div style={{ marginBottom: 10 }}>
                            <p>from {tk.from} to {tk.to} {" | "}
                                <span>dep: {tk.departure}, arrival: {tk.arrival}</span>{" | "}
                                <span>distance: {tk.distance}</span>{" | "}
                                <span>duration: {tk.duration}</span>
                                <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { deleteTicket(i) }}> <DeleteFilled /></span>
                            </p>
                        </div>

                    </div>
                ))

                }
                <form onSubmit={addTicket} style={{ flexDirection: 'column', display: 'flex', gap: 10 }}>
                    <div>
                        <Space>
                            <input required name='from' placeholder='from' />
                            <input required name='to' placeholder='to' />
                            <input required name='arrival' placeholder='arrival' />
                        </Space>
                    </div>
                    <div>
                        <Space>
                            <input required name='departure' placeholder='departure' />
                            <input required name='distance' placeholder='distance' />
                            <input required name='duration' placeholder='duration (hrs.)' />
                        </Space>
                    </div>
                    <div>
                        <Button htmlType='submit' type='dashed'><PlusOutlined /> Add Ticket</Button>
                    </div>
                </form>
            </div>

            <Divider />

            <div>
                <h3 style={{ marginBottom: 10 }}>Classes:</h3>

                <Space style={{ width: '100%', marginBottom: 15 }}>
                    <p>Select Ticket: </p>
                    <Select
                        placeholder={"select Ticket"}
                        onSelect={setSelectedTicket}
                        value={selectedTicket}
                        style={{ width: window.innerWidth - (window.innerWidth * 50 / 100) }}
                        options={ticket.map((item, i) => {
                            return ({
                                value: item.ticketId,
                                label: item.from + " >> " + item.to + " | " + item.arrival + " - " + item.departure + " | distance: " + item.distance
                            })
                        })}
                    />
                </Space>

                {selectedTicket != null &&
                    <div>
                        <Classes />
                        <form onSubmit={addClass}>
                            <Space>
                                <input required name='class' placeholder='Class Name' />
                                <input required name='price' type='number' placeholder='Price of class' />
                            </Space>
                            <Button htmlType='submit' type='dashed'><PlusOutlined /> Add Class</Button>
                        </form>
                    </div>
                }

            </div>
            <Divider>SEO Section</Divider>
            <div>
                <Space style={{ marginRight: 10 }}>
                    <p>Meta Description:</p>
                    <input required defaultValue={details.metaDescription} placeholder='Enter Meta Description' onChange={(e) => setMetaDescription(e.target.value)} />
                </Space>
                <Space>
                    <p>Meta Tag:</p>
                    <input required defaultValue={details.metaTag} placeholder='Enter Meta Tag' onChange={(e) => setMetaTag(e.target.value)} />
                </Space>
            </div>
            <div>
                <Button onClick={submit} type='primary'>Publish</Button>
            </div>

        </div>
    )
}
