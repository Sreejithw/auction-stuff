import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item } from "@/db/schema";
import { getImgUrl } from "@/util/files";
import { isBidOver } from "@/util/utils";
import Image from "next/image";
import Link from "next/link";

export async function AuctionItemCard({ item } : {item: Item} ){

    
    const session = await auth();

    const canPlaceBids = session && item.userId !== session.user.id && !isBidOver(item);
    return (
        <div key={item.id} className="border space-y-2">
            <Image
                className="object-cover h-48 w-full" 
                src={getImgUrl(item.fileKey)}
                alt={item.name}
                width={200}
                height={200}
            />
             <div className="p-4">
                <div className="flex justify-between">
                    <h4 className="text-xl font-bold mb-2">{item.name}</h4>
                    {
                        isBidOver(item) && (
                            <Badge className="w-fit text-xs" variant="destructive">Bidding Over</Badge>
                        )
                    }
                </div>
                <div className="space-y-2 mt-3">
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-500">Model</p>
                        <p className="text-sm">{item.model}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-sm">{item.location}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 p-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">12 Bids</p>
                    <p className="text-lg font-bold">${item.startingPrice}</p>
                </div>
                <div>
                    <Button asChild variant={isBidOver(item) ? "outline" : "default" }>
                        <Link href={`/auction/${item.id}`}>{ !canPlaceBids ? "View Bid" : "Place Bid"}</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}