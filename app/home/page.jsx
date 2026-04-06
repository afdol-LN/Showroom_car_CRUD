import { createClient } from "@/lib/supabase/client"
import { handleSignOut } from "@/Action/action"
export default async function LandingPage(){
    const supabase = createClient()
    const {data : {user}} = await supabase.auth.getUser()
    console.log(user)
    return(
        <div>
            <h1>{user?.email}</h1>
            this is home page
            <button onClick={handleSignOut} className="bg-red-800 px-5 py-3 hover:cursor-pointer">Logout </button>
        </div>
        
    )
}