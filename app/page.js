import Image from "next/image";

import { handleSignIn, handleSignUp } from "@/Action/action.js";
import { Button } from "@/components/ui/button";

export default function Home() {
  
  

  return (
    <div className="flex flex-col w-screen h-screen flex-1 items-center justify-center font-sans">
      <form action={handleSignIn} className="flex flex-col shadow-lg  
      w-1/4 h-auto justify-center items-center px-5 py-5 rounded-lg" >
        
        <div className="flex flex-col gap-y-2 mb-3">
          <label htmlFor="email" > Email </label>
          <input name="email" placeholder="enter email" className="bg-white border border-gray-400 text-black" />
        </div>
        
        <div className="flex flex-col gap-y-2 mb-3">
          <label htmlFor="password" > Password </label>
          <input name="password" placeholder="enter password" type="password" className="bg-white border border-gray-400 text-black" />
        </div>
        <Button  type="submit" className="bg-green-500 px-5 py-3 rounded-2xl mt-5 hover:cursor-pointer ">Sign in</Button>
        <span>Don't have an account? <a href="/signup" className="text-blue-600 hever:underline">Sign up</a></span>
      </form>
      
    </div>
  );
}
