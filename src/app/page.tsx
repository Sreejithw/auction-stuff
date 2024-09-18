import { database } from "@/db/database";
import { auth } from "@/auth";
import { AuctionItemCard } from "./auction-item";

export default async function HomePage() {

  const session = await auth();

  const itemsList = await database.query.items.findMany();
  // if (!session) return null;

  // const user = session.user;

  // if(!user) return null;

  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-bold"> Items For Sale </h1>
      <div className="grid grid-cols-4 gap-8">
        {
          itemsList.map(item => (
            <AuctionItemCard key={item.id} item={item} />
          ))
        }
      </div>
    </main>
  );
}
