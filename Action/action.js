'use server'

import { createClient } from "@/lib/supabase/server.js" 
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
export const handleSignUp = async (fromData) => {
        console.log("Start signup")
        const email = fromData.get("email")
        const password = fromData.get("password")
        // console.log(formData)
        const  supabase = await createClient();
         const {data, error} = await supabase.auth.signUp({
            email:email,
            password:password,
           })
        if(error){
            console.log(error)
            return false
        }
        if(data){
            console.log(data)
            redirect('/home')
             
        }
        console.log("signup is complete")
        // alert('Sign UP Complete')
        
          
}

export const handleSignIn = async (fromData) => {
    const  supabase = await createClient();
    const email = fromData.get("email")
    const password = fromData.get("password")
    const {data, error} = await supabase.auth.signInWithPassword ({
        email:email,
        password:password,
    })
    if(error){
            console.log(error)
            return false
        }
        if(data){
            console.log(data)

        }
        console.log("signi n is complete")
        

}

export const handleSignOut = async () => {
    const  supabase = await createClient();
    const {error} = await supabase.auth.signOut()
    if(error){
        console.log(error)
        return false
    }
    console.log('Sign out complete')
    redirect('/')

}