import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pageTitleStyled } from "@/styles";
import { getImgUrl } from "@/util/files";
import { formatDistanceStrict } from "date-fns";
import { createAuctionsAction } from "./actions";
import { getAuctionsForItem } from "@/db/controller/auctions";
import { getAuctionItems } from "@/db/controller/auctionItems";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { isBidOver } from "@/util/utils";
import BidForm from "./bid-form";
import ItemInfo from "./item-info";


function formatTimestamp(timestamp: Date){
    return formatDistanceStrict(timestamp, new Date(), { addSuffix: true })
}

export default async function BidItemPage({ params: { itemId }} : { params: { itemId: string }} ) {
    const item = await getAuctionItems(parseInt(itemId));
    const session = await auth();

    if(!item){
        return (
            <div className="space-y-8 flex flex-col items-center mt-12">
                <Image 
                    src="/emptyData.svg"
                    width="200"
                    height="200"
                    alt="NoData"
                />
                <h1 className={pageTitleStyled}>Item not found</h1>
                <p className="text-center">
                    This item does not exist.<br/> Please go back and search for a different item.
                </p>
                <Button asChild>
                    <Link href={'/'}>View Auctions</Link>
                </Button>
            </div>
        );
    }
    const canPlaceBids = session && item.userId !== session.user.id && !isBidOver(item);
    const auctionDetails = await getAuctionsForItem(item.id);
    const hasBids = auctionDetails.length > 0;

    return (
        <main className="container mx-auto py-12 space-y-8">
            <div className="flex gap-8">
                <div className="flex flex-col gap-6">
                    {
                        isBidOver(item) && (
                            <Badge className="w-fit" variant="destructive">Bidding Over</Badge>
                        )
                    }
                    <Image 
                        src={getImgUrl(item.fileKey)}
                        alt={item.name}
                        width={600}
                        height={600}
                    />
                </div>
                <div className="space-y-4 flex-1">
                    <ItemInfo item={item} />
                    <BidForm item={item} canPlaceBids={canPlaceBids} createAuctionsAction={createAuctionsAction} />
                </div>
            </div>
        </main>
    );
}
