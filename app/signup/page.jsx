import { handleSignUp } from "@/Action/action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Signup() {
    return (
        <Card className="flex justify-center items-center h-screen w-screen ">
            <div className="shadow-lg py-7 rounded-lg">
                <CardHeader title="Sign Up" className="py-5 text-lg w-full text-center">
                Sign Up
            </CardHeader>
            <CardContent>
                <form action={handleSignUp} className="flex flex-col gap-y-5 items-center md:w-4/5  w-3/4 mx-auto">
                    <div className="grid grid-cols-2 gap-x-4 w-full">

                        <div className="w-full">
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" placeholder="Enter your name" id="name"></Input>
                        </div>
                        <div >
                            <Label htmlFor="name">Lastname</Label>
                            <Input name="lastname" placeholder="Enter your name" id="name"></Input>
                        </div>
                    </div>
                    <div className="w-full">
                        <Label htmlFor="tell">Tell</Label>
                        <Input name="tell" placeholder="afdol@example.com" id="tell"></Input>
                    </div>
                    <div className="w-full">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" placeholder="afdol@example.com" id="email" type="email"></Input>
                    </div>
                    <div className="w-full">
                        <Label htmlFor="password">Password</Label>
                        <Input name="password" laceholder="Enter password" id="password" type="password"></Input>
                    </div>

                    <Button type="submit" className={`hover:cursor-pointer`}>Sign Up</Button>
                    <span>Already have account <a href="/" className="text-blue-600 hover:underline">Sign In</a></span>
                </form>
            </CardContent> 
            </div>
            

        </Card>
    )
}