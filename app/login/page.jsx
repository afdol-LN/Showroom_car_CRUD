import { handleSignIn } from "@/Action/action";

export default function Login(){
    return(
        <div className="flex flex-col flex-1 items-center justify-center font-sans">
              <form action={handleSignIn}> 
                
                <div className="flex flex-col gap-y-2 mb-3">
                  <label htmlFor="email" > Email </label>
                  <input name="email" placeholder="enter email" className="bg-white border border-gray-400 text-black" />
                </div>
                
                <div className="flex flex-col gap-y-2 mb-3">
                  <label htmlFor="password" > Password </label>
                  <input name="password" placeholder="enter password" type="password" className="bg-white border border-gray-400 text-black" />
                </div>
        
              </form>
              <button  type="submit" className="bg-green-500 px-5 py-3 rounded-2xl mt-5 hover:cursor-pointer ">Sign IN</button>
            </div>
    )
}