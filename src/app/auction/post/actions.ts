'use server'
import { auth } from '@/auth';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { integer } from 'drizzle-orm/pg-core';

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation'

export async function postAuctionAction(formData: FormData) {

    const session = await auth();
    
    if(!session){
        throw new Error("Unauthorized");
    }
    
    const user = session.user;

    if(!user || !user.id){
        throw new Error("Unauthorized");
    }

    const startingPrice = formData.get("startingPrice") as string;
    const centPrice = Math.floor(parseFloat(startingPrice) * 100);

    await database.insert(items).values({
        name: formData.get('name') as string,
        startingPrice: centPrice,
        userId: user.id!
    });

    redirect("/");
}