import React, { useEffect, useState } from 'react'
import {Modal, Button} from 'antd'
import ContactForm from './ContactForm'


export default function TicketQuery({open, data, cancel, to}) {

  const [ferryDetails, setFerryDetails] = useState(null)

    useEffect(()=>{
        console.log(data)
        const details = `
        <p>Class : ${data.className}</p>
        <p>Price : ₹${data.price}</p>
        <p>From ${data.from} to ${data.to}</p>
        <p>Distance : ${data.distance}</p>
        <p>Duration : ${data.duration}</p>
        <p>Arrival : ${data.arrival}</p>
        <p>Departure : ${data.departure}</p>
        `

        setFerryDetails(details)

    },[data])


    return (
    <Modal
        open={open}
        onCancel={() => cancel()}
        footer={[]}
      >
        <div style={{ flexDirection: 'column', display: 'flex', gap: 10, padding: '2%' }}>
          <h2>Fill the form given below:</h2>
          <ContactForm to={to} data={data} packageName={data.ferryName} packageDetail={ferryDetails}/>
        </div>
      </Modal>
  )
}
