import { database } from "@/db/database";
import { auctions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getAuctionsForItem(itemId: number){
    const allBids = await database.query.auctions.findMany({
        where: eq(auctions.itemId, itemId),
        orderBy: desc(auctions.id),
        with: {
            user: {
                columns: {
                    image: true,
                    name: true
                }
            }
        }
    });

    return allBids;
}