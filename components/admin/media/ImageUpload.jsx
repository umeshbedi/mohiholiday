import { DeleteFilled, PlusOutlined } from '@ant-design/icons'
import { Upload, Image, message } from 'antd'
import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import { db } from '@/firebase'

export default function ImageUpload({ to, groupId, packageId, packageFor}) {
    const [imageObj, setImageObj] = useState(null)
    const [images, setImages] = useState([])
    const [messageApi, contextHolder] = message.useMessage()
    const packagedb = db.collection(`${packageFor}`).doc(`${groupId}`).collection("singlePackage").doc(`${packageId}`)

    useEffect(() => {
        packagedb.onSnapshot((snap) => {
            if (to == "Thumbnails") {
                if (snap.data().thumbnail != "") {
                    setImages([snap.data().thumbnail])
                } else {
                    setImages([])
                }
            }
            else {
                to != 'Photos' ? setImages(snap.data().images) : setImages([]);
            }

        })
    }, [])
    //


    useEffect(() => {
        if (imageObj != null) {
            messageApi.open({ key: 'updatable', type: 'loading', content: 'Loading...', duration: 0 })
            var formdata = new FormData();
            formdata.append("image", imageObj);

            var requestOptions = {
                method: 'POST',
                headers: { "Authorization": "Client-ID " + process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID + "" },
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://api.imgur.com/3/image", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        const data = result.data

                        if (to == "Images") {
                            packagedb.update({
                                images: firebase.firestore.FieldValue.arrayUnion(data.link)
                            }).then(() => messageApi.open({ key: 'updatable', type: 'success', content: 'Uploaded' }))
                        }
                        else if (to == "Photos") {
                            db.collection("media").add({
                                deletehash: data.deletehash,
                                imageID: data.id,
                                link: data.link,
                                width: data.width,
                                height: data.height,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            }).then(() => messageApi.open({ key: 'updatable', type: 'success', content: 'Uploaded' }))
                        }
                        else {
                            packagedb.update({
                                thumbnail: data.link
                            }).then(() => messageApi.open({ key: 'updatable', type: 'success', content: 'Uploaded' }))
                        }


                    } else {
                        messageApi.error(result.data.error)
                    }
                    // console.log(result.data)
                    setImageObj(null)
                })
        }

    }, [imageObj])

    function UploadedImage({ image, onDelete }) {
        return (
            <div
                style={{ height: 80, width: 80, display: 'flex', justifyContent: 'center', borderRadius: 10, border: 'solid .5px #d9d9d9' }} >
                <Image src={image} height={'100%'} />
                <div>
                    <DeleteFilled style={{ color: 'red', cursor: 'pointer', position: 'absolute' }}
                        onClick={onDelete} />

                </div>
            </div>
        )
    }

    function UploadButton() {
        return (
            <Upload
                showUploadList={false}
                accept="image/png, image/jpeg"
                onChange={({ file }) => {
                    setImageObj(file.originFileObj)

                }}
            >
                <div style={{ height: 80, width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 10, border: 'solid .5px #d9d9d9' }}>
                    <div style={{ display: "flex", alignItems: 'center', flexDirection: 'column' }}>
                        <PlusOutlined />
                        <div style={{ marginTop: 8, }}>Add Image</div>
                    </div>
                </div>

            </Upload>
        )
    }

    return (
        <div style={{ marginBottom: 20 }}>
            {contextHolder}
            <p style={{ marginBottom: 5 }}>Add {to}:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, transition: ".5s" }}>
                {images.map((image, index) => (
                    <UploadedImage
                        key={index}
                        image={image}
                        onDelete={() => {
                            if (to == "Images") {
                                packagedb.update({
                                    images: firebase.firestore.FieldValue.arrayRemove(image)
                                })
                            } else {
                                packagedb.update({
                                    thumbnail: ""
                                })
                            }
                        }}
                    />
                ))
                }
                <UploadButton />
            </div>
        </div>
    )
}
