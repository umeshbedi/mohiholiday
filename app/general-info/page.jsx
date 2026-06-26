import React from 'react'
import { db } from '@/firebase'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const HeadImage = dynamic(() => import("@/components/master/HeadImage"))
const Menu = dynamic(() => import("@/components/master/header"))

export default async function GeneralInfoPage() {
    // Fetch general info items from Firestore
    const res = await db.collection("generalInfo").get()
    const items = res.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))

    // Use header image of the first item as a fallback or a default scenic path
    const headerImage = items.length > 0 ? items[0].headerImage : "https://images.unsplash.com/photo-1589979482837-e74f2e145060"

    return (
        <main className="bg-slate-50 min-h-screen">
            <div>
                <Menu />
                <HeadImage image={headerImage} title="General Information" isHalf/>

                <div className="py-16 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto text-center mb-12">
                        <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
                            Essential travel tips, guides, and important information for planning your Andaman holiday.
                        </p>
                        <div className="w-20 h-1 bg-[var(--primaryColor)] mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto justify-items-center">
                        {items.map((item) => (
                            <Link key={item.id} href={item.slug}>
                                <div id="cardImage" className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 flex flex-col h-[360px] w-[250px] mx-auto group">
                                    <div className="relative w-full h-[200px] overflow-hidden bg-slate-100">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow justify-between">
                                        <div>
                                            <h2 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-[var(--primaryColor)] transition-colors duration-200 line-clamp-2 leading-snug">
                                                {item.title}
                                            </h2>
                                            <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                                                {item.metaDescription || "Click to read more details."}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold text-[var(--primaryColor)] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200 mt-4">
                                            Read Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
