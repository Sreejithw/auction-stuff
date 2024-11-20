'use server'
import { auth } from '@/auth';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { getSignedUrlForS3Object } from '@/lib/s3';
import { redirect } from 'next/navigation'

export async function createUploadUrlAction(key: string, type: string){
    return await getSignedUrlForS3Object(key, type);
}


export async function postAuctionAction({
        fileName,
        name,
        type,
        location,
        model,
        description,
        startingPrice,
        endDate,
        specs
    }:{ fileName: string, name: string, type:string ,location:string, model:string, description:string, startingPrice: number, endDate: Date | undefined, specs:string }) 
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
        location,
        type,
        model,
        description,
        startingPrice,
        currentBid: startingPrice,
        fileKey: fileName,
        userId: user.id,
        specs,
        endDate
    });

    redirect("/");
}