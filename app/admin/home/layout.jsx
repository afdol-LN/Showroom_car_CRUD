'use client'

import { AiOutlineShoppingCart } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { IoMdMenu } from "react-icons/io";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ProfileContext } from "@/context/ProfileContext"; // ✅ Import Context
import { useDropzone } from 'react-dropzone'
export default function RootLayout({ children }) {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [menu, setMenu] = useState(false);
    const allMenu = [{
        menu: "Home",
        link: "/home"
    }, {
        menu: "Car",
        link: "/home/Car"
    }, {
        menu: "Bucket",
        link: "/bucket"
    }, {
        menu: "Contact",
        link: "/home/contact"
    },
    {
        menu: "Logout",
        link: ""
    }]
    const fetchProfile = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/");
            return;
        }
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();
        console.log("user data : ", data);
        setProfile(data);
    };
    useEffect(() => {

        fetchProfile();
    }, []);


    const handleLogOut = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log(error);
        }
        router.push("/");
    };

    if (!profile) return <div>Loading...</div>;

    return (

        <div className="relative min-h-screen w-screen flex flex-col">
            <nav className=" top-0 sticky overflow:auto 
            flex w-full justify-between items-center py-7 px-4 h-2/10
            shadow-lg border-b bg-white z-100">
                <div className="text-xl">
                    <p>Welcome <span className="px-2 border rounded-xl border-gray-600 shadow-md">{profile.name}</span></p>
                </div>
                <div className="sm:flex hidden">
                    {allMenu.map((item, index) => (
                        
                            item.menu !== "Logout" ?
                                <a href={item.link} key={index}>
                                    <div className="px-5 py-2 hover:bg-gray-300/40 
                            hover:cursor-pointer transition-all duration-300 ease-in-out
                            rounded-xl hover:shadow ">
                                        {item.menu}
                                    </div>
                                </a>
                                : null
                        

                    )
                    )}
                </div>
                <div className="flex items-center gap-x-5 sm:text-3xl text-2xl font-semibold">
                    <IoMdMenu onClick={() => { setMenu(!menu) }} className="sm:hidden flex 
                    rounded-full hover:bg-gray-300/40 hover:cursor-pointer 
                    transition-all duration-300 ease-in-out" />
                    <AiOutlineShoppingCart className="rounded-full hover:bg-gray-300/40 hover:cursor-pointer transition-all duration-300 ease-in-out" />
                    <button onClick={handleLogOut} className="rounded-full hover:bg-gray-300/40 hover:cursor-pointer transition-all duration-300 ease-in-out">
                        <VscSignOut />
                    </button>
                </div>

            </nav>
            {menu ?
                <div className="flex flex-col  top-1/20  sticky overflow-y-auto w-full  bg-white border-b shadow-lg z-50">
                    {allMenu.map((item, index) => (
                        <div key={index} className="px-5 py-2 hover:bg-gray-300/40 hover:cursor-pointer transition-all duration-300 ease-in-out">

                            <a href={item.link}>{item.menu}</a>
                        </div>
                    ))}
                </div>
                : ''}

            {/* ✅ Wrap children ด้วย Provider เพื่อแชร์ profile */}
            <ProfileContext.Provider value={profile}>
                {children}
            </ProfileContext.Provider>
        </div>

    );
}