import { boolean, integer, pgTable, primaryKey, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("acs_user", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  })
   
  export const accounts = pgTable(
    "acs_account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccountType>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => ({
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    })
  )
   
  export const sessions = pgTable("acs_session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  })
   
  export const verificationTokens = pgTable(
    "acs_verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    })
  )
   
  // export const authenticators = pgTable(
  //   "acs_authenticator",
  //   {
  //     credentialID: text("credentialID").notNull().unique(),
  //     userId: text("userId")
  //       .notNull()
  //       .references(() => users.id, { onDelete: "cascade" }),
  //     providerAccountId: text("providerAccountId").notNull(),
  //     credentialPublicKey: text("credentialPublicKey").notNull(),
  //     counter: integer("counter").notNull(),
  //     credentialDeviceType: text("credentialDeviceType").notNull(),
  //     credentialBackedUp: boolean("credentialBackedUp").notNull(),
  //     transports: text("transports"),
  //   },
  //   (authenticator) => ({
  //     compositePK: primaryKey({
  //       columns: [authenticator.userId, authenticator.credentialID],
  //     }),
  //   })
  // )
  
  export const auctions = pgTable('acs_auctions',{
      id: serial("id").primaryKey(),
  });


  export const items = pgTable('acs_items',{
      id: serial("id").primaryKey(),
      userId: text("userId")
          .notNull()
          .references(() => users.id, { onDelete: "cascade" }),
      name: text("name").notNull(),
      startingPrice: integer("startingPrice").notNull().default(0),
  })