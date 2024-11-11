'use client';

import CountdownTimer from '@/components/common/countdown-timer';
import { Button } from '@/components/ui/button';
import { getAuctionItems } from '@/db/controller/auctionItems';
import React, { useState } from 'react'


type BidFormProps = {
    item:{
        id: number;
        currentBid: number;
        totalBids: number | null;
        endDate: Date;
    };
    canPlaceBids: boolean | null;
    createAuctionsAction: (itemId: number, bidAmount: number) => void;
  }

const BidForm: React.FC<BidFormProps> = ({ item, canPlaceBids, createAuctionsAction }) => {

    const [minimumBid, setMinimumBid] = useState(item.currentBid + 1);
    const [bidAmount, setBidAmount] = useState(item.currentBid + 1);
    const [errorMessage, setErrorMessage] = useState("");
    // console.log(canPlaceBids);

    const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setBidAmount(value);

        // Set error message if bidAmount is less than minimum required
        if (value < minimumBid) {
            setErrorMessage(`Bid must be at least $${minimumBid}`);
        } else {
            setErrorMessage("");
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (bidAmount >= minimumBid) {
            createAuctionsAction(item.id, bidAmount);
            setMinimumBid(bidAmount + 1); // Update minimumBid to new bid + 1
            setBidAmount(bidAmount + 1);  // Reset bidAmount to new minimumBid
            setErrorMessage("");          // Clear any error message
        }
    };

    console.log(item.endDate);

    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-gray-500 text-sm">{item.totalBids} Bids</p>
                        <p className="text-2xl font-bold">${item.currentBid.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Time Left</p>
                        <CountdownTimer endDate={item.endDate} />
                    </div>
                </div>
                
                <div className="mb-4 flex justify-between items-center">
                    {canPlaceBids && (
                        <>
                            <div>
                                <p className="text-gray-500 text-sm">Enter Your Bid (Minimum ${minimumBid})</p>
                                    <div>
                                        <input
                                            type="number"
                                            min={minimumBid}
                                            value={bidAmount}
                                            onChange={handleBidChange}
                                            className="text-xl font-semibold p-2 border rounded-md w-full"
                                        />
                                        {errorMessage && (
                                            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                                        )}
                                    </div>
                            </div>
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <Button size='lg' disabled={bidAmount < minimumBid}>Place your Bid</Button>
                                </form>
                            </div>
                        
                        </>
                    )}
                </div>

            </div>
    </div>
    )
}

export default BidForm