import React, { useEffect, useState } from 'react'
import ImageUpload from './ImageUpload'
import { Button, Divider, Image, message } from 'antd'
import { db } from '@/firebase'
import { DeleteFilled } from '@ant-design/icons'

export default function Media() {

  const [media, setMedia] = useState([])
  const [msg, showMsg] = message.useMessage()

  const mediadb = db.collection('media')

  useEffect(() => {
    mediadb
      .orderBy('createdAt', 'desc')
      .limit(20)
      .onSnapshot((snap) => {
        const tempMedia = []
        snap.forEach((sndata) => {
          tempMedia.push({ id: sndata.id, ...sndata.data() })
        })
        setMedia(tempMedia)
      })
  }, [])

  function UploadedImage({ image, onDelete }) {
    return (
      <div
        style={{ height: 80, display: 'flex', justifyContent: 'center', border: 'solid .5px #d9d9d9', background: 'white' }} >
        <Image src={image} height={'100%'}
          placeholder={
            <Image
              preview={false}
              src="/images/Loading_icon.gif"
              width={80}
              height={80}
              style={{ objectFit: 'cover' }}
            />
          }
        />
        <div>
          <DeleteFilled style={{ color: 'red', cursor: 'pointer', position: 'absolute' }}
            onClick={onDelete} />

        </div>
      </div>
    )
  }


  return (
    <div>
      {showMsg}
      <h2>Media Section</h2>
      <Divider />
      <ImageUpload to={'Photos'} />
      <Divider />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, transition: ".5s" }}>
        {media.map((image, index) => {
          const splitedUrl = image.link.split(".");
          splitedUrl[2] = splitedUrl[2] + "h";
          const newUrl = splitedUrl.join('.')
          return (
            <>
              <div>

                <UploadedImage
                  key={index}
                  image={newUrl}
                  onDelete={() => {
                    mediadb.doc(`${image.id}`).delete()
                  }}
                />
                <Button block style={{ borderRadius: 0 }}
                  onClick={() => {
                    navigator.clipboard.writeText(image.link).then(()=>{
                      msg.success("Copied")
                  })
                  }}
                >Copy Link</Button>
              </div>
            </>

          )
        })
        }
      </div>

    </div>
  )
}
