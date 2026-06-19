"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(undefined) // undefined = loading

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user) // null = signed out, object = signed in
        })
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
