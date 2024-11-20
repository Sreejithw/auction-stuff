import { database } from "@/db/database";
import { auth } from "@/auth";
import { AuctionItemCard } from "./auction-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import ChatBot from "@/components/common/chat-bot";

export default async function HomePage() {

  const session = await auth();

  const itemsList = await database.query.items.findMany();
  if (!session) return null;

  const user = session.user;

  if(!user) return null;

  return (
    <main className="space-y-8">
            <div className="relative h-screen">
              <Image
                src="/background-1.jpg"
                alt="Hero background"
                layout="fill"
                objectFit="cover"
                quality={100}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" /> {/* Overlay for better text visibility */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                <h1 className="text-5xl font-bold text-center mb-4">Welcome to ConstrAuction</h1>
                <p className="text-xl text-center mb-8">
                  Where you can auction off your warehousing and construction equipment.
                </p>
                <div className="flex space-x-4">
                  <Button size="lg" className="text-black hover:bg-[hsl(80,82%,78%)]">Get Started</Button>
                </div>
              </div>
            </div>
       {/* <h1 className="text-4xl font-bold text-center mb-8">Welcome to Our Amazing Product</h1>
        
        <p className="text-xl text-center mb-12">
          Discover how our solution can transform your business and boost productivity.
        </p>
        
        <div className="flex justify-center mb-16">
          <Button size="lg" className="mr-4">Get Started</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Feature 1</CardTitle>
              <CardDescription>Boost your productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our innovative tools help you get more done in less time.</p>
            </CardContent>
            <CardFooter>
              <Button variant="link">Read more</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature 2</CardTitle>
              <CardDescription>Streamline your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Simplify complex processes with our intuitive interface.</p>
            </CardContent>
            <CardFooter>
              <Button variant="link">Read more</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature 3</CardTitle>
              <CardDescription>Secure and reliable</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Rest easy knowing your data is protected with top-notch security.</p>
            </CardContent>
            <CardFooter>
              <Button variant="link">Read more</Button>
            </CardFooter>
          </Card>
        </div> */}
        <div className="flex flex-col mx-1 p-4 gap-12">
          <h1 className="text-4xl font-bold"> Current Auctions </h1>
          <div className="grid grid-cols-4 gap-8">
            {
              itemsList.map(item => (
                <AuctionItemCard key={item.id} item={item} />
              ))
            }
          </div>
        </div>
        <ChatBot user={user} />
    </main>
  );
}
