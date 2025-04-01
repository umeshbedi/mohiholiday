import React from 'react'
import { db } from '@/firebase'
import style from '@/styles/component.module.css'

import { Divider, Image, Skeleton } from 'antd'
import Link from 'next/link'
import { boxShadow, mobile } from '@/components/utils/variables'
import dynamic from 'next/dynamic'
import String2Html from '@/components/master/String2Html'
import { notFound } from 'next/navigation'

const HeadImage = dynamic(() => import("@/components/master/HeadImage"))
const Menu = dynamic(() => import("@/components/master/header"))


export default async function AboutIsland({ params }) {

    // { data, headerImage, islandItem, headerImgAlt }
    // console.log(islandItem)
    // const [isMobile, setIsMobile] = useState(false)

    // useEffect(() => {
    //     setIsMobile(mobile())
    // }, [isMobile])


    // if (data == undefined) return <Skeleton active style={{ marginTop: '3%' }} />
    const { islandName, aboutIsland } = await params

    const res = await db.collection("island").where("slug", "==", `/island/${islandName}`).get()
    const entry = res.docs.map((entry) => {
        return ({ id: entry.id, ...entry.data() })
    });

    if (entry.length == 0) return notFound()

    const getData = await db.doc(`island/${entry[0].id}`).get()
    const tempdata = getData.data()
    const headerImage = tempdata.headerImage
    const islandItem = tempdata.data.find((f) => f.slug == `/island/${islandName}/${aboutIsland}`)

    const data = tempdata

    return (
        <main>
            <div>
                <Menu />
                <HeadImage image={data.headerImage} />
                <div
                    className='backCurve5'
                    style={{ display: 'flex', justifyContent: 'center', }} id='packageContainer'>
                    <div style={{ width: '90%', display: mobile() ? "block" : "flex", gap: '4%', marginTop: '3%' }}>
                        <div
                            style={{ width: mobile() ? '100%' : "70%", background: 'white', padding: '3%', display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <h1>About {islandItem.name}</h1>
                            <Divider style={{ margin: "0", backgroundColor: style.lightGrey, height: 1 }} />
                            <String2Html id={'aboutIsland'} string={islandItem.about} />

                        </div>

                        <div style={{ width: mobile() ? '100%' : '30%', background: 'white', padding: '3%', height: 'fit-content', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                            <h2 style={{ textAlign: 'center' }}>Visit Other Places of {data.name}</h2>
                            <Divider style={{ backgroundColor: style.lightGrey, height: 1 }} />
                            {data.data.map((item, i) => (
                                <Link
                                    data-aos="fade-up"
                                    data-aos-anchor-placement="top-bottom"
                                    data-aos-duration="2000"
                                    key={i} target='blank' href={item.slug}>
                                    <div id='cardImage' style={{ borderRadius: 10, background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: boxShadow, width: 260, marginBottom: 30 }}>
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.name}
                                            preview={false}
                                            width={260}
                                            height={280}
                                            style={{ objectFit: 'cover', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                        <h2 style={{ padding: '5%', textAlign: 'center' }}>{item.name}</h2>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}


// export async function getStaticProps(context) {
//     const { islandName, aboutIsland } = context.params
//     const res = await db.collection("island").where("slug", "==", `/island/${islandName}`).get()
//     const entry = res.docs.map((entry) => {
//         return ({ id: entry.id, ...entry.data() })
//     });

//     if (entry.length == 0) {
//         return {
//             notFound: true
//         };
//     }

//     const getData = await db.doc(`island/${entry[0].id}`).get()
//     const data = getData.data()
//     const headerImage = data.headerImage
//     const islandItem = data.data.find((f) => f.slug == `/island/${islandName}/${aboutIsland}`)

//     if (data.length == 0) {
//         return {
//             notFound: true
//         };
//     }

//     return {
//         props: {
//             data: data.data,
//             headerImage, islandItem,
//             headerImgAlt: data.name
//         },
//         revalidate: 10,
//     }
// }