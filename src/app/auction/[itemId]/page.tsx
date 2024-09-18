import { Button } from "@/components/ui/button";
import { pageTitleStyled } from "@/styles";
import { formatAndConvertCurrency } from "@/util/currency";
import { getImgUrl } from "@/util/files";
import { formatDistanceStrict } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { createAuctionsAction } from "./actions";
import { getAuctionsForItem } from "@/controller/auctions";
import { getAuctionItems } from "@/controller/auctionItems";
import { auth } from "@/auth";


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

    const allBids = await getAuctionsForItem(item.id);

    const hasBids = allBids.length > 0;


    return (
        <main className="container mx-auto py-12 space-y-8">
            <div className="flex gap-8">
                <div className="flex flex-col gap-6">
                    <h1 className={pageTitleStyled}><span className="font-normal">Auction for</span> {item.name}</h1>
                    <Image 
                        src={getImgUrl(item.fileKey)}
                        alt={item.name}
                        width={400}
                        height={400}
                    />
                    <div className="text-xl space-y-4">
                        <div>
                            Current Bid at <span className="font-bold text-red-600">${formatAndConvertCurrency(item.currentBid)}</span>
                        </div>
                        <div>
                            Starting price at <span className="font-bold">${formatAndConvertCurrency(item.startingPrice)}</span>
                        </div>
                        <div>Bid Interval <span className="font-bold">${formatAndConvertCurrency(item.auctionInterval)}</span></div>
                    </div>
                </div>
                <div className="space-y-4 flex-1">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold">Current Bids</h2>
                        { session && (
                            <form action={createAuctionsAction.bind(null, item.id)}>
                                <Button>Place your Bid</Button>
                            </form>
                        )}
                    </div>
                    {
                        hasBids ? (
                            <ul className="space-y-4">
                                { 
                                    allBids.map((bid) => (
                                            <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
                                                <div className="flex gap-4">
                                                    <div>
                                                        <span className="font-bold">${formatAndConvertCurrency(bid.amount)}</span> by{" "}
                                                        <span className="font-bold">{bid.user.name}</span>
                                                    </div>
                                                    <div className="">{formatTimestamp(bid.timestamp)}</div>
                                                </div>
                                            </li>
                                    ))
                                }
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center gap-8 bg-gray-100 rounded-xl p-12">
                                <Image src="/emptyData.svg" width="200" height="200" alt="NoBids" />
                                <h2 className="text-2xl">No Bids yet</h2>
                                { session && (
                                    <form action={createAuctionsAction.bind(null,item.id)}>
                                        <Button>Place your Bid</Button>
                                    </form>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
        </main>
    );
}
