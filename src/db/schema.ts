import { pgTable, serial } from "drizzle-orm/pg-core";

export const auctions = pgTable('acs_auctions',{
    id: serial("id").primaryKey(),
})