"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotificationCell, NotificationFeedPopover, NotificationIconButton } from "@knocklabs/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { usePathname } from 'next/navigation' 


export function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);
    const session = useSession();
    const pathname = usePathname()


    return (
        <div className="bg-[hsl(69,17%,10%)] py-4">
            <div className="container flex justify-between min-w-full">
                 <div className="flex items-center gap-[5rem]">
                    <Link href="/" className="flex items-center">
                        <Image src="/logoMain.png" width="150" height="150" alt="Logo" className="filter brightness-0 invert"/>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/" className={`flex p-4 items-center rounded-full gap-1 text-gray-300 hover:text-[hsl(81,91%,75%)] [&.active]:bg-[hsl(81,91%,75%)] [&.active]:text-[hsl(69,17%,10%)] ${pathname === '/' ? 'active' : ''}`}>
                            Total Auctions
                        </Link>
                        {
                            session?.data?.user?.id && (
                            <>
                                <Link href="/auction/post" className={`flex p-4 items-center rounded-full gap-1 text-gray-300 hover:text-[hsl(81,91%,75%)] [&.active]:bg-[hsl(81,91%,75%)] [&.active]:text-[hsl(69,17%,10%)] ${pathname === '/auction/post' ? 'active' : ''}`}>
                                    Create Auction
                                </Link>
                                <Link href="/auctionList" className={`flex p-4 items-center rounded-full gap-1 text-gray-300 hover:text-[hsl(81,91%,75%)] [&.active]:bg-[hsl(81,91%,75%)] [&.active]:text-[hsl(69,17%,10%)] ${pathname === '/auctionList' ? 'active' : ''}`}>
                                    My Auctions
                                </Link>
                            </>
                        )}
                    </div>
                 </div>
                <div className="flex items-center gap-4 text-gray-300">
                    {session.data?.user?.id && (
                        <>
                            <NotificationIconButton
                                ref={notifButtonRef}
                                onClick={(e) => setIsVisible(!isVisible)}
                            />
                            <NotificationFeedPopover
                                buttonRef={notifButtonRef}
                                isVisible={isVisible}
                                onClose={() => setIsVisible(false)}
                                renderItem={({ item, ...props}) => (
                                    <NotificationCell {...props} item={item}>
                                            <div className="rounded-xl">
                                                <Link
                                                    onClick={() => { setIsVisible(false) }}
                                                    href={`/auction/${item.data!.itemId}`}>
                                                    A Bid has been placed on your{" "}
                                                    <span className="font-bold">
                                                        {item.data!.itemName}
                                                    </span> by {" "}
                                                    <span>
                                                        ${item.data!.bidAmount}
                                                    </span>
                                                </Link>
                                            </div>
                                    </NotificationCell>
                                )}
                            />
                        </>
                    )}
                    {
                        session?.data?.user?.image && (
                            <Image 
                                src={session.data.user.image}
                                width="40"
                                height="40"
                                alt="user avatar"
                                className="rounded-full"
                            />
                        )
                    }
                    <div className="text-gray-300">
                        { session?.data?.user?.name}
                    </div>
                    <div>
                        { session.data?.user?.id ? <Button type="submit" onClick={() => { signOut({ callbackUrl: "/"}); }}>Sign Out</Button> : <Button type="submit" onClick={() => { signIn(); }}>Sign In</Button>  }
                    </div>
                </div>
            </div>
        </div>
    )
}