import React from 'react'
import { db } from '@/firebase'
import { Card, Image, Skeleton } from 'antd'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { boxShadow, mobile } from '@/components/utils/variables'
import { notFound } from 'next/navigation'


const HeadImage = dynamic(() => import("@/components/master/HeadImage"))
const Menu = dynamic(() => import("@/components/master/header"))

export default async function IslandName({ params }) {
    const { islandName } = await params

    const res = await db.collection("island").where("slug", "==", `/island/${islandName}`).get()
    const entry = res.docs.map((entry) => {
        return ({ id: entry.id, ...entry.data() })
    });
    const data = entry[0]

    if (entry.length == 0) return notFound()

    return (
        <main>
            <div>
                <Menu />
                <HeadImage image={data.headerImage} />

                <div
                    className='backCurve3'
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3%', gap: 30 }}>
                    <h1 style={{ textAlign: 'center', padding: "0 10px" }}>Places to Visit in {data.name}</h1>
                    <div style={{ display: mobile() ? "block" : 'grid', gridTemplateColumns: "repeat(4, auto)", gridGap: '3%', width: mobile() ? "auto" : '90%', justifyContent: 'center', }}>
                        {data.data.map((item, i) => {
                            var newUrl = "";
                            const splitedUrl = item.thumbnail.split(".");

                            if (splitedUrl == "imgur") {
                                splitedUrl[2] = splitedUrl[2] + "m";
                                newUrl = splitedUrl.join('.')
                            } else {
                                newUrl = item.thumbnail
                            }

                            return (
                                <Link
                                    data-aos="fade-up"
                                    data-aos-anchor-placement="top-bottom"
                                    data-aos-duration="2000"
                                    target='blank' key={i} href={item.slug}>
                                    <div id='cardImage' style={{ borderRadius: 20, background: 'white', display: 'flex', flexDirection: 'column', textAlign: 'center', boxShadow: boxShadow, width: 250, height: 340, overflow: 'hidden', marginBottom: mobile() ? 30 : "auto" }}>
                                        <Image
                                            src={newUrl}
                                            alt={item.name}
                                            preview={false}
                                            width={250} height={250}
                                            placeholder={
                                                <Image
                                                    preview={false}
                                                    src="/images/Loading_icon.gif"
                                                    width={250}
                                                    height={250}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            }
                                            style={{ objectFit: 'cover', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <h2 style={{ padding: '5%' }}>{item.name}</h2>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </main>
    )
}


// export const getStaticProps = async (context) => {
//     const { islandName } = context.params;
//     // console.log(packageGroupName)
//     const res = await db.collection("island").where("slug", "==", `/island/${islandName}`).get()
//     const entry = res.docs.map((entry) => {
//         return ({ id: entry.id, ...entry.data() })
//     });

//     if (entry.length == 0) {
//         return {
//             notFound: true
//         };
//     }

//     return {
//         props: {
//             data: entry[0]
//         },
//         revalidate: 60,

//     }

// }