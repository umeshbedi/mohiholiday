"use client"
import React from 'react'

const ferryLogos = [
    {
        name: 'Makruzz',
        logo: 'https://info.makruzz.com/wp-content/uploads/2025/08/logo-750.webp',
    },
    {
        name: 'Nautika',
        logo: 'https://wip.gonautika.com/assets/t-25/logo.png',
    },
    {
        name: 'ITT Majestic',
        logo: "https://www.ittmajestic.com/assets/images/icon/logoGreen.png",
    },
    {
        name: 'Grean Ocean',
        logo: "https://tickets.greenoceanseaways.com/assets/img/Green-Ocean-New-Logo.png",
    }
]

export default function FerryPartners() {
    return (
        <section
            className="py-14 sm:py-20 px-5 sm:px-15 text-center relative"
            style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e8f4fd 40%, #fef9f0 100%)',
                backgroundImage: `url(https://img.magnific.com/free-vector/layered-papercut-background-topographic-map_107791-34498.jpg)`,
                backgroundBlendMode: 'normal',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}

        >
            
            <div className=' h-full w-full absolute bottom-0 left-0 bg-[rgba(255,255,255,0.8)] z-1' />
            

            {/* Heading */}
            <h2 className="relative text-2xl sm:text-3xl font-extrabold mb-10 z-10">
                Many ferries, Mohi Holidays is the Solution for it
            </h2>


            {/* Logo Row */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16">
                {ferryLogos.map((ferry, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center h-16 min-w-[90px]"
                    >
                        {ferry.logo ? (
                            <img
                                src={ferry.logo}
                                alt={ferry.name}
                                className="min-h-14 sm:h-20 w-auto object-contain grayscale-[15%] hover:grayscale-0 hover:scale-105 transition-all duration-300 ease-in-out"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                }}
                            />
                        ) : null}
                        <span
                            className="hidden items-center justify-center text-base font-bold text-gray-700 border-b-2 border-red-500 pb-1 hover:text-red-500 transition-colors duration-200"
                            style={{ display: ferry.logo ? 'none' : 'flex' }}
                        >
                            {ferry.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}
