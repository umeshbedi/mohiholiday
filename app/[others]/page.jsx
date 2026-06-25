import React from 'react'
import OtherPage from './OtherPage'
import { db } from '@/firebase'
import { notFound } from 'next/navigation'


export default async function Others({ params, searchParams }) {
    const { others } = await params
    const resPages = await db.collection('pages').doc(`${others}`).get()
    const page = resPages.data();
    console.log(others)
    if (!page) {
        notFound()
    }
    return <OtherPage data={page}/>
}
