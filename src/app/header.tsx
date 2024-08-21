import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import { SignOut } from "@/components/sign-out";
import Image from "next/image";
import Link from "next/link";

export async function Header() {
    const session = await auth();
    return (
        <div className="bg-gray-200 py-4">
            <div className="container flex justify-between">
                 <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-1">
                        <Image src="/logoMain.png" width="150" height="150" alt="Logo"/>
                    </Link>
                    <div>
                        <Link href="/auction/post" className="flex items-center gap-1">
                            Auction Item
                        </Link>
                    </div>
                 </div>
                <div className="flex items-center gap-4">
                    <div>
                        { session?.user?.name}
                    </div>
                    <div>
                        { session ? <SignOut /> : <SignIn /> }
                    </div>
                </div>
            </div>
        </div>
    )
}