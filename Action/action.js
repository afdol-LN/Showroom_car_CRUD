'use server'

import { createClient } from "@/lib/supabase/server.js"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import LandingPage from "@/app/home/page"
export const handleSignUp = async (fromData) => {
    console.log("Start signup")
    const formemail = fromData.get("email")
    const formpassword = fromData.get("password")
    const formname = fromData.get("name")
    const formlastname = fromData.get("lastname")
    const formtell = fromData.get("tell")

    // console.log(formData)
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email: formemail,
        password: formpassword,
        option: {
            data: {
                name: formname,
                lastname: formlastname
            }
        }
    })


    if (error) {
        console.log(error)
        return false
    }
    if (data) {
        const { data: insertdata, error: inserterror } = await supabase.from('users')
            .insert({
                name: formname + " " + formlastname,
                tell: formtell,
                email: formemail
            })
        console.log('insert user data complete')
        console.log("insertdata", insertdata)
        console.log(data)
        redirect('/home')

    }
    console.log("signup is complete")
    // alert('Sign UP Complete')


}

export const handleSignIn = async (fromData) => {
    const supabase = await createClient();
    const email = fromData.get("email")
    const password = fromData.get("password")
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })



    if (error) {
        console.log(error)
        return false
    }
    if (data) {

        // const { data : selectData, error : selectError } = await supabase.from('users')
        // .select('*')
        // .eq('email', data.user.email)
        // .single()
        // console.log('select user data complete')
        // console.log(selectData)
       

        console.log("data : ", data)
        // console.log("profile : ", profile)
        
        redirect('/home')

    }
    console.log("signi n is complete")
    

}

export const handleSignOut = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        return false
    }
    console.log('Sign out complete')
    redirect('/')

}

