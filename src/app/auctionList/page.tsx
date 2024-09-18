import { database } from "@/db/database";
import { auth } from "@/auth";
import { AuctionItemCard } from "../auction-item";
import { eq } from "drizzle-orm";
import { items } from "@/db/schema";
import { NoDataPage } from "./no-data";
import { pageTitleStyled } from "@/styles";

export default async function AuctionListPage() {

  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }

  const itemsList = await database.query.items.findMany({
    where: eq(items.userId, session.user.id!)
  });

  const hasBids = itemsList.length > 0;

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyled}> Your Current Bids </h1>
        {
            hasBids ? (
            <div className="grid grid-cols-4 gap-8">
                <>
                    {
                        itemsList.map(item => (
                            <AuctionItemCard key={item.id} item={item} />
                        ))
                    }
                </>
             </div>
            ) : (
                <NoDataPage />
            )
        }
    </main>
  );
}
