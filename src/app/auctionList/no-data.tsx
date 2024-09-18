import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function NoDataPage(){
    return (
        <div className="space-y-8 flex flex-col items-center">
            <Image 
                src="/emptyData.svg"
                width="200"
                height="200"
                alt="NoData"
            />
            <h2 className="text-2xl font-bold">You have not placed a Bid yet</h2>
            <Button asChild>
                <Link href="../auction/post">Create Bid</Link>
            </Button>
        </div>
    );
}