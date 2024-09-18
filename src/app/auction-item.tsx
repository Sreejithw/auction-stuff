import { Button } from "@/components/ui/button";
import { Item } from "@/db/schema";
import { formatAndConvertCurrency } from "@/util/currency";
import { getImgUrl } from "@/util/files";
import Image from "next/image";
import Link from "next/link";

export function AuctionItemCard({ item } : {item: Item} ){
    return (
        <div key={item.id} className="border p-8 rounded-xl space-y-2">
            <Image
                className="object-cover h-48 w-96" 
                src={getImgUrl(item.fileKey)}
                alt={item.name}
                width={200}
                height={200}
            />
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-lg">Starting Price: ${formatAndConvertCurrency(item.startingPrice)}</p>

            <Button asChild>
                <Link href={`/auction/${item.id}`}>Place Bid On Item</Link>
            </Button>
        </div>
    )
}