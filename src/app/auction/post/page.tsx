
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { postAuctionAction } from "./actions";

export default async function CreateAuctionPage() {

  return (
    <main className="container mx-auto py-12 space-y-8">
      <h1 className="text-4xl font-bold">
        Post An Item For Auction 
      </h1>
      <form className="flex flex-col border p-8 rounded-xl space-y-4 max-w-lg" action={postAuctionAction}>
        <Input required className="max-w-md" name="name" placeholder="Name Item For Auction" />
        <Input required className="max-w-md" name="startingPrice" placeholder="Starting Bid Price" type="number" step="0.01"/>
        <Button className="self-end" type="submit">Post Item</Button>
      </form>
    </main>
  );
}
