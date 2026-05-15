"use client"
import React, { useState } from 'react';

const FAQCard = ({ index, question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-100 transition-all duration-300 h-fit hover:shadow-md"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4 items-start">
                    <span className="text-3xl font-black text-[#15aee8] min-w-[30px]">{index}</span>
                    <h3 className="font-semibold text-gray-700 text-[1.1rem] pt-1">{question}</h3>
                </div>
                <button className="text-[#15aee8] text-3xl font-bold flex-shrink-0 leading-none h-8 w-8 flex items-center justify-center">
                    {isOpen ? '×' : '+'}
                </button>
            </div>
            <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
            >
                <div className="overflow-hidden ml-[3.5rem]">
                    <p className="text-gray-500 text-[1rem] leading-relaxed pb-2 text-justify">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function FAQ({ 
    faqData = [], 
    title = "Frequently Asked", 
    highlight = "Questions", 
    subtitle = "Find answers to common questions about our payment process and options." 
}) {
    // Fallback data if none provided, useful for testing the UI
    const displayData = faqData.length > 0 ? faqData : [
        { question: "Are swimming skills required for shore diving in Havelock island?", answer: "While basic swimming ability is preferred, it's not mandatory. Our experienced instructors will ensure your safety throughout the dive." },
        { question: "What is the best time to book a shore dive in Havelock island?", answer: "The best time is between October and May when the sea is calm and visibility is excellent." },
        { question: "How to book shore diving in Havelock island?", answer: "You can easily book through our website or contact our support team via WhatsApp." },
        { question: "Is shore diving safe for beginners?", answer: "Yes! You will be accompanied by certified PADI professionals who will guide you every step of the way." }
    ];

    return (
        <div className="w-full bg-[#fbfbfb] py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#15aee8] mb-4">
                        {title} <span className="text-[#f37021]">{highlight}</span>
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {displayData.map((item, index) => (
                        <FAQCard 
                            key={index} 
                            index={index + 1} 
                            question={item.question} 
                            answer={item.answer} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
