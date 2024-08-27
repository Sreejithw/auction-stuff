'use server'
import { auth } from '@/auth';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { getSignedUrlForS3Object } from '@/lib/s3';
import { integer } from 'drizzle-orm/pg-core';

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation'

export async function createUploadUrlAction(key: string, type: string){
    return await getSignedUrlForS3Object(key, type);
}


export async function postAuctionAction({
        fileName,
        name,
        startingPrice
    }:{ fileName: string, name: string, startingPrice: number }) 
    {

    const session = await auth();
    
    if(!session){
        throw new Error("Unauthorized");
    }
    
    const user = session.user;

    if(!user || !user.id){
        throw new Error("Unauthorized");
    }


    await database.insert(items).values({
        name,
        startingPrice,
        fileKey: fileName,
        userId: user.id
    });

    redirect("/");
}