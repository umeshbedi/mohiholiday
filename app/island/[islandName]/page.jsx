import React from 'react'
import { db } from '@/firebase'
import { Card, Image, Skeleton } from 'antd'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { boxShadow } from '@/components/utils/variables'
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
        <main className="bg-slate-50 min-h-screen">
            <div>
                <Menu />
                <HeadImage image={data.headerImage} />

                <div className="backCurve3 py-16 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight font-makaran">
                            Places to Visit in <span className="text-[var(--primaryColor)]">{data.name}</span>
                        </h1>
                        <div className="w-20 h-1 bg-[var(--primaryColor)] mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto justify-items-center">
                        {data.data.map((item, i) => {
                            let newUrl = item.thumbnail;
                            if (item.thumbnail.includes("imgur")) {
                                const parts = item.thumbnail.split(".");
                                if (parts.length > 2) {
                                    const ext = parts.pop();
                                    const path = parts.join(".");
                                    if (!path.endsWith("m")) {
                                        newUrl = `${path}m.${ext}`;
                                    }
                                }
                            }

                            return (
                                <Link
                                    data-aos="fade-up"
                                    data-aos-anchor-placement="top-bottom"
                                    data-aos-duration="2000"
                                    key={i} href={item.slug}>
                                    <div id='cardImage' className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 flex flex-col h-[340px] w-[250px] mx-auto group">
                                        <div className="relative w-full h-[240px] overflow-hidden bg-slate-100">
                                            <img
                                                src={newUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-4 flex flex-grow items-center justify-center text-center">
                                            <h2 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-[var(--primaryColor)] transition-colors duration-200 line-clamp-2 leading-snug">
                                                {item.name}
                                            </h2>
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

