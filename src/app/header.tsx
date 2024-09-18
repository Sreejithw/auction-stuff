"use client";

import { Button } from "@/components/ui/button";
import { NotificationFeedPopover, NotificationIconButton } from "@knocklabs/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);
    const session = useSession();

    return (
        <div className="bg-gray-200 py-4">
            <div className="container flex justify-between">
                 <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-1">
                        <Image src="/logoMain.png" width="150" height="150" alt="Logo"/>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-1">
                            Total Auctions
                        </Link>
                        {
                            session?.data?.user?.id && (
                            <>
                                <Link href="/auction/post" className="flex items-center gap-1">
                                    Create Bid
                                </Link>
                                <Link href="/auctionList" className="flex items-center gap-1">
                                    My Bids
                                </Link>
                            </>
                        )}
                    </div>
                 </div>
                <div className="flex items-center gap-4">
                    <NotificationIconButton
                        ref={notifButtonRef}
                        onClick={(e) => setIsVisible(!isVisible)}
                    />
                    <NotificationFeedPopover
                        buttonRef={notifButtonRef}
                        isVisible={isVisible}
                        onClose={() => setIsVisible(false)}
                    />
                    <div>
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