
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { createUploadUrlAction, postAuctionAction } from "./actions";

export default function CreateAuctionPage() {

  return (
    <main className="container mx-auto py-12 space-y-8">
      <h1 className="text-4xl font-bold">
        Post An Item For Auction 
      </h1>
      <form 
            className="flex flex-col border p-8 rounded-xl space-y-4 max-w-lg" 
            onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.currentTarget as HTMLFormElement;
                    const formData = new FormData(form);
                    const file = formData.get("file") as File;
                    
                    const uploadUrl = await createUploadUrlAction(file.name, file.type);
                    
                    await fetch(uploadUrl, {
                        method:"PUT",
                        headers: {
                            "Content-Type": file.type
                        },
                        body: file
                    })
                    const name = formData.get("name") as string;
                    const startingPrice = parseInt( formData.get("startingPrice") as string );
                    const startingPriceInCents = Math.floor( startingPrice * 100 );

                    await postAuctionAction({
                        name,
                        startingPrice: startingPriceInCents,
                        fileName: file.name
                    });
                }
            }
        >
        <Input required className="max-w-md" name="name" placeholder="Name Item For Auction" />
        <Input required className="max-w-md" name="startingPrice" placeholder="Starting Bid Price" type="number" step="0.01"/>
        <Input type="file" name="file" />
        <Button className="self-end" type="submit">Post Item</Button>
      </form>
    </main>
  );
}
