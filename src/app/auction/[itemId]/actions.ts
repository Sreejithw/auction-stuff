'use server'

import { auth } from "@/auth";
import { database } from "@/db/database";
import { auctions, items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Knock } from "@knocklabs/node";
import { env } from "@/env";
import { isBidOver } from "@/util/utils";

export async function createAuctionsAction(itemId: number, bidAmount: number){
    const session = await auth();
    const knock = new Knock(env.KNOCK_SECRET_KEY);

    if(!session || !session.user || !session.user.id){
        throw new Error("You must be logged in to place an auction");
    }

    const item = await database.query.items.findFirst({
        where: eq(items.id, itemId),
    });

    if(!item){
        throw new Error("Item not found");
    }

    if(isBidOver(item)){
        throw new Error("This auction is over")
    }
    
    const latestBidValue = item.currentBid + item.auctionInterval;

    await database.insert(auctions).values({
        amount: bidAmount,
        itemId,
        userId: session.user.id,
        timestamp: new Date(),
    });


    await database.update(items).set({ 
        currentBid: bidAmount, 
        totalBids: (item.totalBids || 0) + 1 
    }).where(eq(items.id, itemId));

    const curentAuctions = await database.query.auctions.findMany({
        where: eq(auctions.itemId, itemId),
        with: {
            user: true
        }
    });

    const recipients: {
        id: string;
        name: string;
        email: string | null;
    }[] = [];

    for(const auction of curentAuctions){
        if(
            auction.userId !== session.user.id && 
            !recipients.find((recipient) => recipient.id === auction.userId)
        ) {
            recipients.push({
                id: auction.userId + "",
                name: auction.user.name ?? "Anonymous",
                email: auction.user.email,
            });
        }
    }

    if(recipients.length > 0){
        await knock.workflows.trigger('placed-bid', {
            actor: {
                id:session.user.id,
                name: session.user.name ?? "Anonymous",
                email: session.user.email,
                collection: "users"
            },
            recipients,
            data: {
                itemId,
                bidAmount: latestBidValue,
                itemName: item.name, 
            }
    
        });
    }

    revalidatePath(`/auctions/${itemId}`)
}