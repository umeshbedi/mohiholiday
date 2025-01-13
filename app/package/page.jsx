import dynamic from 'next/dynamic'
import Image from 'next/image'
// import { useRouter } from 'next/router'


import React from 'react'
import SHeader from '@/components/skeleton/SHeader'
import SHome from '@/components/skeleton/SHome'
import { db } from '@/firebase'

import PackageData from './PackageData'
const Menu = dynamic(() => import("@/components/master/header"), { ssr: true, loading: () => <SHeader /> })
const HeadImage = dynamic(() => import("@/components/master/HeadImage"), { ssr: true, loading: () => <SHome /> })


export default async function PackageName() {

    // const { query } = useRouter()

    
    const res = await db.collection(`packageAndaman`).get()
    // console.log(res)

    const entry = res.docs.map((entry) => {
        return ({ id: entry.id, ...entry.data() })
    });
    let allData = []
    for (let i = 0; i < entry.length; i++) {
        const getData = await db.doc(`packageAndaman/${entry[i].id}`).collection("singlePackage").where("status", "==", "published").get()
        const data = getData.docs.map((d) => ({ id: d.id, ...d.data() }))
        allData.push({ parentID: entry[i].id, childData: data })
    }

    const bannerAndaman = (await db.doc(`pages/allPageBanner`).get()).data().PackageAndamanPage;

    // console.log(allData)

    return (
        <div>
            <main>
                <div>
                    <Menu />
                    <HeadImage image={bannerAndaman} title={"Packages"}/>

                    <div style={{ padding: "5% 3rem", width: "100%", display: 'flex', flexDirection: 'column', gap: "1rem", background:'var(--lightGreyColor)' }}>
                        <div>
                                <h1>The Best Curated Andaman Islands Packages</h1>
                                <p>{`Discover paradise with Mohi Holidays Leisures! Our exceptional Andaman Holiday Packages offer an unforgettable journey through the pristine islands of the Andaman archipelago. When you choose Mohi Holidays Leisures, you're choosing the very best in Andaman travel experiences. Our meticulously crafted packages provide comprehensive coverage of all that the Andaman Islands have to offer.`}</p>
                                
                            </div>
                        <PackageData data={entry} allData={allData}/>
                    </div>

                </div>
            </main>

        </div>
    )
}

// export const getStaticProps = async (context) => {
//     const { packageName } = context.params;
//     console.log(context)
//     const packagegroup = `${packageName == "Andaman" ? "packageAndaman" : packageName == "Bali" ? "packageBali" : null}`
//     const res = await db.collection(`${packagegroup}`).get()
//     // console.log(res)

//     const entry = res.docs.map((entry) => {
//         return ({ id: entry.id, ...entry.data() })
//     });
//     let allData = []
//     for (let i = 0; i < entry.length; i++) {
//         const getData = await db.doc(`${packagegroup}/${entry[i].id}`).collection("singlePackage").where("status", "==", "published").get()
//         const data = getData.docs.map((d) => ({ id: d.id, ...d.data() }))
//         allData.push({ parentID: entry[i].id, childData: data })
//     }

//     const bannerAndaman = (await db.doc(`pages/allPageBanner`).get()).data().PackageAndamanPage;
//     const bannerBali = (await db.doc(`pages/allPageBanner`).get()).data().PackageBaliPage;

//     if (entry.length == 0) {
//         return {
//             notFound: true
//         };
//     }

//     return {
//         props: {
//             data: entry,
//             allData,
//             banner: packageName == "Andaman" ? bannerAndaman : packageName == "Bali" ? bannerBali : null
//         },
//         revalidate: 60,

//     }

// }