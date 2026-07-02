import React from 'react'
import { db } from '@/firebase'
import HeaderClient from './HeaderClient'

export default async function Header() {
    // 1. Fetch Ferries on the Server for SEO indexing
    const ferrySnap = await db.collection('ferry').get()
    const ferryList = ferrySnap.docs.map((doc) => {
        const data = doc.data()
        return {
            name: data.name || '',
            slug: data.slug || '',
            thumbnail: data.image || '',
            data: []
        }
    })

    // 2. Fetch Islands on the Server for SEO indexing
    const islandSnap = await db.collection('island').get()
    const islandList = islandSnap.docs.map((doc) => {
        const data = doc.data()
        return {
            name: data.name || '',
            slug: data.slug || '',
            thumbnail: data.thumbnail || '',
            data: []
        }
    })

    // 3. Fetch Activities on the Server for SEO indexing
    const activitySnap = await db.collection('activity').get()
    const activityList = activitySnap.docs.map((doc) => {
        return doc.data()
    })

    return (
        <HeaderClient
            initialFerries={ferryList}
            initialIslands={islandList}
            initialActivities={activityList}
        />
    )
}
