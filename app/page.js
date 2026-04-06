import Image from "next/image";

import { handleSignIn, handleSignUp } from "@/Action/action.js";

export default function Home() {
  // const supabase = createClient();
  // const setNewUser = async (event) => {
  //   console.log("Start set new user");

  //   const { data, error } = await supabase
  //     .from('users')
  //     .insert([
  //       { name: 'Afdol', email: '55555@example', tell:'088723' },
  //     ])
  //     .select('*');

  //   if (data) { console.log("data : ", data); }
  //   if (error) { console.log(error); }
  // };
  

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <form action={handleSignUp}>
        <div className="flex flex-col gap-y-2 mb-3">
          <label htmlFor="name" > Name </label>
          <input name="name" placeholder="enter name" className="bg-white border border-gray-400 text-black" />
        </div>
        <div className="flex flex-col gap-y-2 mb-3">
          <label htmlFor="email" > Email </label>
          <input name="email" placeholder="enter email" className="bg-white border border-gray-400 text-black" />
        </div>
        <div className="flex flex-col gap-y-2 mb-3">
          <label htmlFor="tell" > Tell </label>
          <input name="tell" placeholder="enter tell" className="bg-white border border-gray-400 text-black" />
        </div>
        <div className="flex flex-col gap-y-2 mb-3">
          <label htmlFor="password" > Password </label>
          <input name="password" placeholder="enter password" type="password" className="bg-white border border-gray-400 text-black" />
        </div>
        <button  type="submit" className="bg-green-500 px-5 py-3 rounded-2xl mt-5 hover:cursor-pointer ">Sign UP</button>
      </form>
      
    </div>
  );
}
