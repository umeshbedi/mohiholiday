import { DeleteFilled, PlusOutlined } from '@ant-design/icons'
import { Upload, Image, message } from 'antd'
import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import { db } from '@/firebase'

export default function ImageUpload({ to, groupId, packageId, packageFor }) {
    const [imageObj, setImageObj] = useState(null)
    const [images, setImages] = useState([])
    const [messageApi, contextHolder] = message.useMessage()
    const packagedb = db.collection(`${packageFor}`).doc(`${groupId}`).collection("singlePackage").doc(`${packageId}`)


    async function deleteImage({ id, deletehash, image }) {
        if(confirm("Are you sure to delete this image?")==false)return;
        
        messageApi.open({ key: 'updatable', type: 'loading', content: 'Loading...', duration: 0 })
        const res = await fetch('/api/deleteImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_id: deletehash }),
        });

        await res.json().then((data) => {
            if (data.error) {
                messageApi.error(data.error);
            } else {

                if (to == "Images") {
                    packagedb.update({
                        images: firebase.firestore.FieldValue.arrayRemove(image)
                    })
                        .then(() => messageApi.success('Image deleted successfully'))
                } else {
                    packagedb.update({
                        thumbnail: ""
                    })
                        .then(() => messageApi.success('Image deleted successfully'))
                }

            }
        }
        ).catch((error) => {
            console.error('Error deleting image:', error);
            msg.error('Failed to delete image');
        });
        // console.log('Delete result:', data);
        messageApi.destroy()
    }

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



    useEffect(() => {
        async function uploadImage() {
            if (imageObj != null) {
                messageApi.open({ key: 'updatable', type: 'loading', content: 'Loading...', duration: 0 })
                var formdata = new FormData();
                formdata.append("file", imageObj);
                formdata.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Replace with your preset
                formdata.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                };

                await fetch("https://api.cloudinary.com/v1_1/" + process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + "/image/upload", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.asset_id != "") {
                            const data = { link: result.secure_url, deletehash: result.public_id, id: result.asset_id, width: result.width, height: result.height }

                            if (to == "Images") {
                                packagedb.update({
                                    images: firebase.firestore.FieldValue.arrayUnion(data)
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
                                    thumbnail: data
                                }).then(() => messageApi.open({ key: 'updatable', type: 'success', content: 'Uploaded' }))
                            }


                        } else {
                            messageApi.error(result.data.error)
                            console.log(result)
                        }
                        // console.log(result)
                        messageApi.destroy()
                        setImageObj(null)
                    })
                    .catch(error => {
                        console.log('error', error);
                        messageApi.error("Something went wrong")
                        setImageObj(null)
                    }
                    );
            }
        }

        uploadImage();

    }, [imageObj])

    function UploadedImage({ image, onDelete }) {
        return (
            <div style={{ position: 'relative', width: 90, height: 90, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                <Image src={image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <button
                    onClick={onDelete}
                    title="Remove"
                    style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        padding: 0,
                    }}
                >
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
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
                <div style={{
                    width: 90, height: 90,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', borderRadius: 12,
                    border: '2px dashed #15aee8',
                    background: 'rgba(21,174,232,0.05)',
                    transition: 'background 0.2s, border-color 0.2s',
                    flexDirection: 'column', gap: 4,
                }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(21,174,232,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(21,174,232,0.05)'}
                >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#15aee8" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span style={{ fontSize: '0.7rem', color: '#15aee8', fontWeight: 600 }}>Upload</span>
                    <span style={{ fontSize: '0.8rem', color: '#8c8c8c', fontWeight: 500 }}>{to === 'Photos' ? 'Upload Photo' : 'Upload'}</span>
                </div>
            </Upload>
        )
    }

    return (
        <div style={{ marginBottom: 8 }}>
            {contextHolder}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                {images.map((image, index) => (
                    <UploadedImage
                        key={index}
                        image={image.link}
                        onDelete={() => deleteImage({ id: image.id, deletehash: image.deletehash, image: image })}
                    />
                ))}
                {(to !== 'Images' || images.length < 1) && <UploadButton />}
            </div>
        </div>
    )
}
