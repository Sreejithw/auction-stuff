import { database } from "@/db/database";
import { auctions } from "@/db/schema";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";

export default async function HomePage() {
  const bids = await database.query.auctions.findMany();

  return (
    <main className="container mx-auto py-12">
      <form action={async(formData: FormData) => {
        'use server'
        // const bid = formData.get('bid') as string;
        await database.insert(auctions).values({});
        revalidatePath("/");
      }}>
        <Input name="placeBid" placeholder="Place Bid" />
        <Button type="submit">Place Bid</Button>
      </form>

      {
        bids.map(bid => (
          <div key={bid.id}>{bid.id}</div>
        ))
      }
    </main>
  );
}
