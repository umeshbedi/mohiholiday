import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import style from '@/styles/packageName.module.css'
import { Divider } from 'antd'
import { db } from '@/firebase'
import SHome from '@/components/skeleton/SHome'
import Tile from '@/components/master/SingleTile'

const Menu = dynamic(() => import("@/components/master/header"), { ssr: false })
const HeadImage = dynamic(() => import("@/components/master/HeadImage"), { ssr: false })


export default function Activity({ data, banner }) {

    const { query } = useRouter()
    
    if (data == undefined) return <SHome />

    return (
        <div>
            <main>


                <div>
                    <Menu />
                    <HeadImage image={banner} />

                    <div style={{ padding: "5% 3rem", width: "100%", display: 'flex', flexDirection: 'column', gap: "1rem" }}>
                        <h1>Activities in {query.activityPlace} {query.activityPlace=="Andaman"?"(India)":null}</h1>
                        {query.activityPlace == "Bali" ?
                            (<p>{`
                                Bali, the enchanting island paradise, captivates visitors with its vibrant tapestry of colors and a kaleidoscope of activities that promise an unforgettable experience. Nestled in the heart of Indonesia, this tropical gem is a visual feast for the senses.<br/><br/>

                                Vibrant and alive, Bali's natural landscapes are a breathtaking canvas of lush emerald rice terraces, azure waters lapping against pristine white-sand beaches, and the verdant jungle canopy painted in every shade of green. The island's vibrant flora and fauna add splashes of vivid color, making it a haven for nature enthusiasts.`}
                            </p>)
                            :
                            (
                                <p>{`The islands offer a kaleidoscope of experiences, from the deep emerald of the dense tropical rainforests to the translucent sapphire of the surrounding seas. Visitors can immerse themselves in the warm golden sands of Radhanagar Beach, explore the ancient mossy greens of the Baratang Caves, or witness the fiery crimson sunsets over Neil Island. The waters surrounding the islands reveal a palette of marine life, featuring coral reefs with vibrant corals, schools of fish in every shade, and the gentle blues of the majestic manta rays.`}</p>
                            )
                    }


                        <div style={{ display: "flex", justifyContent: 'center', width: "100%", marginTop: '2rem' }}>
                            <div className={style.packageRow}>
                                {data.map((item, index) => (
                                    <Tile key={index} thumbnail={item.thumbnail} name={item.name} slug={item.slug} />
                                ))}
                            </div>
                        </div>
                    </div>




                </div>
            </main>

        </div>
    )
}

export const getStaticPaths = async () => {
    const entriesAndaman = await db.collection("activityAndaman").get()
    const entriesBali = await db.collection("activityBali").get()
    const pathsAndaman = entriesAndaman.docs.map(entry => {

        return ({
            params: {
                activityPlace: entry.data().slug
            }
        })
    }
    );
    const pathsBali = entriesBali.docs.map(entry => ({
        params: {
            activityPlace: entry.data().slug
        }
    }));
    const allPaths = [...pathsAndaman, ...pathsBali]

    return {
        paths: allPaths,
        fallback: true
    }
}

export const getStaticProps = async (context) => {
    const { activityPlace } = context.params;

    const res = await db
    .collection(`${activityPlace == "Andaman" ? "activityAndaman" : "activityBali"}`)
    .orderBy("order", "asc")
    .get()
    
    // console.log(res)

    const entry = res.docs.map((entry) => {
        return ({ id: entry.id, ...entry.data() })
    });

    const bannerAndaman = (await db.doc(`pages/allPageBanner`).get()).data().ActivityAndamanPage;
    const bannerBali = (await db.doc(`pages/allPageBanner`).get()).data().ActivityBaliPage;

    if (entry.length == 0) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            data: entry,
            banner: activityPlace == "Andaman" ? bannerAndaman : bannerBali
        },
        revalidate: 60,

    }

}


