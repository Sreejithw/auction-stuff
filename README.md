This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```
auction-stuff
├─ .eslintrc.json
├─ components.json
├─ docker-compose.yml
├─ drizzle.config.ts
├─ LICENSE
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ background-1.jpg
│  ├─ emptyData.svg
│  ├─ logo.png
│  ├─ logoMain.png
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  └─ [...nextauth]
│  │  │  │     └─ route.ts
│  │  │  └─ chatclient.ts
│  │  ├─ auction
│  │  │  ├─ post
│  │  │  │  ├─ actions.ts
│  │  │  │  ├─ equipment-form.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ [itemId]
│  │  │     ├─ actions.ts
│  │  │     ├─ bid-form.tsx
│  │  │     ├─ item-info.tsx
│  │  │     └─ page.tsx
│  │  ├─ auction-item.tsx
│  │  ├─ auctionList
│  │  │  ├─ no-data.tsx
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ header.tsx
│  │  ├─ layout.tsx
│  │  ├─ notif-providers.tsx
│  │  ├─ page.tsx
│  │  └─ server
│  │     └─ auctionItems.ts
│  ├─ auth.ts
│  ├─ components
│  │  ├─ common
│  │  │  ├─ chat-bot.tsx
│  │  │  └─ countdown-timer.tsx
│  │  ├─ date-picker.tsx
│  │  ├─ sign-in.tsx
│  │  ├─ sign-out.tsx
│  │  └─ ui
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ input.tsx
│  │     ├─ popover.tsx
│  │     ├─ select.tsx
│  │     └─ textarea.tsx
│  ├─ db
│  │  ├─ controller
│  │  │  ├─ auctionItems.ts
│  │  │  └─ auctions.ts
│  │  ├─ database.ts
│  │  └─ schema.ts
│  ├─ env.ts
│  ├─ lib
│  │  ├─ s3.ts
│  │  └─ utils.ts
│  ├─ styles.ts
│  └─ util
│     ├─ files.ts
│     └─ utils.ts
├─ tailwind.config.ts
└─ tsconfig.json

```