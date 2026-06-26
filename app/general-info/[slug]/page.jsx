import React from 'react'
import { db } from '@/firebase'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import String2Html from '@/components/master/String2Html'

const HeadImage = dynamic(() => import("@/components/master/HeadImage"))
const Menu = dynamic(() => import("@/components/master/header"))

export default async function GeneralInfoDetailPage({ params }) {
    const { slug } = await params

    // Fetch this general info article by slug
    const res = await db.collection("generalInfo").where("slug", "==", `/general-info/${slug}`).get()
    if (res.empty) return notFound()

    const data = { id: res.docs[0].id, ...res.docs[0].data() }

    // Fetch other general info items for the sidebar list
    const otherRes = await db.collection("generalInfo").limit(6).get()
    const otherItems = otherRes.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.id !== data.id)
        .slice(0, 5)

    return (
        <main className="bg-slate-50 min-h-screen pb-16">
            <div>
                <Menu />
                <HeadImage image={data.headerImage} title={data.title} />

                <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content Area */}
                        <div className="flex-1 min-w-0 bg-white rounded-3xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100">
                            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
                                {data.title}
                            </h1>
                            {data.metaDescription && (
                                <p className="text-slate-400 text-sm md:text-base mb-8 leading-relaxed border-b border-slate-100 pb-6 italic">
                                    {data.metaDescription}
                                </p>
                            )}
                            <div className="prose max-w-none text-slate-700 leading-relaxed text-justify contentDiv">
                                <String2Html string={data.about} id="general-info-content" />
                            </div>
                        </div>

                        {/* Sidebar Area */}
                        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
                            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                                    Other Useful Info
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {otherItems.map((item) => (
                                        <Link key={item.id} href={item.slug}>
                                            <div className="flex gap-4 items-center group cursor-pointer">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-[var(--primaryColor)] transition-colors duration-200 line-clamp-2 leading-snug">
                                                        {item.title}
                                                    </h3>
                                                    <span className="text-xs text-[var(--primaryColor)] mt-1 font-semibold">
                                                        Read &rarr;
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {otherItems.length === 0 && (
                                        <p className="text-sm text-slate-400">No other articles available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
