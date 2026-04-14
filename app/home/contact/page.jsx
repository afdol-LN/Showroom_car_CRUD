'use client'

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
export default function Contact() {
    const [toggleEmail, setToggleEmail ]= useState(false);
    return (
        <div className="w-full h-auto flex flex-col justify-center items-center bg-blue-100 pt-5">
            <h1 className="text-2xl font-bold">Contact</h1>
            <iframe
                className="w-3/4 md:w-1/3 h-[300px] border-3 border-gray-400 rounded-lg"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=6.991923075779088,100.48274405302101`}>
            </iframe>
            <div className="w-full py-5 flex justify-center flex-col items-center">
                <Button onClick={()=>{setToggleEmail(!toggleEmail)}} className="py-6 px-5 text-xl hover:cursor-pointer hover:scale-105
                hover:shadow-md w-1/6">Send email!</Button>
                {toggleEmail && 
                    <div>
                        <from>
                                dsafadsfsdf
                        </from>
                    </div>
                    }
            </div>
        </div>
    )
}